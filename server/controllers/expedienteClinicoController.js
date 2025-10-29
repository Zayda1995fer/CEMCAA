// ============================================
// 📋 expedienteClinicoController.js (Versión completa y corregida)
// ============================================

const db = require("../config/database");

const expedienteClinicoController = {
  // 🟢 Crear expediente médico
  crearExpediente: (req, res) => {
    const {
      idAnimal,
      fechaIngreso,
      motivoIngreso,
      condicionInicial,
      diagnosticoInicial,
      tratamientoInicial,
      estadoActual,
      ultimaRevision,
      veterinarioResponsable,
      notasGenerales,
    } = req.body;

    db.query(
      `INSERT INTO ExpedienteMedico 
        (idAnimal, fechaIngreso, motivoIngreso, condicionInicial, diagnosticoInicial, tratamientoInicial, estadoActual, ultimaRevision, veterinarioResponsable, notasGenerales)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idAnimal,
        fechaIngreso,
        motivoIngreso,
        condicionInicial,
        diagnosticoInicial,
        tratamientoInicial,
        estadoActual,
        ultimaRevision,
        veterinarioResponsable,
        notasGenerales,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al crear el expediente" });
        }
        res.json({
          mensaje: "Expediente médico creado con éxito",
          id: result.insertId,
        });
      }
    );
  },

  // 🟡 Obtener todos los expedientes
  obtenerExpedientes: (req, res) => {
    db.query("SELECT * FROM ExpedienteMedico", (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener expedientes" });
      }
      res.json(result);
    });
  },

  // 🟠 Obtener TODOS los expedientes de un animal (cada uno con sus relaciones)
  obtenerExpedientePorAnimal: (req, res) => {
    const { idAnimal } = req.params;

    db.query(
      "SELECT * FROM ExpedienteMedico WHERE idAnimal = ?",
      [idAnimal],
      (err, expedientes) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al buscar expedientes" });
        }

        if (expedientes.length === 0) {
          return res.status(404).json({ mensaje: "No hay expedientes registrados para este animal" });
        }

        // Arreglo donde guardaremos todos los expedientes con sus relaciones
        const resultados = [];
        let procesados = 0;

        expedientes.forEach((exp) => {
          const idExpediente = exp.idExpediente;

          const queries = {
            revisiones: "SELECT * FROM RevisionMensual WHERE idExpediente = ?",
            vacunas: "SELECT * FROM Vacunas WHERE idExpediente = ?",
            desparasitaciones: "SELECT * FROM Desparasitaciones WHERE idExpediente = ?",
            evaluaciones: "SELECT * FROM EvaluacionComportamiento WHERE idExpediente = ?",
          };

          // Consultar revisiones
          db.query(queries.revisiones, [idExpediente], (err, revisiones) => {
            if (err) {
              console.error(err);
              revisiones = [];
            }

            // Consultar vacunas
            db.query(queries.vacunas, [idExpediente], (err, vacunas) => {
              if (err) {
                console.error(err);
                vacunas = [];
              }

              // Consultar desparasitaciones
              db.query(queries.desparasitaciones, [idExpediente], (err, desparasitaciones) => {
                if (err) {
                  console.error(err);
                  desparasitaciones = [];
                }

                // Consultar evaluaciones
                db.query(queries.evaluaciones, [idExpediente], (err, evaluaciones) => {
                  if (err) {
                    console.error(err);
                    evaluaciones = [];
                  }

                  // Agregamos todo al arreglo de resultados
                  resultados.push({
                    expediente: exp,
                    revisiones,
                    vacunas,
                    desparasitaciones,
                    evaluaciones,
                  });

                  // Contamos cuándo terminamos todos
                  procesados++;
                  if (procesados === expedientes.length) {
                    // ✅ Enviamos todos los expedientes con sus datos
                    res.json(resultados);
                  }
                });
              });
            });
          });
        });
      }
    );
  },

  // 📅 Crear revisión mensual
  crearRevision: (req, res) => {
    const {
      idExpediente,
      fechaRevision,
      peso,
      diagnostico,
      tratamiento,
      estadoGeneral,
      observaciones,
      veterinario,
    } = req.body;

    db.query(
      `INSERT INTO RevisionMensual 
        (idExpediente, fechaRevision, peso, diagnostico, tratamiento, estadoGeneral, observaciones, veterinario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idExpediente,
        fechaRevision,
        peso,
        diagnostico,
        tratamiento,
        estadoGeneral,
        observaciones,
        veterinario,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al registrar la revisión" });
        }
        res.json({
          mensaje: "Revisión mensual registrada con éxito",
          id: result.insertId,
        });
      }
    );
  },

  // 💉 Crear vacuna
  crearVacuna: (req, res) => {
    const {
      idExpediente,
      fechaAplicacion,
      tipoVacuna,
      producto,
      dosis,
      proximaAplicacion,
      veterinario,
    } = req.body;

    db.query(
      `INSERT INTO Vacunas 
        (idExpediente, fechaAplicacion, tipoVacuna, producto, dosis, proximaAplicacion, veterinario)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idExpediente,
        fechaAplicacion,
        tipoVacuna,
        producto,
        dosis,
        proximaAplicacion,
        veterinario,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al registrar la vacuna" });
        }
        res.json({
          mensaje: "Vacuna registrada con éxito",
          id: result.insertId,
        });
      }
    );
  },

  // 💊 Crear desparasitación
  crearDesparasitacion: (req, res) => {
    const {
      idExpediente,
      fechaAplicacion,
      tipo,
      producto,
      dosis,
      proximaAplicacion,
      veterinario,
    } = req.body;

    db.query(
      `INSERT INTO Desparasitaciones 
        (idExpediente, fechaAplicacion, tipo, producto, dosis, proximaAplicacion, veterinario)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idExpediente,
        fechaAplicacion,
        tipo,
        producto,
        dosis,
        proximaAplicacion,
        veterinario,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al registrar desparasitación" });
        }
        res.json({
          mensaje: "Desparasitación registrada con éxito",
          id: result.insertId,
        });
      }
    );
  },

  // 🧠 Crear evaluación de comportamiento
  crearEvaluacion: (req, res) => {
    const { idExpediente, fecha, descripcion, progreso, evaluador } = req.body;

    db.query(
      `INSERT INTO EvaluacionComportamiento 
        (idExpediente, fecha, descripcion, progreso, evaluador)
       VALUES (?, ?, ?, ?, ?)`,
      [idExpediente, fecha, descripcion, progreso, evaluador],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al registrar evaluación" });
        }
        res.json({
          mensaje: "Evaluación de comportamiento registrada con éxito",
          id: result.insertId,
        });
      }
    );
  },
};

module.exports = expedienteClinicoController;
