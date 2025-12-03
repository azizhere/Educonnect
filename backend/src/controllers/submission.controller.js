import { submitAssignment, listSubmissions, gradeSubmission } from "../services/submission.service.js";

export const submitAssignmentAPI = async (req, res) => {
  try {
    const { assignment_id, file_url } = req.body;
    const student_id = req.session?.user?.id || req.body.student_id;
    await submitAssignment({ assignment_id, student_id, file_url });
    return res.json({ success: true, message: "Submission saved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error submitting" });
  }
};

export const listSubmissionsAPI = async (req, res) => {
  try {
    const { assignmentId } = req.query;
    const rows = await listSubmissions(assignmentId);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error fetching submissions" });
  }
};

export const gradeSubmissionAPI = async (req, res) => {
  try {
    const id = req.params.id; // submission id
    const { grade, feedback } = req.body;
    await gradeSubmission(id, { grade, feedback, graded_by: req.session?.user?.id || null });
    return res.json({ success: true, message: "Graded" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error grading" });
  }
};
