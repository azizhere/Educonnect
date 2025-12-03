import authService from "../services/auth.service.js";
import { sendResponse } from "../utils/response.js";
import ROLES from "../constants/roles.js";

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


   if (result.success) {
     req.session.user = {
        id: result.user.id,
        role: result.user.role,
        name: result.user.name
    };

    // ROLE BASED REDIRECTS
    if (result.user.role === ROLES.ADMIN) {
      return res.redirect("/admin/dashboard");
    }

    if (result.user.role === ROLES.TEACHER) {
      return res.redirect("/teacher/dashboard");
    }

    if (result.user.role === ROLES.STUDENT) {
      return res.redirect("/student/dashboard");
    }

    return res.redirect("/"); // fallback
}


  } catch (err) {
    console.error("Login Controller Error:", err);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

