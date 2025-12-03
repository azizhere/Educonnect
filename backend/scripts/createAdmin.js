// backend/scripts/createAdmin.js
import pool from "../src/config/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const id = uuidv4();
const name = "Admin";
const email = "admin@edu.local";
const password = "Admin@123"; // change after
const hash = await bcrypt.hash(password, 10);

await pool.execute(
  `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
  [id, name, email, hash, "admin"]
);
console.log("admin created", email);
process.exit(0);
