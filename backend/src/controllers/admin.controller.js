import bcrypt from "bcrypt";
import {
  createUser,
  teacherCount,
  studentCount,
  courseCount,
  updateUser,
  deleteUser,
  // findUserByEmail,
  getUsersByRoles
} from "../models/User.model.js";

import {
  createCourse,
  getAllCourses,
  updateCourse,
  findUserByEmail,
  getUsersByRole,
  deleteCourse
} from "../models/Course.model.js";

import ROLES from "../constants/roles.js";
import { enrollStudentInCourse } from "../models/Enrollment.model.js";
// Dashboard
export const adminDashboard = async (req, res) => {
  try {
    const numberOfTeacher = await teacherCount();
    const numberOfStudent = await studentCount();
    const numberOfCourses = await courseCount();
    let users;
    const { filter } = req.query;
    if (!filter || filter === "all") {
    users = await getUsersByRoles("%"); // custom function below
  } else {
    users = await getUsersByRoles(filter);
  }

  return res.render("admin/dashboard", { title: "Admin Dashboard",
     counts: {
        teachers: numberOfTeacher,
        students: numberOfStudent,
        courses: numberOfCourses
      },
      user: req.user,
      users,
      filter:filter || "all",
      toast: req.toast,
  });
}catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).send("Something went wrong");
  }
};

/* ---------------------- TEACHERS ---------------------- */

// Teachers List
export const adminTeachersPage = async (req, res) => {
  const teachers = await getUsersByRole(ROLES.TEACHER);
  res.render("admin/teacher", { title: "Manage Teachers", teachers });
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
/* ---------------------- EDIT TEACHER ---------------------- */

export const editTeacherPage = async (req, res) => {
  const { id } = req.params;
  const teachers = await getUsersByRole(ROLES.TEACHER);
  const teacher = teachers.find(t => t.id === id);

  if (!teacher) {
    return res.redirect("/admin/teachers?toast=Teacher not found");
  }

  res.render("admin/editTeacher", { title: "Edit Teacher", teacher });
};

export const updateTeacherController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updated = await updateUser(id, { name, email });

    if (!updated) {
      return res.redirect("/admin/teachers?toast=Update failed");
    }

    res.redirect("/admin/teachers?toast=Teacher updated successfully");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/teachers?toast=Something went wrong");
  }
};

/* ---------------------- DELETE TEACHER ---------------------- */

export const deleteTeacherController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteUser(id);

    if (!deleted) {
      return res.redirect("/admin/teachers?toast=Teacher not found");
    }

    res.redirect("/admin/teachers?toast=Teacher deleted successfully");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/teachers?toast=Error deleting teacher");
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

export const editStudentPage = async (req, res) => {
  const { id } = req.params;
  const students = await getUsersByRole(ROLES.STUDENT);
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.redirect("/admin/students?toast=Student not found");
  }

  res.render("admin/editStudent", { title: "Edit Student", student });
};

export const updateStudentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updated = await updateUser(id, { name, email });

    if (!updated) {
      return res.redirect("/admin/students?toast=Update failed");
    }

    res.redirect("/admin/students?toast=Student updated successfully");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/students?toast=Something went wrong");
  }
};

export const deleteStudentController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteUser(id);

    if (!deleted) {
      return res.redirect("/admin/students?toast=Student not found");
    }

    res.redirect("/admin/students?toast=Student deleted successfully");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/students?toast=Error deleting student");
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


/* ---------------------- EDIT COURSE ---------------------- */
export const editCoursePage = async (req, res) => {
  const { id } = req.params;
  const courses = await getAllCourses();
  const course = courses.find(c => c.id === id);

  if (!course) {
    return res.redirect("/admin/courses?toast=Course not found");
  }
    const teachers = await getUsersByRole(ROLES.TEACHER); // fetch all teachers

  res.render("admin/editCourses", { title: "Edit Course", course, teachers });
};

export const editCourseAction = async (req, res) => {
  const { id } = req.params;
  const { title, description, instructor } = req.body;

  await updateCourse(id, { title, description, instructor });
  res.redirect("/admin/courses?toast=Course updated successfully");
};

/* ---------------------- DELETE COURSE ---------------------- */
export const deleteCourseController = async (req, res) => {
  const { id } = req.params;
  await deleteCourse(id);
  res.redirect("/admin/courses?toast=Course deleted successfully");
};

// Show Enrollment Form Page
export const showEnrollmentPage = async (req, res) => {
  try {
    const students = await getUsersByRole("student");
    const teachers = await getUsersByRole("teacher");
    const courses = await getAllCourses();

    return res.render("admin/enrollment", {
      title: "Enroll Student",
      students,
      courses,
      user: req.user,
      toast: req.toast
    });
  } catch (error) {
    console.log("Enrollment Page Error:", error);
    return res.status(500).send("Failed to load enrollment page");
  }
};

// Handle Enrollment Submission
export const enrollStudentController = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    console.log("BODY:", req.body);
    if (!student_id || !course_id) {
      return res.redirect("/admin/enroll?toast=All fields are required");
    }

    await enrollStudentInCourse({student_id, course_id});

    return res.redirect("/admin/enroll?toast=Student enrolled successfully");
  } catch (error) {
    console.log("Enroll Error:", error);
    return res.redirect("/admin/enroll?toast=Failed to enroll student");
  }
};

// export const showEnrollmentPage = async (req, res) => {
//   try {
//     const [students] = await pool.execute(
//       "SELECT id, name, email FROM users WHERE role = 'student'"
//     );

//     const [courses] = await pool.execute(
//       "SELECT id, title FROM courses"
//     );

//     res.render("admin/enrollment", {
//       title: "Enroll Student",
//       students,
//       courses,
//     });
//   } catch (err) {
//     console.log(err);
//     res.send("Error loading enrollment page");
//   }
// };




// export const enrollStudent = async (req, res) => {
//   try {
//     const { student_id, course_id } = req.body;

//     // Check if already enrolled
//     const [exists] = await pool.execute(
//       "SELECT * FROM enrolments WHERE student_id = ? AND course_id = ?",
//       [student_id, course_id]
//     );

//     if (exists.length > 0) {
//       req.toast("Student is already enrolled in this course!");
//       return res.redirect("/admin/enroll");
//     }

//     // Insert new enrolment
//     await pool.execute(
//       "INSERT INTO enrolments (student_id, course_id) VALUES (?, ?)",
//       [student_id, course_id]
//     );

//     req.toast("Student enrolled successfully!");
//     res.redirect("/admin/enroll");
//   } catch (err) {
//     console.log(err);
//     req.toast("Error enrolling student");
//     res.redirect("/admin/enroll");
//   }
// };
