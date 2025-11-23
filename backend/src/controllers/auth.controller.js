const authService = require("../services/auth.service");
const { registerValidation } = require("../validations/auth.validation");
const { sendResponse } = require("../utils/response");

module.exports = {
  // POST /auth/register
  async register(req, res) {
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
  }
};