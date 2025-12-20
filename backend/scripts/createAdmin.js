// backend/scripts/createAdmin.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} = process.env;

async function createAdmin() {
  try {
    // 1️⃣ Root connection (NO database)
    const rootConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT || 3306
    });


    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`📦 Database ensured: ${DB_NAME}`);
    await rootConnection.end();

    const pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT || 3306
    });

    
    const id = uuidv4();
    const name = "Admin";
    const email = "admin@edu.local";
    const password = "Admin@123";
    const hash = await bcrypt.hash(password, 10);

    await pool.execute(
      `INSERT INTO users (id, name, email, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, email, hash, "admin"]
    );

    console.log("✅ Admin created:", email);
    process.exit(0);

  } catch (err) {
    console.error("❌ Admin creation failed:", err.message);
    process.exit(1);
  }
}

createAdmin();
