import authService from "../services/auth.service.js";
import { registerValidation } from "../validations/auth.validation.js";
import { sendResponse } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    // 1. Validate input
    const { error } = registerValidation.validate(req.body);
    if (error) {
      // return sendResponse(res, 400, false, error.details[0].message);
      return res.render("auth/register", { message: error.details[0].message });
    }

    const { name, email, password, role } = req.body;

    // 2. Use auth service to register user
    const result = await authService.register({
      name,
      email,
      password,
      role,
    });

    if (!result.success) {
      // return sendResponse(res, 400, false, result.message);
      return res.render("auth/register", { message: result.message });
    }

    // 3. Success
    // return sendResponse(res, 201, true, "User registered", result.user);
    return res.redirect("/auth/login");

  } catch (err) {
    console.error("Register Controller Error:", err);
    // return sendResponse(res, 500, false, "Internal server error");
    return res.render("auth/register", { message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate basic input
    if (!email || !password) {
      // return sendResponse(res, 400, false, "Email and password are required");
      return res.render("auth/login", { message: "Email and password are required" });
    }

    // call service
    const result = await authService.login(email, password);

    if (!result.success) {
      // return sendResponse(res, 400, false, result.message);
      return res.render("auth/login", { message: result.message });
    }

    // SUCCESS → return token + user to check validation
    // return sendResponse(res, 200, true, "Login successful", {
    //   user: result.user,
    //   token: result.token,
    // });

    req.session.toast = "Login successful";
    return res.redirect("/dashboard");

  } catch (err) {
    console.error("Login Controller Error:", err);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

