import { Router } from "express";
import {
  addCourse,
  getCourses,
   updateCourseController,
  deleteCourseController,
  coursesPage
} from "../controllers/course.controller.js";

const router = Router();

// ---------------- UI PAGE ROUTE ----------------
router.get("/", coursesPage);

// ---------------- API ROUTES -------------------
router.get("/api", getCourses);          // list
router.post("/api", addCourse);          // create
router.put("/api/:id", updateCourseController);  // update
router.delete("/api/:id", deleteCourseController); // delete


export default router;
