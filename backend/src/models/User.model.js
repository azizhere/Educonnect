import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Ensure table exists
export const createUserTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role ENUM('admin','teacher','student') DEFAULT 'student',
  status ENUM('active','inactive') DEFAULT 'active',
  last_login DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
  `;

  await pool.execute(query);
};

createUserTable();

// ✅ Create User
export const createUser = async ({ name, email, password, role }) => {
  const id = uuidv4();

  const query = `
    INSERT INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [id, name, email, password, role];

  await pool.execute(query, values);

  return {
    id,
    name,
    email,
    role,
    status: "active",
  };
};

// ✅ Find By Email
export const findByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?";

  const [rows] = await pool.execute(query, [email]);

  return rows[0];
};
export const getUsersByRoles = async (role) => {
    if (role === "%" || role === "all") {
    const [rows] = await pool.execute("SELECT * FROM users");
    return rows;
  }
  const [rows] = await pool.execute("SELECT * FROM users WHERE role = ?", [role]);
  return rows;
};


export const teacherCount = async(role) =>
{
  const [teacherCountResult] = await pool.execute(
      `SELECT COUNT(*) AS count FROM users WHERE role = 'teacher'`
    );
    const teacherCount = teacherCountResult[0].count;
    return teacherCount;
}

    

    // Count students
  export const studentCount = async() =>
{
    const [studentCountResult] = await pool.execute(
      `SELECT COUNT(*) AS count FROM users WHERE role = 'student'`
    );
    const studentCount = studentCountResult[0].count;
    return studentCount;
  }

  export const courseCount = async() =>
{
  // Count courses
  const [courseCountResult] = await pool.execute(
    `SELECT COUNT(*) AS count FROM courses`
  );
  const courseCount = courseCountResult[0].count;
  return courseCount;
   
  }


export const updateUser = async (id, data) => {
  const fields = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(data), id];

  const query = `UPDATE users SET ${fields} WHERE id = ?`;

  await pool.execute(query, values);

  // return updated user
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};


export const deleteUser = async (id) => {
  const query = "DELETE FROM users WHERE id = ?";
  await pool.execute(query, [id]);
  return true;
};
