const express = require("express");
const router = express.Router();
const animalesController = require("../controllers/animalesController");
const upload = require("../middleware/upload");

router.post("/create", upload.single("imagenMain"), animalesController.crear);
router.get("/", animalesController.obtenerTodos);
router.put("/update", upload.single("imagenMain"), animalesController.actualizar);
router.delete("/delete/:Id", animalesController.eliminar);

module.exports = router;