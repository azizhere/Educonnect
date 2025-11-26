import { Router } from "express";
import { register, login} from "../controllers/auth.controller.js";
// import { register } from "../controllers/auth.controller.js";

const router = Router();

// POST → Register User
router.post("/register", register);
router.post("/login", login);
router.get("/register", (req, res) => {
  res.render("auth/register", { message: null });
});
router.get("/login", (req, res) => {
  res.render("auth/login", { message: null });
});



export default router;