import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const createClassTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS classes (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      year INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.execute(query);
};

createClassTable();

export const createClass = async ({ name, year }) => {
  const id = uuidv4();

  await pool.execute(
    `INSERT INTO classes (id, name, year) VALUES (?, ?, ?)`,
    [id, name, year]
  );

  return { id, name, year };
};

export const getAllClasses = async () => {
  const [rows] = await pool.execute("SELECT * FROM classes");
  return rows;
};
