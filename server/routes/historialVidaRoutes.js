const express = require("express");
const router = express.Router();
const historialVidaController = require("../controllers/historialVidaController");

// 📦 CRUD HISTORIAL DE VIDA
router.post("/create", historialVidaController.crear);                   // Crear nuevo historial
router.get("/", historialVidaController.obtenerTodos);                   // Obtener todos
router.get("/:id_animal", historialVidaController.obtenerPorAnimal);     // Obtener por animal
router.put("/update/:id_historial", historialVidaController.actualizar); // Actualizar historial
router.delete("/delete/:id_historial", historialVidaController.eliminar); // Eliminar historial

module.exports = router;
