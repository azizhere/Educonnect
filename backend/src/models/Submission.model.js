import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createSubmissionsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS submissions (
      id VARCHAR(36) PRIMARY KEY,
      assignment_id VARCHAR(36),
      student_id VARCHAR(36),
      file_url TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      grade VARCHAR(10),
      feedback TEXT,
      FOREIGN KEY (assignment_id) REFERENCES assignments(id),
      FOREIGN KEY (student_id) REFERENCES users(id)
    );
  `;
  await pool.execute(query);
};

createSubmissionsTable();
 