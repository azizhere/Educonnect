import { Router } from "express";
import {
  adminDashboard,
  // teacher
  adminTeachersPage,
  addTeacherPage,
  createTeacherController,
  editTeacherPage,
  updateTeacherController,
  deleteTeacherController,

  // student
  adminStudentsPage,
  addStudentPage,
  createStudentController,
  editStudentPage,
  updateStudentController,
  deleteStudentController,
  // courses
  adminCoursesPage,
  addCoursePage,
  createCourseController,
  assignCoursePage,
  assignCourse,
  editCoursePage,
  editCourseAction,
  deleteCourseController
} from "../controllers/admin.controller.js";

import { verifyJWT  } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = Router();
// ADMIN PANEL SHOULD BE JWT + ROLE PROTECTED
router.use(verifyJWT, (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).send("Access denied");
  }
  next();
});


// Admin Dashboard
router.get("/dashboard",  adminDashboard);


// Admin Teacher
router.get("/teachers",  adminTeachersPage);

router.get("/teachers/add",  addTeacherPage);

router.post("/teachers/add",  createTeacherController);
// Edit Teacher
router.get("/teachers/edit/:id", editTeacherPage);
router.post("/teachers/edit/:id", updateTeacherController);

// Delete Teacher
router.get("/teachers/delete/:id", deleteTeacherController);



// Admin Student 
router.get("/students",  adminStudentsPage);

router.get("/students/add",  addStudentPage);

router.post("/students/add",  createStudentController);
// Edit Student
router.get("/students/edit/:id", editStudentPage);
router.post("/students/edit/:id", updateStudentController);

// Delete Student
router.get("/students/delete/:id", deleteStudentController);



// Admin COurses 
router.get("/courses",  adminCoursesPage);

router.get("/courses/add",  addCoursePage);

router.post("/courses/add",  createCourseController);
 
router.get("/courses/assign/:id",  assignCoursePage);

router.post("/courses/assign/:id",  assignCourse);
// Edit Course
router.get("/courses/edit/:id", editCoursePage);       // Page to edit course
router.post("/courses/edit/:id", editCourseAction);   // Submit update

// Delete Course
router.post("/courses/delete/:id", deleteCourseController);  // Delete course


export default router;
