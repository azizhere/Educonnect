import pool from "../config/db.js";
import {
  createAssignment,
  getAssignmentsByCourse,
  getAssignmentWithCourse,
} from "../models/Assignment.model.js";
import { getSubmissionsByAssignment, getSingleSubmission } from "../models/submission.model.js";
import { updateGradeSubmission } from "../models/submission.model.js";
import {
  getStudentsByCourse,
  markAttendance,
  getAttendanceByCourse,
} from "../models/Attendance.model.js";
import { getTeacherTimetable } from "../models/Timetable.model.js";

export const addAssignment = async (req, res) => {
  console.log("Logged in user:", req.user);
  try {
    const { course_id, title, description, due_date } = req.body;
    const created_by = req.user.id;

    const attachment_url = req.file
      ? `/uploads/assignments/${req.file.filename}`
      : null;

    const assignment = await createAssignment({
      course_id,
      title,
      description,
      due_date,
      attachment_url,
      created_by,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully!",
      assignment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourseAssignments = async (req, res) => {
  try {
    const { course_id } = req.params;
    const assignments = await getAssignmentsByCourse(course_id);

    res.json({ success: true, assignments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const teacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;
    console.log("Logged in user:", req.user);
    // 1) Assigned courses
    const [courses] = await pool.execute(
      `SELECT id, title, description, created_at 
       FROM courses WHERE instructor = ?`,
      [teacherId]
    );

    // 2) Pending submissions count
    const [pending] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM submissions s
       LEFT JOIN assignments a ON s.assignment_id = a.id
       WHERE a.created_by = ? AND s.grade IS NULL`,
      [teacherId]
    );

    // 3) Upcoming timetable (optional)
    const [timetable] = await pool.execute(
      `SELECT t.day, t.start_time, t.end_time, c.name AS class_name 
       FROM timetable t
       LEFT JOIN classes c ON t.class_id = c.id
       WHERE t.teacher_id = ?`,
      [teacherId]
    );

    res.render("teacher/dashboard", {
      title: "Teacher Dashboard",
      courses,
      pending: pending[0].total,
      timetable,
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading teacher dashboard");
  }
};

export const teacherCourses = async (req, res) => {
  const teacherId = req.user.id;

  const [courses] = await pool.execute(
    "SELECT id, title, description FROM courses WHERE instructor = ?",
    [teacherId]
  );

  res.render("teacher/courses", {
    title: "My Courses",
    courses,
  });
};

export const uploadMaterialPage = async (req, res) => {
  const courseId = req.params.id;

  const [course] = await pool.execute(
    "SELECT id, title FROM courses WHERE id = ?",
    [courseId]
  );

  if (!course.length)
    return res.redirect("/teacher/courses?toast=Course not found");

  res.render("teacher/uploadMaterial", {
    title: "Upload Material",
    course: course[0],
  });
};

export const uploadMaterialAction = async (req, res) => {
  try {
    const courseId = req.params.id;
    const teacherId = req.user.id;
    const { title } = req.body;

    const fileUrl = req.file ? "/uploads/materials/" + req.file.filename : null;

    await pool.execute(
      `INSERT INTO course_materials (id, course_id, title, file_url, uploaded_by)
       VALUES (UUID(), ?, ?, ?, ?)`,
      [courseId, title, fileUrl, teacherId]
    );

    res.redirect(`/teacher/courses?toast=Material uploaded`);
  } catch (err) {
    console.log(err);
    res.send("Upload failed");
  }
};

export const viewSubmissions = async (req, res) => {
  try {
    const { assignment_id } = req.params;

    const submissions = await getSubmissionsByAssignment(assignment_id);

    res.json({
      success: true,
      submissions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const gradeStudentSubmission = async (req, res) => {
  try {
    const { id } = req.params; // submission ID
    const { grade, feedback } = req.body;

    if (!grade) {
      return res.status(400).json({
        success: false,
        message: "Grade is required",
      });
    }

    const updated = await updateGradeSubmission(id, grade, feedback || null);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.json({
      success: true,
      message: "Submission graded successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Load Attendance Page
export const attendancePage = async (req, res) => {
  const { course_id } = req.params;

  const students = await getStudentsByCourse(course_id);

  res.render("teacher/attendance", {
    title: "Mark Attendance",
    students,
    course_id,
  });
};

// Save Attendance
export const saveAttendance = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { date, attendance } = req.body; // attendance = { student_id: "present" }

    for (let student_id in attendance) {
      await markAttendance({
        student_id,
        course_id,
        date,
        status: attendance[student_id],
      });
    }

    res.json({
      success: true,
      message: "Attendance saved successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View Attendance History
export const attendanceHistory = async (req, res) => {
  const { course_id } = req.params;
  const records = await getAttendanceByCourse(course_id);

  res.render("teacher/attendanceHistory", {
    title: "Attendance History",
    records,
  });
};

// VIEW TIMETABLE (Teacher)
export const teacherTimetablePage = async (req, res) => {
  const teacher_id = req.user.id;

  const timetable = await getTeacherTimetable(teacher_id);

  res.render("teacher/timetable", {
    title: "My Timetable",
    timetable,
  });
};

// controllers/teacher.controller.js
export const viewAssignmentSubmissions = async (req, res) => {
  const assignmentId = req.params.id;

  try {
    const assignment = await getAssignmentWithCourse(assignmentId);
    if (!assignment || assignment.length === 0)
      return res.send("Assignment not found");

    const submissions = await getSubmissionsByAssignment(assignmentId);

    res.render("teacher/submissions", {
      title: "Assignment Submissions",
      assignment: assignment[0],
      submissions,
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading submissions");
  }
};


export const viewSingleSubmission = async (req, res) => {
  const submissionId = req.params.id;

  try {
    const submission = await getSingleSubmission(submissionId);

    if (!submission || submission.length === 0)
      return res.send("Submission not found");

    res.render("teacher/singleSubmission", {
      title: "Submission Details",
      submission: submission[0],
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading submission");
  }
};
