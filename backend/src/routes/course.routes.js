import { Router } from "express";
import {
  addCourse,
  getCourses,
   updateCourseController,
  deleteCourseController
} from "../controllers/course.controller.js";

const router = Router();

router.post("/", addCourse);     // create
router.get("/", getCourses);     // list

// Update course
router.put("/:id", updateCourseController);

// Delete course
router.delete("/:id", deleteCourseController);

export default router;
