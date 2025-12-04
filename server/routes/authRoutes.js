const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// LOGIN
router.post("/login", authController.login);

// LOGOUT (✅ NUEVO)
router.post("/logout", authController.logout);

// REGISTRO DE USUARIO NORMAL
router.post("/register-usuario", authController.registerUsuario);

// REGISTRO DE EMPLEADO
router.post("/register-empleado", authController.registerEmpleado);

// server/routes/authRoutes.js
router.get('/session', (req, res) => {
  if (req.session && req.session.userId) {
    // Obtener datos del usuario desde la BD
    db.query('SELECT id, nombre_completo, email, tipo FROM usuarios WHERE id = ?', 
      [req.session.userId], 
      (err, results) => {
        if (err || results.length === 0) {
          return res.status(401).json({ error: 'Sesión inválida' });
        }
        res.json(results[0]);
      }
    );
  } else {
    res.status(401).json({ error: 'No hay sesión activa' });
  }
});

module.exports = router;