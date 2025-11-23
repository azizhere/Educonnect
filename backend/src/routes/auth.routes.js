const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// POST → Register User
router.post("/register", authController.register);

module.exports = router;
