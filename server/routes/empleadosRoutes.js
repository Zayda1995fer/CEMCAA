const express = require("express");
const router = express.Router();
const empleadosController = require("../controllers/empleadosController");

router.post("/create", empleadosController.crear);
router.get("/", empleadosController.obtenerTodos);
router.put("/update", empleadosController.actualizar);
router.delete("/delete/:id", empleadosController.eliminar);

module.exports = router;