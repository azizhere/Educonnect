import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const router = Router();

// POST → Register User
router.post("/register", register);

export default router;
