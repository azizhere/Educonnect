import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createClassTeacherTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS class_teacher (
      id VARCHAR(36) PRIMARY KEY,
      class_id VARCHAR(36),
      teacher_id VARCHAR(36),
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id),
      UNIQUE (class_id, teacher_id)
    );
  `;
  await pool.execute(query);
};



export const addClassTeacher = async ({ class_id, teacher_id }) => {
  const id = uuidv4();

  await pool.execute(
    `INSERT INTO class_teacher (id, class_id, teacher_id) VALUES (?, ?, ?)`,
    [id, class_id, teacher_id]
  );

  return { id, class_id, teacher_id };
};
