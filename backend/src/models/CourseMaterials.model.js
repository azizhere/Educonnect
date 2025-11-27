import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createCourseMaterialsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS course_materials (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36),
      title VARCHAR(150),
      file_url TEXT,
      uploaded_by VARCHAR(36),
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    );
  `;
  await pool.execute(query);
};

createCourseMaterialsTable();
