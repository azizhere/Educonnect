import pool from "../config/db.js";
import {
  createAssignment,
  getAssignmentsByCourse,
  getAssignmentWithCourse,
} from "../models/Assignment.model.js";
import {
  getSubmissionsByAssignment,
  getSingleSubmission,
} from "../models/submission.model.js";
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

// export const getCourseAssignments = async (req, res) => {
//   try {
//     const { course_id } = req.params;
//     const [assignments] = await pool.execute(
//       "SELECT * FROM assignments WHERE course_id = ?",
//       [course_id]
//     );

//     const [course] = await pool.execute(
//       "SELECT title FROM courses WHERE id = ?",
//       [course_id]
//     );

//     res.render("teacher/courseAssignments", {
//       title: `Assignments for ${course[0].title}`,
//       assignments,
//       course_title: course[0].title,
//     });
//   } catch (err) {
//     res.send("Error loading assignments");
//   }
// };


export const getCourseAssignments = async (req, res) => {
  try {
    const { course_id } = req.params;
    console.log("Course ID:", course_id);

    const [assignments] = await pool.execute(
      "SELECT * FROM assignments WHERE course_id = ?",
      [course_id]
    );
    console.log("Assignments:", assignments);

    const [course] = await pool.execute(
      "SELECT title FROM courses WHERE id = ?",
      [course_id]
    );
    console.log("Course:", course);

    if (!course.length) return res.send("Course not found");

    res.render("teacher/courseAssignments", {
      title: `Assignments for ${course[0].title}`,
      assignments,
      course_title: course[0].title,
    });
  } catch (err) {
    console.error("Error in getCourseAssignments:", err);
    res.send("Error loading assignments");
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
export const viewCourseSubmissions = async (req, res) => {
  const { course_id } = req.params;

  // Fetch all assignments for this course
  const [assignments] = await pool.execute(
    "SELECT * FROM assignments WHERE course_id = ?",
    [course_id]
  );

  if (!assignments.length) return res.send("No assignments for this course");

  // You can either flatten all submissions or handle assignment-wise
  let submissions = [];
  for (let a of assignments) {
    const s = await getSubmissionsByAssignment(a.id);
    s.forEach(sub => (sub.assignment_title = a.title));
    submissions.push(...s);
  }

  res.render("submissionList", { submissions, assignments });
};


export const viewSubmissions = async (req, res) => {
  const { assignment_id } = req.params;

  const [assignment] = await pool.execute(
    "SELECT title FROM assignments WHERE id = ?",
    [assignment_id]
  );

  const submissions = await getSubmissionsByAssignment(assignment_id);

  res.render("teacher/submissionsList", {
    title: `Submissions for ${assignment[0].title}`,
    assignment: assignment[0],
    submissions,
  });
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
export const viewGradePage = async (req, res) => {
  const submissionId = req.params.id;
  const submission = await getSingleSubmission(submissionId);

  res.render("teacher/gradeSubmission", {
    title: "Grade Submission",
    submission: submission[0],
  });
};
// List all submissions of all assignments created by the logged-in teacher
export const allSubmissions = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [submissions] = await pool.execute(
      `SELECT s.id AS submission_id, s.grade, s.feedback, s.submitted_at AS submitted_at,
          a.title AS assignment_title, c.title AS course_title, u.name AS student_name
   FROM submissions s
   JOIN assignments a ON s.assignment_id = a.id
   JOIN courses c ON a.course_id = c.id
   JOIN users u ON s.student_id = u.id
   WHERE a.created_by = ?
   ORDER BY s.submitted_at DESC`,
      [teacherId]
    );

    res.render("teacher/allSubmissions", {
      title: "All Submissions",
      submissions,
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading submissions");
  }
};
// List all pending submissions for assignments created by the logged-in teacher
export const pendingSubmissions = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [submissions] = await pool.execute(
      `SELECT s.id AS submission_id, s.grade, s.feedback, s.submitted_at AS submitted_at,
              a.title AS assignment_title, c.title AS course_title, u.name AS student_name
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN courses c ON a.course_id = c.id
       JOIN users u ON s.student_id = u.id
       WHERE a.created_by = ? AND s.grade IS NULL
       ORDER BY s.submitted_at DESC`,
      [teacherId]
    );

    res.render("teacher/pendingSubmissions", {
      title: "Pending Submissions",
      submissions,
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading pending submissions");
  }
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

// List all assignments created by the logged-in teacher
export const teacherAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [assignments] = await pool.execute(
      `SELECT a.id, a.title, a.due_date, c.title AS course_name
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
       WHERE a.created_by = ?`,
      [teacherId]
    );

    res.render("teacher/assignments", {
      title: "My Assignments",
      assignments,
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading assignments");
  }
};

export const createAssignmentPage = async (req, res) => {
  const { course_id } = req.query; // pass course_id in query
  res.render("teacher/createAssignment", {
    course_id,
    title: "Create Assignment",
  });
  if (!course_id) return res.send("Course ID missing");
};
