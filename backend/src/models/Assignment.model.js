import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createAssignmentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS assignments (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36),
      title VARCHAR(150),
      description TEXT,
      due_date DATE,
      created_by VARCHAR(36),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );
  `;
  await pool.execute(query);
};

createAssignmentsTable();
