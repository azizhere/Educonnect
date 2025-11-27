import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createTimetableTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS timetable (
      id VARCHAR(36) PRIMARY KEY,
      class_id VARCHAR(36),
      course_id VARCHAR(36),
      teacher_id VARCHAR(36),
      day VARCHAR(20),
      start_time TIME,
      end_time TIME,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
  `;
  await pool.execute(query);
};

createTimetableTable();
