import express from "express";
import {
  submitAssignment,
  viewGrade,
  getAttendance,
  viewCourseDetails,
  viewAssignmentDetails,
  studentDashboard,
} from "../controllers/student.controller.js";
import { uploadAssignment } from "../middleware/uploadAssignment.middleware.js";
import { auth, authorizeRoles } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = express.Router();

router.get("/dashboard", auth, authorizeRoles(ROLES.STUDENT), studentDashboard);

router.post(
  "/assignments/:id/submit",
  auth,
  authorizeRoles(ROLES.STUDENT),
  uploadAssignment.single("file"),
  submitAssignment
);

router.get(
  "/attendance/:course_id",
  auth,
  authorizeRoles(ROLES.STUDENT),
  getAttendance
);

router.get(
  "/assignments/:id/grade",
  auth,
  authorizeRoles(ROLES.STUDENT),
  viewGrade
);

router.get(
  "/course/:id",
  auth,
  authorizeRoles(ROLES.STUDENT),
  viewCourseDetails
);

router.get(
  "/assignment/:id",
  auth,
  authorizeRoles(ROLES.STUDENT),
  viewAssignmentDetails
);

export default router;
