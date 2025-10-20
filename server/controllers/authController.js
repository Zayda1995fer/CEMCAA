const db = require("../config/database");
const bcrypt = require("bcryptjs");

// Registro de usuario (puede ser administrador o general)
const authController = {
  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    db.query("SELECT * FROM usuarios WHERE email=?", [email], (err, results) => {
      if (err) return res.status(500).json({ error: "Error en la consulta" });
      if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

      const user = results[0];

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      res.json({ mensaje: "Inicio de sesión exitoso", usuario: { id: user.id, email: user.email } });
    });
  },
};

module.exports = authController;
