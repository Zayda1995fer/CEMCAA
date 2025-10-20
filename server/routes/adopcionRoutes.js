const express = require("express");
const router = express.Router();
const solicitudController = require("../controllers/adopcionController");

router.post("/crear", solicitudController.crear);
router.get("/todas", solicitudController.obtenerTodas);

module.exports = router;
