import courseService from "../services/course.service.js";
import { sendResponse } from "../utils/response.js";
import { getAllCourses } from "../models/Course.model.js";

export const addCourse = async (req, res) => {
  try {
    const course = await courseService.addCourse(req.body);
    return sendResponse(res, 201, true, "Course created", course);
  } catch (err) {
    console.log(err);
    return sendResponse(res, 500, false, "Error creating course");
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await courseService.listCourses();
    return sendResponse(res, 200, true, "Courses fetched", courses);
  } catch (err) {
    return sendResponse(res, 500, false, "Error fetching courses");
  }
};

export const updateCourseController = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCourse = await courseService.editCourse(id, req.body);

    return sendResponse(res, 200, true, "Course updated", updatedCourse);

  } catch (err) {
    return sendResponse(res, 500, false, "Error updating course");
  }
};

export const deleteCourseController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await courseService.removeCourse(id);

    return sendResponse(res, 200, true, "Course deleted", deletedCourse);

  } catch (err) {
    return sendResponse(res, 500, false, "Error deleting course");
  }
};


export const coursesPage = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.render("course/courses", { courses });
  } catch (err) {
    console.log(err);
    res.render("courses", { courses: [] });
  }
};