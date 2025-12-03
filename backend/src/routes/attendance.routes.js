import { Router } from "express";
import { attendancePage, markAttendance, studentAttendance } from "../controllers/attendance.controller.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = Router();

// UI page to view/mark attendance (admin/teacher)
router.get("/", authorizeRoles(ROLES.ADMIN, ROLES.TEACHER), attendancePage);

// API to mark single attendance (teacher)
router.post("/api/mark", authorizeRoles(ROLES.TEACHER), markAttendance);

// API to get student attendance (teacher/admin/student-self)
router.get("/api/student/:studentId", authorizeRoles(ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT), studentAttendance);

export default router;
