const express = require("express");
const router = express.Router();
const desparasitacionesController = require("../controllers/desparasitacionesController");

// 📦 CRUD DESPARASITACIONES
router.post("/create", desparasitacionesController.crear);                    // Crear nueva desparasitación
router.get("/", desparasitacionesController.obtenerTodas);                    // Obtener todas
router.get("/:id_salud", desparasitacionesController.obtenerPorSalud);        // Obtener por salud
router.put("/update/:id_desparasitacion", desparasitacionesController.actualizar); // Actualizar registro
router.delete("/delete/:id_desparasitacion", desparasitacionesController.eliminar); // Eliminar registro

module.exports = router;
