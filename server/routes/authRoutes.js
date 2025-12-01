// routes/authRoutes.js

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// LOGIN
router.post("/login", authController.login);

// REGISTRO DE USUARIO NORMAL
router.post("/register-usuario", authController.registerUsuario);

// REGISTRO DE EMPLEADO
router.post("/register-empleado", authController.registerEmpleado);

module.exports = router;
