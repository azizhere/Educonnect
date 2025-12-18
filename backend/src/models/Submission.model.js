import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createSubmissionsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS submissions (
      id VARCHAR(36) PRIMARY KEY,
      assignment_id VARCHAR(36),
      student_id VARCHAR(36),
      file_url TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status ENUM("submitted","late", "None") DEFAULT "None",
      grade INT DEFAULT NULL,
      graded_at TIMESTAMP NULL DEFAULT NULL,
      feedback TEXT DEFAULT NULL,
      FOREIGN KEY (assignment_id) REFERENCES assignments(id),
      FOREIGN KEY (student_id) REFERENCES users(id),
      UNIQUE (assignment_id, student_id)
    );
  `;
  await pool.execute(query);
};




export const getSubmissionsByAssignment = async (assignment_id) => {
  const [rows] = await pool.execute(
    `SELECT s.*, u.name AS student_name, u.email AS student_email
     FROM submissions s
     JOIN users u ON s.student_id = u.id
     WHERE s.assignment_id = ?
     ORDER BY submitted_at DESC`,
    [assignment_id]
  );
  return rows;
}; 
 

export const updateGradeSubmission = async (id, grade, feedback) => {
  const [result] = await pool.execute(
    `UPDATE submissions 
     SET grade=?, feedback=? 
     WHERE id=?`,
    [grade, feedback, id]
  );

  return result.affectedRows > 0;
};


export const gradeSubmission = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { grade, feedback } = req.body;

    await pool.execute(
      `
      UPDATE submissions 
      SET grade=?, feedback=?, graded_at=NOW() 
      WHERE id=?`,
      [grade, feedback, submissionId]
    );

    res.json({ success: true, message: "Grade saved!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewAssignmentSubmissions = async (req, res) => {
  const assignmentId = req.params.id;

  try {
    const [assignment] = await pool.execute(
      `SELECT a.*, c.title AS course_title 
       FROM assignments a 
       JOIN courses c ON a.course_id = c.id
       WHERE a.id=?`,
      [assignmentId]
    );

    if (assignment.length === 0) return res.send("Assignment not found");

    const [submissions] = await pool.execute(
      `SELECT s.*, u.name AS student_name, u.email 
       FROM submissions s
       JOIN users u ON s.student_id = u.id
       WHERE s.assignment_id=?`,
      [assignmentId]
    );

    res.render("teacher/submissions", {
      title: "Assignment Submissions",
      assignment: assignment[0],
      submissions,
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading submissions for function viewAssignmentSubmissions");
  }
};

// export const getSingleSubmission = async (req, res) => {
//   const submissionId = req.params.id;

//   try {
//     const [rows] = await pool.execute(
//       `SELECT s.*, a.title AS assignment_title, u.name AS student_name
//        FROM submissions s
//        JOIN assignments a ON s.assignment_id = a.id
//        JOIN users u ON s.student_id = u.id
//        WHERE s.id=?`,
//       [submissionId]
//     );

//     if (rows.length === 0) return res.send("Submission not found");

//     res.render("teacher/singleSubmission", {
//       title: "Submission Details",
//       submission: rows[0],
//     });
//   } catch (err) {
//     console.log(err);
//     res.send("Error loading submission for function getSingleSubmission");
//   }
// };


export const getSingleSubmission = async (submissionId) => {
  const [rows] = await pool.execute(
    `SELECT s.*, a.title AS assignment_title, u.name AS student_name, u.email AS student_email
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     JOIN users u ON s.student_id = u.id
     WHERE s.id=?`,
    [submissionId]
  );

  return rows; // data return karo, render mat karo
};
