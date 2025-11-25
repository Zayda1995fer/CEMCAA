const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ✅ Ruta POST para crear expediente completo - CON CALLBACKS
router.post('/', (req, res) => {
  console.log("📦 Recibiendo datos para crear expediente:", req.body);
  
  const {
    id_animal,
    historial_vida,
    salud,
    comportamiento,
    vacunas,
    desparasitaciones,
    revisiones
  } = req.body;

  // Validación
  if (!id_animal) {
    return res.status(400).json({ error: 'ID de animal es requerido' });
  }

  // Obtener conexión para transacción
  db.getConnection((getConnErr, connection) => {
    if (getConnErr) {
      console.error('❌ Error al obtener conexión:', getConnErr);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    // Iniciar transacción
    connection.beginTransaction((beginErr) => {
      if (beginErr) {
        connection.release();
        console.error('❌ Error al iniciar transacción:', beginErr);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      // Función para manejar el rollback y release
      const handleError = (error, message) => {
        connection.rollback(() => {
          connection.release();
          console.error(`❌ ${message}:`, error);
          res.status(500).json({ 
            error: 'Error interno del servidor',
            details: error.message 
          });
        });
      };

      // 1. Validar que existe el animal
      connection.query('SELECT Id FROM animales WHERE Id = ?', [id_animal], (animalErr, animalResults) => {
        if (animalErr) {
          return handleError(animalErr, 'Error al validar animal');
        }

        if (animalResults.length === 0) {
          connection.rollback(() => {
            connection.release();
            return res.status(404).json({ error: 'Animal no encontrado' });
          });
          return;
        }

        const queries = [];
        
        // 2. Insertar Historial de Vida
        if (historial_vida && Object.values(historial_vida).some(val => val !== "" && val !== 0 && val !== null)) {
          queries.push((callback) => {
            connection.query(
              `INSERT INTO historial_vida 
              (id_animal, origen, cantidad_duenos_previos, situacion_previa, 
               ultimo_dueno_nombre_completo, ultimo_dueno_telefono, fecha_registro) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                id_animal,
                historial_vida.origen || null,
                historial_vida.cantidad_duenos_previos || 0,
                historial_vida.situacion_previa || null,
                historial_vida.ultimo_dueno_nombre_completo || null,
                historial_vida.ultimo_dueno_telefono || null,
                historial_vida.fecha_registro || new Date()
              ],
              callback
            );
          });
        }

        // 3. Insertar Salud
        if (salud && Object.values(salud).some(val => val !== "" && val !== 0 && val !== null)) {
          queries.push((callback) => {
            connection.query(
              `INSERT INTO salud 
              (id_animal, estado_actual_salud, enfermedades_temporales, tratamientos_medicos,
               esterilizacion, fecha_esterilizacion, cirugias_anteriores, fecha_actualizacion) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                id_animal,
                salud.estado_actual_salud || null,
                salud.enfermedades_temporales || null,
                salud.tratamientos_medicos || null,
                salud.esterilizacion || null,
                salud.fecha_esterilizacion || null,
                salud.cirugias_anteriores || null,
                salud.fecha_actualizacion || new Date()
              ],
              callback
            );
          });
        }

        // 4. Insertar Comportamiento
        if (comportamiento && Object.values(comportamiento).some(val => val !== "" && val !== 0 && val !== null)) {
          queries.push((callback) => {
            connection.query(
              `INSERT INTO comportamiento 
              (id_animal, caracter_general, compatibilidad_ninos, compatibilidad_perros,
               compatibilidad_gatos, nivel_energia, entrenamiento, fecha_evaluacion) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                id_animal,
                comportamiento.caracter_general || null,
                comportamiento.compatibilidad_ninos || null,
                comportamiento.compatibilidad_perros || null,
                comportamiento.compatibilidad_gatos || null,
                comportamiento.nivel_energia || null,
                comportamiento.entrenamiento || null,
                comportamiento.fecha_evaluacion || new Date()
              ],
              callback
            );
          });
        }

        // 5. Insertar Vacunas
        if (vacunas && vacunas.length > 0) {
          vacunas.forEach((vacuna) => {
            if (vacuna && Object.values(vacuna).some(val => val !== "" && val !== 0 && val !== null)) {
              queries.push((callback) => {
                connection.query(
                  `INSERT INTO vacunas 
                  (id_animal, fecha_vacuna, tipo_vacuna, producto, lote, dosis,
                   proxima_dosis, veterinario, observaciones, fecha_registro) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    id_animal,
                    vacuna.fecha_vacuna || null,
                    vacuna.tipo_vacuna || null,
                    vacuna.producto || null,
                    vacuna.lote || null,
                    vacuna.dosis || null,
                    vacuna.proxima_dosis || null,
                    vacuna.veterinario || null,
                    vacuna.observaciones || null,
                    vacuna.fecha_registro || new Date()
                  ],
                  callback
                );
              });
            }
          });
        }

        // 6. Insertar Desparasitaciones
        if (desparasitaciones && desparasitaciones.length > 0) {
          desparasitaciones.forEach((desparasitacion) => {
            if (desparasitacion && Object.values(desparasitacion).some(val => val !== "" && val !== 0 && val !== null)) {
              queries.push((callback) => {
                connection.query(
                  `INSERT INTO desparasitaciones 
                  (id_animal, fecha_desparasitacion, tipo, producto, dosis,
                   proxima_aplicacion, veterinario, observaciones, fecha_registro) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    id_animal,
                    desparasitacion.fecha_desparasitacion || null,
                    desparasitacion.tipo || null,
                    desparasitacion.producto || null,
                    desparasitacion.dosis || null,
                    desparasitacion.proxima_aplicacion || null,
                    desparasitacion.veterinario || null,
                    desparasitacion.observaciones || null,
                    desparasitacion.fecha_registro || new Date()
                  ],
                  callback
                );
              });
            }
          });
        }

        // 7. Insertar Expediente Clínico (revisiones)
        if (revisiones && revisiones.length > 0) {
          revisiones.forEach((revision) => {
            if (revision && Object.values(revision).some(val => val !== "" && val !== 0 && val !== null)) {
              queries.push((callback) => {
                connection.query(
                  `INSERT INTO expediente_clinico 
                  (id_animal, fecha, tipo, motivo, diagnostico, tratamiento,
                   peso, temperatura, observaciones, veterinario, fecha_proxima_revision, fecha_registro) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    id_animal,
                    revision.fecha || null,
                    revision.tipo || null,
                    revision.motivo || null,
                    revision.diagnostico || null,
                    revision.tratamiento || null,
                    revision.peso || null,
                    revision.temperatura || null,
                    revision.observaciones || null,
                    revision.veterinario || null,
                    revision.fecha_proxima_revision || null,
                    revision.fecha_registro || new Date()
                  ],
                  callback
                );
              });
            }
          });
        }

        // Si no hay queries para ejecutar
        if (queries.length === 0) {
          connection.rollback(() => {
            connection.release();
            return res.status(400).json({ error: 'No hay datos para guardar' });
          });
          return;
        }

        // Ejecutar todas las queries en serie
        const executeQueries = (index) => {
          if (index >= queries.length) {
            // Todas las queries completadas, hacer commit
            connection.commit((commitErr) => {
              if (commitErr) {
                return handleError(commitErr, 'Error al hacer commit');
              }
              
              connection.release();
              console.log("🎉 Expediente creado exitosamente");
              res.status(201).json({ message: 'Expediente creado exitosamente' });
            });
            return;
          }

          queries[index]((queryErr) => {
            if (queryErr) {
              return handleError(queryErr, `Error en query ${index + 1}`);
            }
            
            console.log(`✅ Query ${index + 1} completada`);
            executeQueries(index + 1);
          });
        };

        // Iniciar ejecución de queries
        executeQueries(0);
      });
    });
  });
});

// ✅ Ruta GET para obtener expediente completo - CON CALLBACKS
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📋 Solicitando expediente para animal ID: ${id}`);

  db.getConnection((getConnErr, connection) => {
    if (getConnErr) {
      console.error('❌ Error al obtener conexión:', getConnErr);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    // 1. Obtener datos básicos del animal
    connection.query('SELECT * FROM animales WHERE Id = ?', [id], (animalErr, animalResults) => {
      if (animalErr) {
        connection.release();
        console.error('❌ Error al obtener animal:', animalErr);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (animalResults.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Animal no encontrado' });
      }

      const animal = animalResults[0];
      const expedienteCompleto = {
        animal: animal,
        historial: null,
        salud: null,
        comportamiento: null,
        vacunas: [],
        desparasitaciones: [],
        revisiones: []
      };

      let completedQueries = 0;
      const totalQueries = 6;

      const checkCompletion = () => {
        completedQueries++;
        if (completedQueries === totalQueries) {
          connection.release();
          console.log("✅ Expediente encontrado y enviado");
          res.json(expedienteCompleto);
        }
      };

      // 2. Obtener Historial de Vida
      connection.query('SELECT * FROM historial_vida WHERE id_animal = ?', [id], (err, results) => {
        if (!err && results.length > 0) expedienteCompleto.historial = results[0];
        checkCompletion();
      });

      // 3. Obtener Salud
      connection.query('SELECT * FROM salud WHERE id_animal = ?', [id], (err, results) => {
        if (!err && results.length > 0) expedienteCompleto.salud = results[0];
        checkCompletion();
      });

      // 4. Obtener Comportamiento
      connection.query('SELECT * FROM comportamiento WHERE id_animal = ?', [id], (err, results) => {
        if (!err && results.length > 0) expedienteCompleto.comportamiento = results[0];
        checkCompletion();
      });

      // 5. Obtener Vacunas
      connection.query('SELECT * FROM vacunas WHERE id_animal = ? ORDER BY fecha_vacuna DESC', [id], (err, results) => {
        if (!err) expedienteCompleto.vacunas = results;
        checkCompletion();
      });

      // 6. Obtener Desparasitaciones
      connection.query('SELECT * FROM desparasitaciones WHERE id_animal = ? ORDER BY fecha_desparasitacion DESC', [id], (err, results) => {
        if (!err) expedienteCompleto.desparasitaciones = results;
        checkCompletion();
      });

      // 7. Obtener Revisiones
      connection.query('SELECT * FROM expediente_clinico WHERE id_animal = ? ORDER BY fecha DESC', [id], (err, results) => {
        if (!err) expedienteCompleto.revisiones = results;
        checkCompletion();
      });
    });
  });
});

// ✅ Ruta de prueba simple
router.get('/', (req, res) => {
  res.json({ 
    message: '✅ Ruta de expediente funcionando correctamente',
    endpoints: {
      'POST /': 'Crear nuevo expediente',
      'GET /:id': 'Obtener expediente por ID de animal'
    }
  });
});

module.exports = router;