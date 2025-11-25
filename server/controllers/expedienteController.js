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

  // 🔄 Actualizar expediente completo (PUT) - EXTRA
  actualizarExpedienteCompleto: (req, res) => {
    // (Opcional) Para futuras implementaciones
    res.status(501).json({ mensaje: 'Funcionalidad en desarrollo' });
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