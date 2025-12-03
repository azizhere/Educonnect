import {
  createAttendanceRecord,
  getAttendanceByClassAndDate,
  getStudentAttendance,
} from "../services/attendance.service.js";

export const attendancePage = async (req, res) => {
  // admin/teacher view — simple page to mark / view
  const { classId, date } = req.query;
  const records = await getAttendanceByClassAndDate(classId, date || new Date().toISOString().slice(0,10));
  res.render("attendance/index", { records, classId, date: date || new Date().toISOString().slice(0,10) });
};

export const markAttendance = async (req, res) => {
  try {
    const { class_id, student_id, date, status } = req.body;
    await createAttendanceRecord({ class_id, student_id, date, status, marked_by: req.session?.user?.id || null });
    return res.json({ success: true, message: "Attendance marked" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error marking attendance" });
  }
};

export const studentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const rows = await getStudentAttendance(studentId);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching attendance" });
  }
};
