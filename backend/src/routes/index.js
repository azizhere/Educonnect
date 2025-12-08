import { Router } from "express";
import { verifyJWT,preventBackHistory, redirectIfLoggedIn } from "../middleware/auth.middleware.js";
// import dotenv from 'dotenv';
// dotenv.config(); // Must be at the top



import adminRoutes from "./admin.routes.js";
import teacherRoutes from "./teacher.routes.js";
import studentRoutes from "./student.routes.js";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./course.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import submissionRoutes from "./submission.routes.js";

// import assignmentRoutes from "./assignment.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.redirect("/auth/login");
});

router.use("/auth", preventBackHistory,  authRoutes);

// Use routes

router.use("/admin",verifyJWT, adminRoutes);
router.use("/teacher",verifyJWT, teacherRoutes);
router.use("/student",verifyJWT, studentRoutes);
// Shared
router.use("/courses",verifyJWT, courseRoutes);
router.use("/submissions",verifyJWT, submissionRoutes);
router.use("/attendance",verifyJWT, attendanceRoutes);
export default router;
