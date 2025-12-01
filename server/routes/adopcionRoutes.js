// server/routes/adopcionRoutes.js
const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');

// Rutas para solicitudes de adopción con patrón Composite

// Crear nueva solicitud (POST)
router.post('/crear', solicitudController.crearSolicitud);

// Obtener solicitud completa (GET)
router.get('/solicitud/:id', solicitudController.obtenerSolicitudCompleta);

// Listar todas las solicitudes (GET)
router.get('/solicitudes', solicitudController.listarSolicitudes);

// Actualizar estatus de solicitud (PUT)
router.put('/solicitud/:id/estatus', solicitudController.actualizarEstatus);

module.exports = router;