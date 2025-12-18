import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createCourseMaterialsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS course_materials (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36) NOT NULL,
      title VARCHAR(150) NOT NULL,
      file_url TEXT NOT NULL,
      uploaded_by VARCHAR(36) NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    );
  `;
  await pool.execute(query);
};




// Insert material
export const uploadCourseMaterial = async ({ course_id, title, file_url, uploaded_by }) => {
  const id = uuidv4();

  await pool.execute(
    `INSERT INTO course_materials (id, course_id, title, file_url, uploaded_by)
     VALUES (?, ?, ?, ?, ?)`,
    [id, course_id, title, file_url, uploaded_by]
  );

  return { id, course_id, title, file_url, uploaded_by };
};

// Get all materials for course
export const getCourseMaterials = async (course_id) => {
  const [rows] = await pool.execute(
    `SELECT * FROM course_materials WHERE course_id=?`,
    [course_id]
  );
  return rows;
};