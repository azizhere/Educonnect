import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import teacherRoutes from "./teacher.routes.js";
import studentRoutes from "./student.routes.js";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./course.routes.js";
// import assignmentRoutes from "./assignment.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.redirect("/auth/login");
});

// dashboard
// router.get("/dashboard", (req, res) => {
//   const toast = req.session.toast;  // Toast from login
//   req.session.toast = null;         // Clear it
//   res.render("dashboard/dashboard", { toast });
// });


// Use routes

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/teacher", teacherRoutes);
router.use("/student", studentRoutes);
router.use("/courses", courseRoutes);
// router.use("/assignments", assignmentRoutes);
export default router;
