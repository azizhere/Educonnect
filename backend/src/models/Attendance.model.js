import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createAttendanceTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS attendance (
      id VARCHAR(36) PRIMARY KEY,
      class_id VARCHAR(36),
      student_id VARCHAR(36),
      course_id VARCHAR(36),
      date DATE,
      status ENUM('present', 'absent', 'late') DEFAULT 'present',
      marked_by VARCHAR(36),
      marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (marked_by) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      UNIQUE(class_id, student_id,course_id, date)
    );
  `;
  await pool.execute(query);
};





// Insert attendance for a student
export const markAttendance = async ({ student_id, course_id, date, status }) => {
  const id = uuidv4();
  await pool.execute(
    `INSERT INTO attendance (id, student_id, course_id, date, status)
     VALUES (?, ?, ?, ?, ?)`,
    [id, student_id, course_id, date, status]
  );

  return { id };
};

// Get students of course (joined from ClassStudents table)
// export const getStudentsByCourse = async (course_id) => {
//   const [rows] = await pool.execute(`
//     SELECT u.id, u.name, u.email
//     FROM class_students cs
//     JOIN users u ON cs.student_id = u.id
//     WHERE cs.course_id = ?
//   `, [course_id]);

//   return rows;
// };

export const getStudentsByCourse = async (class_id) => {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email
     FROM users u
     JOIN class_students cs ON u.id = cs.student_id
     WHERE cs.class_id = ?`,
    [class_id]
  );

  return rows;
};



// export const getStudentsByCourse = async (course_id) => {
//   const [rows] = await pool.execute(
//     `SELECT u.id, u.name, u.email, cs.status
//      FROM users u
//      LEFT JOIN course_students cs ON u.id = cs.student_id AND cs.course_id = ?
//      WHERE u.role = 'student'`,
//     [course_id]
//   );

//   return rows;
// };

// View attendance history
export const getAttendanceByCourse = async (course_id) => {
  const [rows] = await pool.execute(`
    SELECT a.*, u.name AS student_name
    FROM attendance a
    JOIN users u ON a.student_id = u.id
    WHERE a.course_id = ?
    ORDER BY a.date DESC
  `, [course_id]);

  return rows;
};