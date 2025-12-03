export const assignmentsPage = (req, res) => {
  res.render("assignments", {
    title: "Assignments Dashboard",
    user: req.user,           // If you are sending logged-in user data
  });
};

// Teacher adds new assignment
export const addAssignment = (req, res) => {
  const { title, description, due_date } = req.body;

  // Temporary success response (Later: save to DB)
  return res.json({
    success: true,
    message: "Assignment created successfully",
    data: { title, description, due_date }
  });
};

// Student submits assignment
export const submitAssignment = (req, res) => {
  const { assignment_id, file_url } = req.body;

  return res.json({
    success: true,
    message: "Assignment submitted successfully",
    data: { assignment_id, file_url }
  });
};

// Teacher grades the assignment
export const gradeAssignment = (req, res) => {
  const { grade, feedback } = req.body;
  const assignmentId = req.params.id;

  return res.json({
    success: true,
    message: "Assignment graded",
    data: { assignmentId, grade, feedback }
  });
};
