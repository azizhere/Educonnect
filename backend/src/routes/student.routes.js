import express from "express";
import {
  submitAssignment,
  viewGrade,
  getAttendance,
  viewCourseDetails,
  viewAssignmentDetails,
  studentDashboard,
  getMyCourses,
  getPendingAssignments,
  getGrades,
  viewAttendance ,
  viewProfile,
  getTimetable
} from "../controllers/student.controller.js";
import { uploadAssignment } from "../middleware/uploadAssignment.middleware.js";
import {   verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = express.Router();

router.get("/dashboard",   verifyJWT, authorizeRoles(ROLES.STUDENT), studentDashboard);

// Courses page
router.get("/courses", verifyJWT, authorizeRoles(ROLES.STUDENT), getMyCourses);

// Assignments page
router.get("/assignments", verifyJWT, authorizeRoles(ROLES.STUDENT), getPendingAssignments);

// Grades page
router.get("/grades", verifyJWT, authorizeRoles(ROLES.STUDENT), getGrades);

// Timetable page
router.get("/timetable", verifyJWT, authorizeRoles(ROLES.STUDENT), getTimetable);
router.get(
  "/profile",
  verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  viewProfile
);

// Assignment submission
router.post(
  "/assignments/:id/submit",
  verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  uploadAssignment.single("file"),
  submitAssignment
);

router.get(
  "/attendance", 
  verifyJWT, 
  authorizeRoles(ROLES.STUDENT), 
  viewAttendance
);

// View specific assignment details
router.get(
  "/assignment/:id",
  verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  viewAssignmentDetails
);

// View grade for specific assignment
router.get(
  "/assignments/:id/grade",
  verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  viewGrade
);
// View course details
router.get(
  "/course/:id",
  verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  viewCourseDetails
);

// Attendance
router.get(
  "/attendance/:course_id",
  verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  getAttendance
);



export default router;
