import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Create Table if not exists
const createCourseTable = async () => {
  const query = `
 CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(36) PRIMARY KEY,
  fid INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor) REFERENCES users(id),
  UNIQUE(fid)
);
  `;
  await pool.execute(query);
};

createCourseTable();

// Model Functions
export const createCourse = async ({ title, description, instructor }) => {
  const id = uuidv4();
  const [result] = await pool.execute(
    `INSERT INTO courses (id, title, description, instructor)
     VALUES (?, ?, ?, ?)`,
    [id, title, description, instructor]
  );
  return { id, title, description, instructor };
};

export const getAllCourses = async () => {
  const [rows] = await pool.execute(`SELECT 
      c.fid,
      c.id,
      c.title,
      c.description,
      c.created_at,
      u.name AS instructor_name
    FROM courses c
    LEFT JOIN users u ON c.instructor = u.id`);
  return rows;
};

export const updateCourse = async (id, data) => {
  const { title, description, instructor } = data;
  
  await pool.execute(
    `UPDATE courses SET title=?, description=?, instructor=? WHERE id=?`,
    [title, description, instructor, id]
  );
  
  return { id, title, description, instructor };
  // return true;
};

export const deleteCourse = async (id) => {
  await pool.execute(`DELETE FROM courses WHERE id=?`, [id]);
  return true;
};