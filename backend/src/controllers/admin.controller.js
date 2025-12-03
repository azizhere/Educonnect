import bcrypt from "bcrypt";
import {
  createUser,
  // findUserByEmail,
  // getUsersByRole
} from "../models/User.model.js";

import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse
} from "../models/Course.model.js";

import ROLES from "../constants/roles.js";

// Dashboard
export const adminDashboard = (req, res) => {
  res.render("admin/dashboard", { title: "Admin Dashboard" });
};

/* ---------------------- TEACHERS ---------------------- */

// Teachers List
export const adminTeachersPage = async (req, res) => {
  const teachers = await getUsersByRole(ROLES.TEACHER);
  res.render("admin/teachers", { title: "Manage Teachers", teachers });
};

// Add Teacher Page
export const addTeacherPage = (req, res) => {
  res.render("admin/addTeacher", { title: "Add Teacher" });
};

export const createTeacherController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await findUserByEmail(email);
    if (exists) {
      return res.render("admin/addTeacher", {
        title: "Add Teacher",
        error: "Email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await createUser({
      name,
      email,
      password: hash,
      role: ROLES.TEACHER
    });

    res.redirect("/admin/teachers?toast=Teacher added successfully");
  } catch (err) {
    console.log(err);
    res.render("admin/addTeacher", {
      title: "Add Teacher",
      error: "Something went wrong!"
    });
  }
};

/* ---------------------- STUDENTS ---------------------- */

export const adminStudentsPage = async (req, res) => {
  const students = await getUsersByRole(ROLES.STUDENT);
  res.render("admin/students", { title: "Manage Students", students });
};

export const addStudentPage = (req, res) => {
  res.render("admin/addStudent", { title: "Add Student" });
};

export const createStudentController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await findUserByEmail(email);
    if (exists) {
      return res.render("admin/addStudent", {
        title: "Add Student",
        error: "Email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await createUser({
      name,
      email,
      password: hash,
      role: ROLES.STUDENT,
    });

    res.redirect("/admin/students?toast=Student added successfully");
  } catch (err) {
    console.log(err);
    res.render("admin/addStudent", {
      title: "Add Student",
      error: "Something went wrong!"
    });
  }
};

/* ---------------------- COURSES ---------------------- */

// All Courses
export const adminCoursesPage = async (req, res) => {
  const courses = await getAllCourses();
  res.render("admin/courses", { title: "Manage Courses", courses });
};

// Add Course Page
export const addCoursePage = async (req, res) => {
  const teachers = await getUsersByRole(ROLES.TEACHER);
  res.render("admin/addCourse", { title: "Add Course", teachers });
};

// Create Course
export const createCourseController = async (req, res) => {
  try {
    const { title, description, teacher } = req.body;

    if (!title || !teacher) {
      return res.render("admin/addCourse", {
        title: "Add Course",
        error: "Title and teacher are required!"
      });
    }

    await createCourse({
      title,
      description,
      instructor: teacher
    });

    res.redirect("/admin/courses?toast=Course created successfully");
  } catch (err) {
    console.log(err);
    res.render("admin/addCourse", {
      title: "Add Course",
      error: "Something went wrong!",
    });
  }
};

// Assign Teacher Page
export const assignCoursePage = async (req, res) => {
  const courses = await getAllCourses();
  const teachers = await getUsersByRole(ROLES.TEACHER);

  const course = courses.find((c) => c.id === req.params.id);
  if (!course) {
    return res.redirect("/admin/courses?toast=Course not found");
  }

  res.render("admin/assignCourse", {
    title: "Assign Teacher",
    course,
    teachers
  });
};

// Assign Teacher POST
export const assignCourse = async (req, res) => {
  const { teacher } = req.body;
  const { id } = req.params;

  await updateCourse(id, { instructor: teacher });

  res.redirect("/admin/courses?toast=Teacher assigned successfully!");
};
