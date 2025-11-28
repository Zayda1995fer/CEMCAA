const Animal = require('../models/animalModel');
const Vacuna = require('../models/vacunasModel');
const Desparasitacion = require('../models/desparasitacionesModel');
const Salud = require('../models/saludModel');
const Comportamiento = require('../models/comportamientoModel');
const HistorialVida = require('../models/historialVidaModel');
const ExpedienteClinico = require('../models/expedienteClinicoModel');

const expedienteController = {
  // 🔍 Obtener expediente completo de un animal (GET)
  obtenerExpediente: (req, res) => {
    const { id_animal } = req.params;

    Animal.getById(id_animal, (err, animal) => {
      if (err) return res.status(500).json({ error: err });
      if (!animal || animal.length === 0) return res.status(404).json({ error: 'Animal no encontrado' });

      Vacuna.getAllByAnimal(id_animal, (errVac, vacunas) => {
        if (errVac) return res.status(500).json({ error: errVac });

        Desparasitacion.getAllByAnimal(id_animal, (errDes, desparasitaciones) => {
          if (errDes) return res.status(500).json({ error: errDes });

          Salud.getByAnimal(id_animal, (errSalud, salud) => {
            if (errSalud) return res.status(500).json({ error: errSalud });

            Comportamiento.getByAnimal(id_animal, (errComp, comportamiento) => {
              if (errComp) return res.status(500).json({ error: errComp });

              HistorialVida.getByAnimal(id_animal, (errHist, historial) => {
                if (errHist) return res.status(500).json({ error: errHist });

                ExpedienteClinico.getAllByAnimal(id_animal, (errExp, revisiones) => {
                  if (errExp) return res.status(500).json({ error: errExp });

                  // 🧩 Aquí se arma el Composite
                  const expediente = {
                    animal: animal[0],
                    historial: historial[0] || null,
                    salud: salud[0] || null,
                    comportamiento: comportamiento[0] || null,
                    vacunas: vacunas || [],
                    desparasitaciones: desparasitaciones || [],
                    revisiones: revisiones || []
                  };

                  res.json(expediente);
                });
              });
            });
          });
        });
      });
    });
  },

  // ➕ Crear expediente completo (POST) - MÉTODO CORREGIDO
  crearExpedienteCompleto: (req, res) => {
    const {
      id_animal,
      historial_vida,
      salud,
      comportamiento,
      vacunas,
      desparasitaciones,
      revisiones
    } = req.body;

    console.log('📥 Datos recibidos para crear expediente:', {
      id_animal,
      historial_vida,
      salud,
      comportamiento,
      vacunas_count: vacunas?.length,
      desparasitaciones_count: desparasitaciones?.length,
      revisiones_count: revisiones?.length
    });

    // Validar que el animal existe
    Animal.getById(id_animal, (err, animal) => {
      if (err) {
        console.error('❌ Error al validar animal:', err);
        return res.status(500).json({ error: 'Error al validar el animal' });
      }

      if (!animal || animal.length === 0) {
        return res.status(404).json({ error: 'Animal no encontrado' });
      }

      const resultados = {};
      const errores = [];
      let operacionesExitosas = 0;
      let operacionesTotales = 0;

      // 🔄 Función para manejar operaciones asíncronas
      const manejarOperacion = (operacion, nombre, datos) => {
        return new Promise((resolve) => {
          operacionesTotales++;
          operacion(datos, (err, result) => {
            if (err) {
              console.error(`❌ Error en ${nombre}:`, err);
              errores.push(`${nombre}: ${err.message}`);
              resultados[nombre] = { error: err.message };
              resolve(); // Resolvemos aunque haya error para continuar con las demás operaciones
            } else {
              console.log(`✅ ${nombre} creado exitosamente`);
              operacionesExitosas++;
              resultados[nombre] = { 
                success: true, 
                insertId: result.insertId,
                affectedRows: result.affectedRows 
              };
              resolve();
            }
          });
        });
      };

      // 🎯 Ejecutar todas las operaciones en paralelo
      const operaciones = [];

      // 1. Historial de Vida (si viene con datos)
      if (historial_vida && Object.values(historial_vida).some(val => val !== '' && val !== 0)) {
        operaciones.push(
          manejarOperacion(
            HistorialVida.create, 
            'historial_vida', 
            { ...historial_vida, id_animal }
          )
        );
      }

      // 2. Salud (si viene con datos)
      if (salud && Object.values(salud).some(val => val !== '' && val !== 0)) {
        operaciones.push(
          manejarOperacion(
            Salud.create, 
            'salud', 
            { ...salud, id_animal }
          )
        );
      }

      // 3. Comportamiento (si viene con datos)
      if (comportamiento && Object.values(comportamiento).some(val => val !== '' && val !== 0)) {
        operaciones.push(
          manejarOperacion(
            Comportamiento.create, 
            'comportamiento', 
            { ...comportamiento, id_animal }
          )
        );
      }

      // 4. Vacunas (array - pueden ser múltiples)
      if (vacunas && vacunas.length > 0) {
        vacunas.forEach((vacuna, index) => {
          if (Object.values(vacuna).some(val => val !== '' && val !== 0)) {
            operaciones.push(
              manejarOperacion(
                Vacuna.create, 
                `vacuna_${index}`, 
                { ...vacuna, id_animal }
              )
            );
          }
        });
      }

      // 5. Desparasitaciones (array - pueden ser múltiples)
      if (desparasitaciones && desparasitaciones.length > 0) {
        desparasitaciones.forEach((desparasitacion, index) => {
          if (Object.values(desparasitacion).some(val => val !== '' && val !== 0)) {
            operaciones.push(
              manejarOperacion(
                Desparasitacion.create, 
                `desparasitacion_${index}`, 
                { ...desparasitacion, id_animal }
              )
            );
          }
        });
      }

      // 6. Revisiones/Expediente Clínico (array - pueden ser múltiples)
      if (revisiones && revisiones.length > 0) {
        revisiones.forEach((revision, index) => {
          if (Object.values(revision).some(val => val !== '' && val !== 0)) {
            operaciones.push(
              manejarOperacion(
                ExpedienteClinico.create, 
                `revision_${index}`, 
                { ...revision, id_animal }
              )
            );
          }
        });
      }

      // Si no hay operaciones para realizar
      if (operaciones.length === 0) {
        return res.status(400).json({ 
          error: 'No se recibieron datos para crear el expediente' 
        });
      }

      console.log(`🔄 Ejecutando ${operaciones.length} operaciones...`);

      // ⚡ Ejecutar todas las operaciones
      Promise.all(operaciones)
        .then(() => {
          console.log(`📊 Resultado: ${operacionesExitosas}/${operacionesTotales} operaciones exitosas`);
          
          if (errores.length > 0) {
            // Algunas operaciones fallaron, pero otras tuvieron éxito
            res.status(207).json({
              mensaje: 'Expediente creado parcialmente',
              resultados,
              errores,
              resumen: {
                exitosas: operacionesExitosas,
                totales: operacionesTotales,
                fallidas: errores.length
              },
              advertencia: 'Algunos componentes no se pudieron guardar'
            });
          } else {
            // Todas las operaciones fueron exitosas
            res.status(201).json({
              mensaje: 'Expediente completo creado exitosamente',
              resultados,
              resumen: {
                exitosas: operacionesExitosas,
                totales: operacionesTotales
              },
              id_animal
            });
          }
        })
        .catch((error) => {
          console.error('❌ Error general al crear expediente:', error);
          res.status(500).json({
            error: 'Error al crear el expediente completo',
            detalles: errores,
            resumen: {
              exitosas: operacionesExitosas,
              totales: operacionesTotales,
              fallidas: errores.length
            }
          });
        });
    });
  },

  // 🔄 Actualizar expediente completo (PUT) - IMPLEMENTACIÓN COMPLETA
  actualizarExpedienteCompleto: (req, res) => {
    const { id_animal } = req.params;
    const {
      salud,
      nueva_vacuna,
      nueva_desparasitacion,
      nueva_revision
    } = req.body;

    console.log('🔄 Datos recibidos para actualizar expediente:', {
      id_animal,
      salud: salud ? 'con datos' : 'sin datos',
      nueva_vacuna: nueva_vacuna ? 'con datos' : 'sin datos',
      nueva_desparasitacion: nueva_desparasitacion ? 'con datos' : 'sin datos',
      nueva_revision: nueva_revision ? 'con datos' : 'sin datos'
    });

    // Validar que el animal existe
    Animal.getById(id_animal, (err, animal) => {
      if (err) {
        console.error('❌ Error al validar animal:', err);
        return res.status(500).json({ error: 'Error al validar el animal' });
      }

      if (!animal || animal.length === 0) {
        return res.status(404).json({ error: 'Animal no encontrado' });
      }

      const resultados = {};
      const errores = [];
      let operacionesExitosas = 0;
      let operacionesTotales = 0;

      // 🔄 Función para manejar operaciones asíncronas (UPDATE o CREATE)
      const manejarOperacion = (operacion, operacionUpdate, nombre, datos, esActualizacion = false) => {
        return new Promise((resolve) => {
          operacionesTotales++;
          
          // Primero verificar si existe el registro
          const verificarExistencia = (callback) => {
            if (nombre === 'salud') {
              Salud.getByAnimal(id_animal, callback);
            } else {
              // Para otros componentes, asumimos que siempre se crean nuevos
              callback(null, []);
            }
          };

          verificarExistencia((err, existentes) => {
            if (err) {
              console.error(`❌ Error al verificar existencia de ${nombre}:`, err);
              errores.push(`${nombre}: ${err.message}`);
              resultados[nombre] = { error: err.message };
              resolve();
              return;
            }

            const funcionAEjecutar = (esActualizacion && existentes.length > 0) ? operacionUpdate : operacion;
            const parametros = esActualizacion ? [id_animal, datos] : [datos];

            funcionAEjecutar(...parametros, (err, result) => {
              if (err) {
                console.error(`❌ Error en ${nombre}:`, err);
                errores.push(`${nombre}: ${err.message}`);
                resultados[nombre] = { error: err.message };
                resolve();
              } else {
                console.log(`✅ ${nombre} ${esActualizacion && existentes.length > 0 ? 'actualizado' : 'creado'} exitosamente`);
                operacionesExitosas++;
                resultados[nombre] = { 
                  success: true,
                  operacion: esActualizacion && existentes.length > 0 ? 'updated' : 'created',
                  affectedRows: result.affectedRows,
                  insertId: result.insertId
                };
                resolve();
              }
            });
          });
        });
      };

      // 🎯 Ejecutar todas las operaciones en paralelo
      const operaciones = [];

      // 1. Actualizar/Crear Salud
      if (salud && Object.values(salud).some(val => val !== '' && val !== 0 && val !== null)) {
        operaciones.push(
          manejarOperacion(
            (data, callback) => Salud.create(data, callback),
            (id, data, callback) => Salud.updateByAnimal(id, data, callback),
            'salud',
            { ...salud, id_animal, fecha_actualizacion: new Date() },
            true // Es una actualización
          )
        );
      }

      // 2. Agregar Nueva Vacuna (siempre creación)
      if (nueva_vacuna && Object.values(nueva_vacuna).some(val => val !== '' && val !== 0 && val !== null)) {
        operaciones.push(
          manejarOperacion(
            Vacuna.create,
            null,
            'nueva_vacuna',
            { ...nueva_vacuna, id_animal }
          )
        );
      }

      // 3. Agregar Nueva Desparasitación (siempre creación)
      if (nueva_desparasitacion && Object.values(nueva_desparasitacion).some(val => val !== '' && val !== 0 && val !== null)) {
        operaciones.push(
          manejarOperacion(
            Desparasitacion.create,
            null,
            'nueva_desparasitacion',
            { ...nueva_desparasitacion, id_animal }
          )
        );
      }

      // 4. Agregar Nueva Revisión (siempre creación)
      if (nueva_revision && Object.values(nueva_revision).some(val => val !== '' && val !== 0 && val !== null)) {
        operaciones.push(
          manejarOperacion(
            ExpedienteClinico.create,
            null,
            'nueva_revision',
            { ...nueva_revision, id_animal }
          )
        );
      }

      // Si no hay operaciones para realizar
      if (operaciones.length === 0) {
        return res.status(400).json({ 
          error: 'No se recibieron datos para actualizar el expediente' 
        });
      }

      console.log(`🔄 Ejecutando ${operaciones.length} operaciones de actualización...`);

      // ⚡ Ejecutar todas las operaciones
      Promise.all(operaciones)
        .then(() => {
          console.log(`📊 Resultado: ${operacionesExitosas}/${operacionesTotales} operaciones exitosas`);
          
          if (errores.length > 0) {
            // Algunas operaciones fallaron, pero otras tuvieron éxito
            res.status(207).json({
              mensaje: 'Expediente actualizado parcialmente',
              resultados,
              errores,
              resumen: {
                exitosas: operacionesExitosas,
                totales: operacionesTotales,
                fallidas: errores.length
              },
              advertencia: 'Algunos componentes no se pudieron actualizar'
            });
          } else {
            // Todas las operaciones fueron exitosas
            res.status(200).json({
              mensaje: 'Expediente actualizado exitosamente',
              resultados,
              resumen: {
                exitosas: operacionesExitosas,
                totales: operacionesTotales
              },
              id_animal
            });
          }
        })
        .catch((error) => {
          console.error('❌ Error general al actualizar expediente:', error);
          res.status(500).json({
            error: 'Error al actualizar el expediente completo',
            detalles: errores,
            resumen: {
              exitosas: operacionesExitosas,
              totales: operacionesTotales,
              fallidas: errores.length
            }
          });
        });
    });
  },

  // 🆕 Método de prueba para verificar que el endpoint funciona
  probarEndpoint: (req, res) => {
    res.json({ 
      mensaje: '✅ Endpoint /expediente-completo está funcionando',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = expedienteController;