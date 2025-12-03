import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const submitAssignment = async ({ assignment_id, student_id, file_url }) => {
  const id = uuidv4();
  // UNIQUE constraint on (assignment_id, student_id) in table prevents duplicates
  await pool.execute(
    `INSERT INTO submissions (id, assignment_id, student_id, file_url)
     VALUES (?, ?, ?, ?)`,
    [id, assignment_id, student_id, file_url]
  );
  return { id, assignment_id, student_id, file_url };
};

export const listSubmissions = async (assignmentId) => {
  const [rows] = await pool.execute(
    `SELECT s.*, u.name AS student_name
     FROM submissions s
     LEFT JOIN users u ON s.student_id = u.id
     WHERE s.assignment_id = ?
     ORDER BY s.submitted_at DESC`,
    [assignmentId]
  );
  return rows;
};

export const gradeSubmission = async (submissionId, { grade, feedback, graded_by }) => {
  await pool.execute(
    `UPDATE submissions SET grade = ?, feedback = ? WHERE id = ?`,
    [grade, feedback, submissionId]
  );
  // optional logging: insert into grades table if you add one
  return true;
};
