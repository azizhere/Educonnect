import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByEmail, createUser } from "../models/User.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async ({ name, email, password, role }) => {
  try {
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

  } catch (err) {
    console.error("Auth Service Error:", err);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const login = async (email, password) => {
  try {
    const user = await findByEmail(email);

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };

  } catch (err) {
    console.error("Auth Service Login Error:", err);
    return { success: false, message: "Something went wrong" };
  }
};


export default {
  register,
  login
};
