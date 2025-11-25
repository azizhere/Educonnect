import { Router } from "express";

import authRoutes from "./auth.routes.js";
// import courseRoutes from "./course.routes.js";
// import assignmentRoutes from "./assignment.routes.js";

const router = Router();

// Use routes
router.use("/auth", authRoutes);
// router.use("/courses", courseRoutes);
// router.use("/assignments", assignmentRoutes);

export default router;
