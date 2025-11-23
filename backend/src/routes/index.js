const express = require("express");
const router = express.Router();

// Import route files
const authRoutes = require("./auth.routes");
const courseRoutes = require("./course.routes");
const assignmentRoutes = require("./assignment.routes");

// Use routes
router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/assignments", assignmentRoutes);

module.exports = router;
