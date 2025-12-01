// server/controllers/solicitudController.js
const db = require('../config/database');
const SolicitudBuilder = require('../services/SolicitudBuilder');

const solicitudController = {
  // Crear solicitud usando el patrón Composite
  crearSolicitud: async (req, res) => {
    let connection;
    try {
      const datos = req.body;

      // Construir la solicitud usando el Builder
      const solicitud = SolicitudBuilder.construirDesdeFormulario(datos);

      // Validar la solicitud
      const errores = solicitud.validar();
      if (errores.length > 0) {
        return res.status(400).json({
          success: false,
          message: "La solicitud tiene errores de validación",
          errores: errores
        });
      }

      // Mostrar en consola la estructura (para debugging)
      console.log("\n=== Estructura de Solicitud ===");
      solicitud.mostrar();
      console.log("\n=== Progreso ===");
      console.log(solicitud.obtenerProgreso());
      console.log("===============================\n");

      // Obtener datos en formato para BD
      const datosDB = solicitud.toDatabaseFormat();

      connection = await db.getConnection();
      await connection.beginTransaction();

      // 1. Insertar solicitud principal
      const [solicitudResult] = await connection.execute(
        `INSERT INTO solicitud_adopcion (usuario_id, animal_id, fecha_solicitud, estatus) 
         VALUES (?, ?, NOW(), 'Pendiente')`,
        [datosDB.solicitud.usuario_id, datosDB.solicitud.animal_id]
      );

      const solicitudId = solicitudResult.insertId;

      // 2. Insertar vivienda
      if (datosDB.secciones.Vivienda) {
        const v = datosDB.secciones.Vivienda;
        await connection.execute(
          `INSERT INTO vivienda_adoptante 
           (solicitud_id, tipo_vivienda, es_alquilada, tiene_permiso_escrito) 
           VALUES (?, ?, ?, ?)`,
          [solicitudId, v.tipo_vivienda, v.es_alquilada, v.tiene_permiso_escrito]
        );
      }

      // 3. Insertar hogar y familia
      if (datosDB.secciones.HogarFamilia) {
        const h = datosDB.secciones.HogarFamilia;
        await connection.execute(
          `INSERT INTO hogar_familia 
           (solicitud_id, vive_solo, vive_con_adultos, vive_con_ninos_menores_5, 
            vive_con_ninos_6_12, vive_con_adolescentes, vive_con_adultos_mayores,
            vive_con_otras_mascotas, tipos_mascotas_actuales, horas_solo_al_dia, responsable_principal) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [solicitudId, h.vive_solo, h.vive_con_adultos, h.vive_con_ninos_menores_5,
           h.vive_con_ninos_6_12, h.vive_con_adolescentes, h.vive_con_adultos_mayores,
           h.vive_con_otras_mascotas, h.tipos_mascotas_actuales, h.horas_solo_al_dia, 
           h.responsable_principal]
        );
      }

      // 4. Insertar experiencia
      if (datosDB.secciones.Experiencia) {
        const e = datosDB.secciones.Experiencia;
        await connection.execute(
          `INSERT INTO experiencia_motivacion 
           (solicitud_id, motivo_adopcion, ha_tenido_mascotas, detalle_mascotas_anteriores,
            tipo_mascotas_anteriores, preparado_compromiso_largo_plazo) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [solicitudId, e.motivo_adopcion, e.ha_tenido_mascotas, e.detalle_mascotas_anteriores,
           e.tipo_mascotas_anteriores, e.preparado_compromiso_largo_plazo]
        );
      }

      // 5. Insertar compromiso económico
      if (datosDB.secciones.Economico) {
        const ec = datosDB.secciones.Economico;
        await connection.execute(
          `INSERT INTO compromiso_economico 
           (solicitud_id, actitud_gastos_veterinarios, dispuesto_esterilizar, presupuesto_mensual_estimado) 
           VALUES (?, ?, ?, ?)`,
          [solicitudId, ec.actitud_gastos_veterinarios, ec.dispuesto_esterilizar, 
           ec.presupuesto_mensual_estimado]
        );
      }

      // 6. Insertar preferencia
      if (datosDB.secciones.Preferencia) {
        const p = datosDB.secciones.Preferencia;
        await connection.execute(
          `INSERT INTO preferencia_animal (solicitud_id, tipo_animal) VALUES (?, ?)`,
          [solicitudId, p.tipo_animal]
        );
      }

      // 7. Insertar datos de perros (si aplica)
      if (datosDB.secciones.Perros) {
        const pe = datosDB.secciones.Perros;
        await connection.execute(
          `INSERT INTO datos_adopcion_perros 
           (solicitud_id, frecuencia_paseos, duracion_paseos, nivel_energia_preferido,
            disposicion_entrenamiento, plan_socializacion, conocimiento_higiene,
            frecuencia_bano_cepillado, manejo_muda_pelaje, conocimiento_cuidado_dental) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [solicitudId, pe.frecuencia_paseos, pe.duracion_paseos, pe.nivel_energia_preferido,
           pe.disposicion_entrenamiento, pe.plan_socializacion, pe.conocimiento_higiene,
           pe.frecuencia_bano_cepillado, pe.manejo_muda_pelaje, pe.conocimiento_cuidado_dental]
        );
      }

      // 8. Insertar datos de gatos (si aplica)
      if (datosDB.secciones.Gatos) {
        const g = datosDB.secciones.Gatos;
        await connection.execute(
          `INSERT INTO datos_adopcion_gatos 
           (solicitud_id, ventanas_protegidas, adaptacion_hogar, conocimiento_higiene,
            frecuencia_limpieza_arenero, manejo_cuidado_pelaje, conocimiento_higiene_dental,
            personalidad_preferida, plan_enriquecimiento, tipo_alimentacion, considera_desungulacion) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [solicitudId, g.ventanas_protegidas, g.adaptacion_hogar, g.conocimiento_higiene,
           g.frecuencia_limpieza_arenero, g.manejo_cuidado_pelaje, g.conocimiento_higiene_dental,
           g.personalidad_preferida, g.plan_enriquecimiento, g.tipo_alimentacion, 
           g.considera_desungulacion]
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Solicitud creada exitosamente",
        solicitudId: solicitudId,
        progreso: solicitud.obtenerProgreso(),
        estructura: solicitud.toJSON()
      });

    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error("Error al crear solicitud:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear la solicitud",
        error: error.message
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },

  // Obtener solicitud completa usando el patrón Composite
  obtenerSolicitudCompleta: async (req, res) => {
    try {
      const { id } = req.params;

      const connection = await db.getConnection();

      // Obtener todos los datos de la solicitud
      const [solicitud] = await connection.execute(
        'SELECT * FROM solicitud_adopcion WHERE id = ?',
        [id]
      );

      if (solicitud.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: "Solicitud no encontrada"
        });
      }

      const solicitudData = solicitud[0];

      // Obtener todas las secciones
      const [vivienda] = await connection.execute(
        'SELECT * FROM vivienda_adoptante WHERE solicitud_id = ?',
        [id]
      );

      const [hogar] = await connection.execute(
        'SELECT * FROM hogar_familia WHERE solicitud_id = ?',
        [id]
      );

      const [experiencia] = await connection.execute(
        'SELECT * FROM experiencia_motivacion WHERE solicitud_id = ?',
        [id]
      );

      const [economico] = await connection.execute(
        'SELECT * FROM compromiso_economico WHERE solicitud_id = ?',
        [id]
      );

      const [preferencia] = await connection.execute(
        'SELECT * FROM preferencia_animal WHERE solicitud_id = ?',
        [id]
      );

      const [perros] = await connection.execute(
        'SELECT * FROM datos_adopcion_perros WHERE solicitud_id = ?',
        [id]
      );

      const [gatos] = await connection.execute(
        'SELECT * FROM datos_adopcion_gatos WHERE solicitud_id = ?',
        [id]
      );

      connection.release();

      // Construir objeto de datos para el builder
      const datosBD = {
        ...solicitudData,
        vivienda: vivienda[0] || null,
        hogar: hogar[0] || null,
        experiencia: experiencia[0] || null,
        economico: economico[0] || null,
        preferencia: preferencia[0] || null,
        perros: perros[0] || null,
        gatos: gatos[0] || null
      };

      // Reconstruir la solicitud usando el builder
      const solicitudCompleta = SolicitudBuilder.reconstruirDesdeBD(datosBD);

      // Mostrar estructura en consola
      console.log("\n=== Solicitud Recuperada ===");
      solicitudCompleta.mostrar();
      console.log("============================\n");

      res.json({
        success: true,
        solicitud: solicitudCompleta.toJSON()
      });

    } catch (error) {
      console.error("Error al obtener solicitud:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener la solicitud",
        error: error.message
      });
    }
  },

  // Listar solicitudes con información resumida
  listarSolicitudes: async (req, res) => {
    try {
      const connection = await db.getConnection();

      const [solicitudes] = await connection.execute(`
        SELECT 
          s.id,
          s.usuario_id,
          s.animal_id,
          s.fecha_solicitud,
          s.estatus,
          u.nombre as usuario_nombre,
          a.nombre as animal_nombre,
          a.especie,
          pa.tipo_animal as preferencia
        FROM solicitud_adopcion s
        LEFT JOIN usuarios u ON s.usuario_id = u.id
        LEFT JOIN animales a ON s.animal_id = a.id
        LEFT JOIN preferencia_animal pa ON s.id = pa.solicitud_id
        ORDER BY s.fecha_solicitud DESC
      `);

      connection.release();

      res.json({
        success: true,
        solicitudes: solicitudes
      });

    } catch (error) {
      console.error("Error al listar solicitudes:", error);
      res.status(500).json({
        success: false,
        message: "Error al listar solicitudes",
        error: error.message
      });
    }
  },

  // Actualizar estatus de solicitud
  actualizarEstatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { estatus } = req.body;

      const estatusValidos = ['Pendiente', 'En Revisión', 'Aprobada', 'Rechazada'];
      
      if (!estatusValidos.includes(estatus)) {
        return res.status(400).json({
          success: false,
          message: "Estatus no válido"
        });
      }

      const connection = await db.getConnection();

      const [result] = await connection.execute(
        'UPDATE solicitud_adopcion SET estatus = ? WHERE id = ?',
        [estatus, id]
      );

      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Solicitud no encontrada"
        });
      }

      res.json({
        success: true,
        message: "Estatus actualizado correctamente"
      });

    } catch (error) {
      console.error("Error al actualizar estatus:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estatus",
        error: error.message
      });
    }
  }
};

module.exports = solicitudController;