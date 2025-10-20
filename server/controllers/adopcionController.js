const db = require("../config/database");

const solicitudController = {
  crear: (req, res) => {
    const { idUsuario, idAnimal, fechaSolicitud, mensaje } = req.body;

    if (!idUsuario || !idAnimal) {
      return res.status(400).json({ error: "Campos obligatorios faltantes" });
    }

    db.query(
      `INSERT INTO solicitudes (idUsuario, idAnimal, fechaSolicitud, mensaje) VALUES (?, ?, ?, ?)`,
      [idUsuario, idAnimal, fechaSolicitud || new Date(), mensaje || ""],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Error al registrar la solicitud" });
        res.json({ mensaje: "Solicitud registrada con éxito", id: result.insertId });
      }
    );
  },

  obtenerTodas: (req, res) => {
    db.query("SELECT * FROM solicitudes", (err, result) => {
      if (err) return res.status(500).json({ error: "Error al obtener solicitudes" });
      res.json(result);
    });
  },
};

module.exports = solicitudController;
