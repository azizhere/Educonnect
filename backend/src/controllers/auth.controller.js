import authService from "../services/auth.service.js";
import { registerValidation } from "../validations/auth.validation.js";
import { sendResponse } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    // 1. Validate input
    const { error } = registerValidation(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
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
      return sendResponse(res, 400, false, result.message);
    }

    // 3. Success
    return sendResponse(res, 201, true, "User registered", result.user);

  } catch (err) {
    console.error("Register Controller Error:", err);
    return sendResponse(res, 500, false, "Internal server error");
  }
};
