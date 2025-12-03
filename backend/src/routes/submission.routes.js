import { Router } from "express";
import { submitAssignmentAPI, listSubmissionsAPI, gradeSubmissionAPI } from "../controllers/submission.controller.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = Router();

router.post("/api/submit", authorizeRoles(ROLES.STUDENT), submitAssignmentAPI);
router.get("/api", authorizeRoles(ROLES.TEACHER, ROLES.ADMIN), listSubmissionsAPI); // query: ?assignmentId=...
router.put("/api/grade/:id", authorizeRoles(ROLES.TEACHER), gradeSubmissionAPI);

export default router;
