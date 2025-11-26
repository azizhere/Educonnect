import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Create Table if not exists
const createCourseTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(100) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      instructor VARCHAR(150),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
};

createCourseTable();

// Model Functions
export const createCourse = async ({ title, description, instructor }) => {
  const id = uuidv4();
  const [result] = await pool.query(
    `INSERT INTO courses (id, title, description, instructor)
     VALUES (?, ?, ?, ?)`,
    [id, title, description, instructor]
  );
  return { id, title, description, instructor };
};

export const getAllCourses = async () => {
  const [rows] = await pool.query(`SELECT * FROM courses`);
  return rows;
};

export const updateCourse = async (id, data) => {
  const { title, description, instructor } = data;
  
  await pool.query(
    `UPDATE courses SET title=?, description=?, instructor=? WHERE id=?`,
    [title, description, instructor, id]
  );
  
  return { id, title, description, instructor };
  // return true;
};

export const deleteCourse = async (id) => {
  await pool.query(`DELETE FROM courses WHERE id=?`, [id]);
  return true;
};
