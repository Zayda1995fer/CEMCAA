const express = require("express");
const router = express.Router();
const solicitudController = require("../controllers/adopcionController");

// Crear una nueva solicitud de adopción
router.post("/crear", solicitudController.crear);

// Obtener todas las solicitudes
router.get("/todas", solicitudController.obtenerTodas);

// Obtener una solicitud por su ID
router.get("/:id", solicitudController.obtenerPorId);

// Aprobar una solicitud
router.put("/:id/aprobar", solicitudController.aprobar);

// Rechazar una solicitud
router.put("/:id/rechazar", solicitudController.rechazar);

module.exports = router;
