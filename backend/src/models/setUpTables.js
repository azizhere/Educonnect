// models/setupTables.js
import { createUserTable } from "./User.model.js";
import { createClassTable } from "./Class.model.js";
import { createCourseTable } from "./Course.model.js";
import { createClassTeacherTable } from "./ClassTeacher.model.js";
import { createClassStudentsTable } from "./ClassStudents.model.js";
import { createCourseMaterialsTable } from "./CourseMaterials.model.js";
import { createAssignmentsTable } from "./Assignment.model.js";
import { createEnrollmentTable } from "./Enrollment.model.js";
import { createSubmissionsTable } from "./Submission.model.js";
import { createTimetableTable } from "./Timetable.model.js";
import { createAttendanceTable } from "./Attendance.model.js";

// async function to setup all tables in correct order
export const setUpTables = async () => {
  try {
    // Parent tables first
    await createUserTable();          // users table
    await createClassTable();         // classes table
    await createCourseTable();        // courses table

    // Dependent tables
    await createClassTeacherTable();  // class_teacher table (depends on users + classes)
    await createClassStudentsTable(); // class_students table
    await createEnrollmentTable();    // enrollment table
    await createCourseMaterialsTable(); // course_materials table
    await createAssignmentsTable();      // assignments table
    await createSubmissionsTable();      // submissions table
    await createTimetableTable();       // timetable table
    await createAttendanceTable();      // attendance table

    console.log("✅ All tables created successfully");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  }
};
