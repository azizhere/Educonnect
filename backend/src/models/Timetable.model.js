import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createTimetableTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS timetable (
      id VARCHAR(36) PRIMARY KEY,
      class_id VARCHAR(36),
      course_id VARCHAR(36),
      teacher_id VARCHAR(36),
      day ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
      start_time TIME,
      end_time TIME,
      room VARCHAR(50),
      student_id VARCHAR(36) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
  `;
  await pool.execute(query);
};





//  Create slot
export const addTimetableSlot = async ({ course_id, teacher_id, day, start_time, end_time, room }) => {
  const id = uuidv4();

  await pool.execute(
    `INSERT INTO timetable(id, course_id, teacher_id, day, start_time, end_time, room)
     VALUES (?,?,?,?,?,?,?)`,
    [id, course_id, teacher_id, day, start_time, end_time, room]
  );

  return { id };
};

// Get teacher's weekly timetable
export const getTeacherTimetable = async (teacher_id) => {
  const [rows] = await pool.execute(`
    SELECT t.*, c.title AS course_title
    FROM timetable t
    JOIN courses c ON t.course_id = c.id
    WHERE t.teacher_id = ?
    ORDER BY FIELD(day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
             start_time
  `, [teacher_id]);

  return rows;
};

// Delete a timetable slot (admin only)
export const deleteSlot = async (id) => {
  await pool.execute(`DELETE FROM timetable WHERE id = ?`, [id]);
  return true;
};