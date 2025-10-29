// ============================================
// 🚏 expedienteClinicoRoutes.js
// Rutas para los expedientes médicos de animales
// ============================================

const express = require("express");
const router = express.Router();
const expedienteClinicoController = require("../controllers/expedienteClinicoController");

// 🩺 Expedientes médicos
router.post("/expedientes/create", expedienteClinicoController.crearExpediente);
router.get("/expedientes", expedienteClinicoController.obtenerExpedientes);
router.get("/expedientes/:idAnimal", expedienteClinicoController.obtenerExpedientePorAnimal);

// 📅 Revisiones mensuales
router.post("/revisiones/create", expedienteClinicoController.crearRevision);
router.post("/vacunas/create", expedienteClinicoController.crearVacuna);
router.post("/desparasitaciones/create", expedienteClinicoController.crearDesparasitacion);
router.post("/evaluaciones/create", expedienteClinicoController.crearEvaluacion);

module.exports = router;
