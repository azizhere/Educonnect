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
    teacherAssignments,
    pendingSubmissions,
    allSubmissions,
    viewCourseSubmissions,
    createAssignmentPage,
    viewGradePage,
  gradeStudentSubmission
} from "../controllers/teacher.controller.js";
import upload from "../middleware/upload.middleware.js"; // multer for files
import {   verifyJWT, authorizeRoles} from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";
import { uploadAssignmentFile } from "../middleware/assignmentUpload.middleware.js";

const router = Router();

router.get("/dashboard",   verifyJWT, authorizeRoles(ROLES.TEACHER), teacherDashboard);
router.get("/courses",   verifyJWT, authorizeRoles(ROLES.TEACHER), teacherCourses);
router.get("/courses/:id/materials/upload",   verifyJWT, authorizeRoles(ROLES.TEACHER), uploadMaterialPage);

router.post(
  "/courses/:id/materials/upload",
    verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  upload.single("file"),
  uploadMaterialAction
);

router.post(
  "/assignment/create",
    verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  uploadAssignmentFile.single("attachment"),
  addAssignment
);

router.get("/assignment/create", verifyJWT, authorizeRoles(ROLES.TEACHER), createAssignmentPage);
router.get(
  "/assignment/:course_id",
    verifyJWT,
  authorizeRoles(ROLES.TEACHER, ROLES.STUDENT),
  getCourseAssignments
);

router.get(
  "/submissions/:assignment_id",
    verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  viewSubmissions
);

router.put(
  "/submissions/grade/:id",
    verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  gradeStudentSubmission
);
// teacher.routes.js
router.get(
  "/assignments/:course_id/submissions",
  verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  viewAssignmentSubmissions
);

router.get(
  "/assignments/:course_id/submissions",
  verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  viewCourseSubmissions
);


router.post(
  "/submissions/:id/grade",
    verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  gradeStudentSubmission
);

router.get("/attendance/:course_id", 
    verifyJWT,
  authorizeRoles(ROLES.TEACHER), 
  attendancePage);

router.post("/attendance/:course_id", 
    verifyJWT,
  authorizeRoles(ROLES.TEACHER), 
  saveAttendance);

router.get("/attendance/history/:course_id", 
    verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  attendanceHistory);


router.get("/timetable",
    verifyJWT,
  authorizeRoles(ROLES.TEACHER), 
  teacherTimetablePage);


router.get(
  "/assignments/:id/submissions",
    verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  viewAssignmentSubmissions
);
router.get(
  "/assignments",
  verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  teacherAssignments
);

router.get(
  "/submissions",
  verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  allSubmissions
);

router.get(
  "/pending-submissions",
  verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  pendingSubmissions
);

router.get(
  "/submission/:id",
    verifyJWT,
  authorizeRoles(ROLES.TEACHER),
  viewSingleSubmission
);

router.get("/submissions/grade/:id", verifyJWT, authorizeRoles(ROLES.TEACHER), viewGradePage);


export default router;
