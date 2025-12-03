import { Router } from "express";
import {
  assignmentsPage,
  addAssignment,
  submitAssignment,
  gradeAssignment
} from "../controllers/assignment.controller.js";

import { authorizeRoles } from "../middleware/auth.js";
import { ROLES } from "../config/roles.js";

const router = Router();

router.get("/", authorizeRoles(ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT), assignmentsPage);

router.post("/api", authorizeRoles(ROLES.TEACHER), addAssignment);

router.post("/api/submit", authorizeRoles(ROLES.STUDENT), submitAssignment);

router.put("/api/grade/:id", authorizeRoles(ROLES.TEACHER), gradeAssignment);

export default router;
