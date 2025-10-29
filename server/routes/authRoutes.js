// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register-usuario", authController.registerUsuario);
router.post("/register-empleado", authController.registerEmpleado);


module.exports = router;
