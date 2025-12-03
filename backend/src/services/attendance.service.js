import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createAttendanceRecord = async ({ class_id, student_id, date, status, marked_by }) => {
  const id = uuidv4();
  // date expected YYYY-MM-DD
  await pool.execute(
    `INSERT INTO attendance (id, class_id, student_id, date, status, marked_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, class_id, student_id, date, status, marked_by]
  );
  return { id, class_id, student_id, date, status, marked_by };
};

export const getAttendanceByClassAndDate = async (class_id, date) => {
  const [rows] = await pool.execute(
    `SELECT a.*, u.name AS student_name
     FROM attendance a
     LEFT JOIN users u ON a.student_id = u.id
     WHERE a.class_id = ? AND a.date = ?`,
    [class_id, date]
  );
  return rows;
};

export const getStudentAttendance = async (student_id) => {
  const [rows] = await pool.execute(
    `SELECT a.*, c.name AS class_name
     FROM attendance a
     LEFT JOIN classes c ON a.class_id = c.id
     WHERE a.student_id = ?
     ORDER BY a.date DESC`,
    [student_id]
  );
  return rows;
};
