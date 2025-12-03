import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createAssignmentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS assignments (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36) NOT NULL,
      title VARCHAR(150),
      description TEXT,
      due_date DATE NOT NULL,
      attachment_url TEXT,
      created_by VARCHAR(36),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );
  `;
  await pool.execute(query);
};

createAssignmentsTable();



export const createAssignment = async ({
  course_id,
  title,
  description,
  due_date,
  attachment_url,
  created_by
}) => {
  const id = uuidv4();

  await pool.execute(
    `INSERT INTO assignments (id, course_id, title, description, due_date, attachment_url, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      course_id,
      title,
      description,
      due_date,
      attachment_url,
      created_by
    ]
  );

  return { id, course_id, title, description, due_date, attachment_url, created_by };
};

export const getAssignmentsByCourse = async (course_id) => {
  const [rows] = await pool.execute(
    `SELECT * FROM assignments WHERE course_id=? ORDER BY created_at DESC`,
    [course_id]
  );
  return rows;
};

export const getAssignmentWithCourse = async (id) => {
  return pool.execute(
    `SELECT a.*, c.title AS course_title 
     FROM assignments a 
     JOIN courses c ON a.course_id = c.id
     WHERE a.id=?`,
    [id]
  );
};
