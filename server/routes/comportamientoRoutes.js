const express = require("express");
const router = express.Router();
const comportamientoController = require("../controllers/comportamientoController");

// 📦 CRUD COMPORTAMIENTO
router.post("/create", comportamientoController.crear);                    // Crear registro
router.get("/", comportamientoController.obtenerTodos);                    // Obtener todos
router.get("/:id_animal", comportamientoController.obtenerPorAnimal);      // Obtener por animal
router.put("/update/:id_comportamiento", comportamientoController.actualizar); // Actualizar registro
router.delete("/delete/:id_comportamiento", comportamientoController.eliminar); // Eliminar registro

module.exports = router;
