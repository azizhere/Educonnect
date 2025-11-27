import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createAttendanceTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS attendance (
      id VARCHAR(36) PRIMARY KEY,
      class_id VARCHAR(36),
      student_id VARCHAR(36),
      date DATE,
      status VARCHAR(10),
      marked_by VARCHAR(36),
      marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (marked_by) REFERENCES users(id)
    );
  `;
  await pool.execute(query);
};

createAttendanceTable();
