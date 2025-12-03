import { Router } from "express";
import express from "express";
import {
  teacherDashboard,
  uploadMaterialPage,
  uploadMaterialAction,
  addAssignment,
  getCourseAssignments,
  attendancePage,
  attendanceHistory,
  saveAttendance,
  teacherTimetablePage,
  viewSubmissions,
  teacherCourses,
  viewAssignmentSubmissions,
  viewSingleSubmission,
  gradeStudentSubmission
} from "../controllers/teacher.controller.js";
import upload from "../middleware/upload.middleware.js"; // multer for files
import { auth, authorizeRoles} from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";
import { uploadAssignmentFile } from "../middleware/assignmentUpload.middleware.js";

const router = Router();

router.get("/dashboard", auth, authorizeRoles(ROLES.TEACHER), teacherDashboard);
router.get("/courses", auth, authorizeRoles(ROLES.TEACHER), teacherCourses);
router.get("/courses/:id/materials/upload", auth, authorizeRoles(ROLES.TEACHER), uploadMaterialPage);

router.post(
  "/courses/:id/materials/upload",
  auth,
  authorizeRoles(ROLES.TEACHER),
  upload.single("file"),
  uploadMaterialAction
);

router.post(
  "/assignment/create",
  auth,
  authorizeRoles(ROLES.TEACHER),
  uploadAssignmentFile.single("attachment"),
  addAssignment
);

router.get(
  "/assignment/:course_id",
  auth,
  authorizeRoles(ROLES.TEACHER, ROLES.STUDENT),
  getCourseAssignments
);

router.get(
  "/submissions/:assignment_id",
  auth,
  authorizeRoles(ROLES.TEACHER),
  viewSubmissions
);

router.put(
  "/submissions/grade/:id",
  auth,
  authorizeRoles(ROLES.TEACHER),
  gradeStudentSubmission
);


router.post(
  "/submissions/:id/grade",
  auth,
  authorizeRoles(ROLES.TEACHER),
  gradeStudentSubmission
);

router.get("/attendance/:course_id", 
  auth,
  authorizeRoles(ROLES.TEACHER), 
  attendancePage);

router.post("/attendance/:course_id", 
  auth,
  authorizeRoles(ROLES.TEACHER), 
  saveAttendance);

router.get("/attendance/history/:course_id", 
  auth,
  authorizeRoles(ROLES.TEACHER),
  attendanceHistory);


router.get("/timetable",
  auth,
  authorizeRoles(ROLES.TEACHER), 
  teacherTimetablePage);


router.get(
  "/assignments/:id/submissions",
  auth,
  authorizeRoles(ROLES.TEACHER),
  viewAssignmentSubmissions
);

router.get(
  "/submission/:id",
  auth,
  authorizeRoles(ROLES.TEACHER),
  viewSingleSubmission
);


export default router;
