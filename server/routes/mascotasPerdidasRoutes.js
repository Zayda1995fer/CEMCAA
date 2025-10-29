// routes/mascotasPerdidasRoutes.js
const express = require("express");
const router = express.Router();
const { mascotasPerdidasController, upload } = require("../controllers/mascotasPerdidasController");

// 🐾 Crear nueva publicación (con imagen)
router.post("/create", upload.single("imagen"), mascotasPerdidasController.crear);

// 📋 Listar todas las mascotas perdidas
router.get("/", mascotasPerdidasController.listar);

// 🔍 Obtener una mascota perdida por ID
router.get("/:id", mascotasPerdidasController.obtenerPorId);

// 🔄 Actualizar estado (aprobado / rechazado / encontrada)
router.put("/:id/estado", mascotasPerdidasController.actualizarEstado);

module.exports = router;
