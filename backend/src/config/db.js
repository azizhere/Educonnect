import mysql from "mysql2/promise";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("📌 MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL Connection Error:", err);
    console.log(err)
  }
})();

export default pool;
