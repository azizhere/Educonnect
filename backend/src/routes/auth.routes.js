import { Router } from "express";
import {login} from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("auth/login", { message: null });
});

router.post("/login", login);
export default router;