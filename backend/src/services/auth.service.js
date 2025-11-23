const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

module.exports = {
  // Register new user
  async register({ name, email, password, role }) {
    // 1. Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already exists"
      };
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const newUser = await User.createUser({
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
  }
};
