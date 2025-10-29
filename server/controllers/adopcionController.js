const db = require("../config/database");
const nodemailer = require("nodemailer");

// Configuración del servicio de correo
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Cambia por tu servidor SMTP
  port: 587,
  secure: false,
  auth: {
    user: "zaydafervar@gmail.com",
    pass: "xvff lccv yoml dfjh"
  }
});

// Función para enviar notificación al usuario cuando se aprueba la solicitud
const enviarNotificacionUsuario = (email, nombreUsuario) => {
  const mailOptions = {
    from: '"CEMCAA" <zaydafervar@gmail.com>',
    to: email,
    subject: "Solicitud de adopción aprobada",
    text: `Hola ${nombreUsuario},\n\n¡Tu solicitud de adopción ha sido aprobada! Puedes agendar tu cita para visitar el centro.\n\nSaludos,\nCEMCAA`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error("Error al enviar correo:", error);
    else console.log("Correo enviado:", info.response);
  });
};

const solicitudController = {
  // Crear solicitud
  crear: (req, res) => {
    const { usuario_id, animal_id, mensaje } = req.body;

    if (!usuario_id) {
      return res.status(400).json({ error: "Campo usuario_id es obligatorio" });
    }

    db.query(
      `INSERT INTO solicitudes_adopcion 
       (usuario_id, animal_id, fecha_solicitud, estado, observaciones) 
       VALUES (?, ?, ?, 'Pendiente', ?)`,
      [usuario_id, animal_id || null, new Date(), mensaje || ""],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Error al registrar la solicitud" });
        res.json({ mensaje: "Solicitud registrada con éxito", id: result.insertId });
      }
    );
  },

  // Obtener todas las solicitudes
  obtenerTodas: (req, res) => {
    db.query(
      `SELECT sa.id, sa.usuario_id, u.nombre_completo AS usuario_nombre, sa.animal_id, a.nombre AS animal_nombre,
              sa.fecha_solicitud, sa.estado, sa.puntuacion_total, sa.observaciones, sa.resuelto_por, sa.motivo_revision_manual
       FROM solicitudes_adopcion sa
       LEFT JOIN usuarios u ON sa.usuario_id = u.id
       LEFT JOIN animales a ON sa.animal_id = a.id`,
      (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener solicitudes" });
        res.json(result);
      }
    );
  },

  // Aprobar solicitud
  aprobar: (req, res) => {
    const { id } = req.params;
    const { empleado_id } = req.body;

    // Obtener datos del usuario para notificación
    db.query(
      `SELECT u.email, u.nombre_completo
       FROM solicitudes_adopcion sa
       JOIN usuarios u ON sa.usuario_id = u.id
       WHERE sa.id = ?`,
      [id],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener datos del usuario" });
        if (result.length === 0) return res.status(404).json({ error: "Solicitud no encontrada" });

        const usuario = result[0];

        // Actualizar estado a "Aprobada"
        db.query(
          `UPDATE solicitudes_adopcion 
           SET estado = 'Aprobada', resuelto_por = ?, fecha_resolucion = NOW() 
           WHERE id = ?`,
          [empleado_id, id],
          (err2, result2) => {
            if (err2) return res.status(500).json({ error: "Error al aprobar la solicitud" });

            // Enviar notificación al usuario
            enviarNotificacionUsuario(usuario.email, usuario.nombre_completo);

            res.json({ mensaje: "Solicitud aprobada correctamente" });
          }
        );
      }
    );
  },

  // Rechazar solicitud
  rechazar: (req, res) => {
    const { id } = req.params;
    const { empleado_id, motivo } = req.body;

    db.query(
      `UPDATE solicitudes_adopcion 
       SET estado = 'Rechazada', resuelto_por = ?, motivo_revision_manual = ?, fecha_resolucion = NOW() 
       WHERE id = ?`,
      [empleado_id, motivo || "", id],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Error al rechazar la solicitud" });
        res.json({ mensaje: "Solicitud rechazada correctamente" });
      }
    );
  },
};

module.exports = solicitudController;
