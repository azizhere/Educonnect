import { Router } from "express";
import {
  addCourse,
  getCourses,
   updateCourseController,
  deleteCourseController,
  coursesPage
} from "../controllers/course.controller.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = Router();

router.get("/", authorizeRoles(ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT), coursesPage);

// API ROUTES
// View
router.get("/api", authorizeRoles(ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT), getCourses);

// Create
router.post("/api", authorizeRoles(ROLES.ADMIN, ROLES.TEACHER), addCourse);

// Update
router.put("/api/:id", authorizeRoles(ROLES.ADMIN, ROLES.TEACHER), updateCourseController);

// Delete (Admin only)
router.delete("/api/:id", authorizeRoles(ROLES.ADMIN), deleteCourseController);

export default router;