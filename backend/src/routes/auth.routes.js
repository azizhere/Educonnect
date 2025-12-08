import { Router } from "express";
import {login, logout} from "../controllers/auth.controller.js";
import {preventBackHistory, redirectIfLoggedIn} from "../middleware/auth.middleware.js"
const router = Router();

router.get("/login", preventBackHistory, redirectIfLoggedIn,  (req, res) => {
   if (req.session.user) {
    // If already logged in, redirect to dashboard
    return res.redirect(`/${req.session.user.role}/dashboard`);
  }
  res.render("auth/login", { message: null });
});

router.post("/login", login);
router.get("/logout", preventBackHistory, logout);
export default router;