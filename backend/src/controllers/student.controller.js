// controllers/student.controller.js
import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

import {getAttendanceByCourse} from "../models/Attendance.model.js";

export const submitAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const studentId = req.user.id;   // from JWT
    const file_url = req.file.filename;

    const id = uuidv4();

    await pool.execute(`
      INSERT INTO submissions (id, assignment_id, student_id, file_url)
      VALUES (?, ?, ?, ?)`,
      [id, assignmentId, studentId, file_url]
    );

    res.json({ success: true, message: "Assignment submitted!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const viewGrade = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const studentId = req.user.id;

    const [rows] = await pool.execute(`
      SELECT grade, feedback, graded_at 
      FROM submissions 
      WHERE assignment_id=? AND student_id=?`,
      [assignmentId, studentId]
    );

    res.json(rows[0] || { message: "Not graded yet" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const studentDashboard = async (req, res) => {
  const studentId = req.user.id;

  try {
    // 1. Courses
    const [courses] = await pool.execute(`
      SELECT c.id, c.title, c.description
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
    `, [studentId]);

    // 2. Pending Assignments
    const [assignments] = await pool.execute(`
      SELECT a.id, a.title, a.due_date, c.title AS course
      FROM assignments a
      JOIN courses c ON c.id = a.course_id
      WHERE a.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?)
      AND a.id NOT IN (
        SELECT assignment_id FROM submissions WHERE student_id = ?
      )
      ORDER BY a.due_date ASC
    `, [studentId, studentId]);

    // 3. Recent Grades
    const [grades] = await pool.execute(`
      SELECT s.grade, s.feedback, a.title AS assignment, c.title AS course 
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN courses c ON a.course_id = c.id
      WHERE s.student_id = ?
      ORDER BY s.graded_at DESC LIMIT 5
    `, [studentId]);

    // 4. Attendance
    const [attendance] = await pool.execute(`
      SELECT 
        COUNT(*) AS total_classes,
        SUM(CASE WHEN status='present' THEN 1 ELSE 0 END) AS present
      FROM attendance
      WHERE student_id=?
    `, [studentId]);

    // 5. Timetable
    const [timetable] = await pool.execute(`
      SELECT * FROM timetable WHERE student_id=?
    `, [studentId]);
    res.render("student/dashboard", {
  title: "Student Dashboard",
  courses,
  assignments,
  grades,
  attendance,
  timetable
});


  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Dashboard error" });
  }
};




export const viewCourseDetails = async (req, res) => {
  const { id } = req.params;   // course_id
  const studentId = req.user.id;

  try {
    // 1. Ensure student is enrolled
    const [enroll] = await pool.execute(
      "SELECT * FROM enrollments WHERE student_id=? AND course_id=?",
      [studentId, id]
    );

    if (enroll.length === 0) {
      return res.status(403).send("You are not enrolled in this course.");
    }

    // 2. Fetch course
    const [course] = await pool.execute(
      "SELECT title, description FROM courses WHERE id=?",
      [id]
    );

    // 3. Fetch course materials
    const [materials] = await pool.execute(
      `SELECT id, title, file_url, uploaded_at 
       FROM course_materials 
       WHERE course_id=? 
       ORDER BY uploaded_at DESC`,
      [id]
    );

    // 4. Fetch course assignments
    const [assignments] = await pool.execute(
      `SELECT id, title, due_date 
       FROM assignments 
       WHERE course_id=? 
       ORDER BY due_date ASC`,
      [id]
    );

    res.render("student/courseDetails", {
      title: course[0].title,
      course: course[0],
      materials,
      assignments
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading course page");
  }
};



export const viewAssignmentDetails = async (req, res) => {
  const assignmentId = req.params.id;
  const studentId = req.user.id;

  try {
    // Assignment details
    const [assignment] = await pool.execute(
      `SELECT a.*, c.title AS course_title
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
       WHERE a.id=?`,
      [assignmentId]
    );

    if (assignment.length === 0) {
      return res.status(404).send("Assignment not found.");
    }

    // Check if student already submitted
    const [submission] = await pool.execute(
      `SELECT *
       FROM submissions
       WHERE assignment_id=? AND student_id=?`,
      [assignmentId, studentId]
    );

    res.render("student/assignmentDetails", {
      title: assignment[0].title,
      assignment: assignment[0],
      submission: submission[0] || null
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading assignment details");
  }
};



// Get list of courses for student
export const getMyCourses = async (req, res) => {
  const studentId = req.user.id;
  try {
    const [courses] = await pool.execute(
      "SELECT c.id, c.title, c.description FROM enrollments e JOIN courses c ON e.course_id=c.id WHERE e.student_id=?",
      [studentId]
    );
    res.render("student/myCourses", { title: "My Courses", courses });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching courses");
  }
};

// Get list of pending assignments for student
export const getPendingAssignments = async (req, res) => {
  const studentId = req.user.id;
  try {
    const [assignments] = await pool.execute(
      `SELECT a.id, a.title, a.due_date, c.title AS course
       FROM assignments a
       JOIN courses c ON a.course_id=c.id
       WHERE a.course_id IN (SELECT course_id FROM enrollments WHERE student_id=?)
       AND a.id NOT IN (SELECT assignment_id FROM submissions WHERE student_id=?)`,
      [studentId, studentId]
    );
    res.render("student/assignments", { title: "Pending Assignments", assignments });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching assignments");
  }
};

// Get grades for student
export const getGrades = async (req, res) => {
  const studentId = req.user.id;
  try {
    const [grades] = await pool.execute(
      `SELECT s.grade, s.feedback, a.title AS assignment, c.title AS course 
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN courses c ON a.course_id = c.id
       WHERE s.student_id=?`,
      [studentId]
    );
    res.render("student/grades", { title: "Grades", grades });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching grades");
  }
};

// Get timetable for student
export const getTimetable = async (req, res) => {
  const studentId = req.user.id;
  try {
    const [timetable] = await pool.execute(
      "SELECT * FROM timetable WHERE student_id=?",
      [studentId]
    );
    res.render("student/timetable", { title: "Timetable", timetable });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching timetable");
  }
};


// controllers/student.controller.js

export const viewAttendance = async (req, res) => {
  const studentId = req.user.id;

  try {
    const [attendance] = await pool.execute(`
      SELECT 
        COUNT(*) AS total_classes,
        SUM(CASE WHEN status='present' THEN 1 ELSE 0 END) AS present
      FROM attendance
      WHERE student_id=?
    `, [studentId]);

    res.render("student/attendance", {
      title: "Attendance",
      attendance
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading attendance page");
  }
};






export const getAttendance = async (req, res) => {
  try {
    const { course_id } = req.params;   // match your route
    const student_id = req.user.id;     // use 'id', not '_id'

    const records = await getAttendanceByCourse(course_id);

    // Filter only this student's attendance
    const attendance = records.filter(r => r.student_id === student_id);

    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};