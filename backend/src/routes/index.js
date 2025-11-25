import { Router } from "express";

import authRoutes from "./auth.routes.js";
// import courseRoutes from "./course.routes.js";
// import assignmentRoutes from "./assignment.routes.js";

const router = Router();


// dashboard
router.get("/dashboard", (req, res) => {
  const toast = req.session.toast;  // Toast from login
  req.session.toast = null;         // Clear it
  res.render("dashboard/dashboard", { toast });
});


// Use routes
router.use("/auth", authRoutes);
// router.use("/courses", courseRoutes);
// router.use("/assignments", assignmentRoutes);

export default router;
