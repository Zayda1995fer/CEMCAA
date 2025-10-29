const express = require("express");
const router = express.Router();
const solicitudController = require("../controllers/adopcionController");

router.post("/crear", solicitudController.crear);
router.get("/todas", solicitudController.obtenerTodas);
router.put("/solicitudes/:id/aprobar", solicitudController.aprobar);
router.put("/solicitudes/:id/rechazar", solicitudController.rechazar);


module.exports = router;
