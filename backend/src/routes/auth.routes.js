import { Router } from "express";
import {login} from "../controllers/auth.controller.js";
import {preventBackHistory} from "../middleware/auth.middleware.js"
const router = Router();

router.get("/login", preventBackHistory, (req, res) => {
   if (req.session.user) {
    // If already logged in, redirect to dashboard
    return res.redirect(`/${req.session.user.role}/dashboard`);
  }
  res.render("auth/login", { message: null });
});

router.post("/login", login);
export default router;