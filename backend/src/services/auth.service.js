import bcrypt from "bcryptjs";
import { findByEmail, createUser } from "../models/User.model.js";

export const register = async ({ name, email, password, role }) => {
  // 1. Check if email already exists
  const existingUser = await findByEmail(email);
  if (existingUser) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create user in DB
  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return {
    success: true,
    message: "User registered successfully",
    user: newUser,
  };
};
export default {
  register,
};
