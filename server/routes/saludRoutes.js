const express = require("express");
const router = express.Router();
const saludController = require("../controllers/saludController");

// 📦 CRUD SALUD GENERAL
router.post("/create", saludController.crear);                 // Crear nuevo registro de salud
router.get("/", saludController.obtenerTodos);                 // Obtener todos los registros
router.get("/por-animal/:id_animal", saludController.obtenerPorAnimal);   // Obtener por ID de animal
router.put("/update/:id_salud", saludController.actualizar);   // Actualizar registro
router.delete("/delete/:id_salud", saludController.eliminar);  // Eliminar registro

module.exports = router;
