// routes/vacunasRoutes.js
const express = require("express");
const router = express.Router();
const vacunasController = require("../controllers/vacunasController");

// 📦 CRUD VACUNAS
router.post("/create", vacunasController.crear);                // Crear nueva vacuna
router.get("/:id_salud", vacunasController.obtenerPorSalud);    // Obtener vacunas por ID de salud
router.put("/update/:id_vacuna", vacunasController.actualizar); // Actualizar vacuna
router.delete("/delete/:id_vacuna", vacunasController.eliminar); // Eliminar vacuna

module.exports = router;
