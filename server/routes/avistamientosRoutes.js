const express = require("express");
const router = express.Router();
const avistamientosController = require("../controllers/avistamientosController");

// Crear nuevo aviso
router.post("/create", avistamientosController.crear);

// Listar todos los avisos
router.get("/", avistamientosController.listar);

// Listar avisos de una mascota específica
router.get("/mascota/:id", avistamientosController.listarPorMascota);

module.exports = router;
