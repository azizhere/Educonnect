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
import {   verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = express.Router();

router.get("/dashboard",   verifyJWT, authorizeRoles(ROLES.STUDENT), studentDashboard);

router.post(
  "/assignments/:id/submit",
    verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  uploadAssignment.single("file"),
  submitAssignment
);

router.get(
  "/attendance/:course_id",
    verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  getAttendance
);

router.get(
  "/assignments/:id/grade",
    verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  viewGrade
);

router.get(
  "/course/:id",
    verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  viewCourseDetails
);

router.get(
  "/assignment/:id",
    verifyJWT,
  authorizeRoles(ROLES.STUDENT),
  viewAssignmentDetails
);

export default router;
