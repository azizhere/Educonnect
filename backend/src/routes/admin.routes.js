import { Router } from "express";
import {
  adminDashboard,
  // teacher
  adminTeachersPage,
  addTeacherPage,
  createTeacherController,
  // student
  adminStudentsPage,
  addStudentPage,
  createStudentController,
  // courses
  adminCoursesPage,
  addCoursePage,
  createCourseController,
  assignCoursePage,
  assignCourse,
} from "../controllers/admin.controller.js";

import { auth, authorizeRoles } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = Router();
// ADMIN PROTECTED ROUTES
router.use(auth, authorizeRoles(ROLES.ADMIN));


// Admin Dashboard
router.get("/dashboard", auth, authorizeRoles(ROLES.ADMIN), adminDashboard);


// Admin Teacher
router.get("/teachers", auth, authorizeRoles(ROLES.ADMIN), adminTeachersPage);

router.get("/teachers/add", auth, authorizeRoles(ROLES.ADMIN), addTeacherPage);

router.post("/teachers/add", auth, authorizeRoles(ROLES.ADMIN), createTeacherController);


// Admin Student 
router.get("/students", auth, authorizeRoles(ROLES.ADMIN), adminStudentsPage);

router.get("/students/add", auth, authorizeRoles(ROLES.ADMIN), addStudentPage);

router.post("/students/add", auth, authorizeRoles(ROLES.ADMIN), createStudentController);


// Admin COurses 
router.get("/courses", auth, authorizeRoles(ROLES.ADMIN), adminCoursesPage);

router.get("/courses/add", auth, authorizeRoles(ROLES.ADMIN), addCoursePage);

router.post("/courses/add", auth, authorizeRoles(ROLES.ADMIN), createCourseController);

// Admin Assign Teacher to course 
router.get("/courses/assign/:id", auth, authorizeRoles(ROLES.ADMIN), assignCoursePage);

router.post("/courses/assign/:id", auth, authorizeRoles(ROLES.ADMIN), assignCourse);

export default router;
