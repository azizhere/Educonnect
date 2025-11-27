import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createClassStudentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS class_students (
      id VARCHAR(36) PRIMARY KEY,
      class_id VARCHAR(36),
      student_id VARCHAR(36),
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (student_id) REFERENCES users(id)
    );
  `;
  await pool.execute(query);
};

createClassStudentsTable();

export const addStudentToClass = async ({ class_id, student_id }) => {
  const id = uuidv4();

  await pool.execute(
    `INSERT INTO class_students (id, class_id, student_id) VALUES (?, ?, ?)`,
    [id, class_id, student_id]
  );

  return { id, class_id, student_id };
};
