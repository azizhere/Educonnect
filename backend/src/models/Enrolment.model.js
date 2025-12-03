import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createEnrollmentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS enrollments (
      id VARCHAR(36) PRIMARY KEY,
      student_id VARCHAR(36),
      course_id VARCHAR(36),
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      UNIQUE (student_id, course_id)
    );
  `;
  await pool.execute(query);
};

createEnrollmentTable();

export const enrollStudent = async ({ student_id, course_id }) => {
  const id = uuidv4();

  await pool.execute(
    `INSERT INTO enrollments (id, student_id, course_id)
     VALUES (?, ?, ?)`,
    [id, student_id, course_id]
  );

  return { id, student_id, course_id };
};

export const getEnrolmentsByStudent = async (student_id) => {
  const [rows] = await pool.execute(
    `SELECT e.*, c.title FROM enrolments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?`,
    [student_id]
  );
  return rows;
};