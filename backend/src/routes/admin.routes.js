import { Router } from "express";
import {
  adminDashboard,
  adminTeachersPage,
  addTeacherPage,
  createTeacherController,
  adminStudentsPage,
  addStudentPage,
  createStudentController,
  adminCoursesPage,
  addCoursePage,
  createCourseController,
  assignCoursePage,
  assignCourse,
} from "../controllers/admin.controller.js";

import { auth, authorizeRoles } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = Router();

router.get("/dashboard", auth, authorizeRoles(ROLES.ADMIN), adminDashboard);

router.get("/teachers", auth, authorizeRoles(ROLES.ADMIN), adminTeachersPage);

router.get("/teachers/add", auth, authorizeRoles(ROLES.ADMIN), addTeacherPage);

router.post("/teachers/add", auth, authorizeRoles(ROLES.ADMIN), createTeacherController);

router.get("/students", auth, authorizeRoles(ROLES.ADMIN), adminStudentsPage);

router.get("/students/add", auth, authorizeRoles(ROLES.ADMIN), addStudentPage);

router.post("/students/add", auth, authorizeRoles(ROLES.ADMIN), createStudentController);

router.get("/courses", auth, authorizeRoles(ROLES.ADMIN), adminCoursesPage);

router.get("/courses/add", auth, authorizeRoles(ROLES.ADMIN), addCoursePage);

router.post("/courses/add", auth, authorizeRoles(ROLES.ADMIN), createCourseController);

router.get("/courses/assign/:id", auth, authorizeRoles(ROLES.ADMIN), assignCoursePage);

router.post("/courses/assign/:id", auth, authorizeRoles(ROLES.ADMIN), assignCourse);

export default router;
