const db = require('../config/database');
const SolicitudBuilder = require('../services/SolicitudBuilder');

const solicitudController = {

  // ===========================================================
  // ✅ MÉTODO AUXILIAR: Calcular progreso de la solicitud
  // ===========================================================
  calcularProgreso: (solicitudCompleta) => {
    const secciones = [
      solicitudCompleta.vivienda,
      solicitudCompleta.hogar,
      solicitudCompleta.experiencia,
      solicitudCompleta.economico,
      solicitudCompleta.preferencia,
      solicitudCompleta.perros,
      solicitudCompleta.gatos
    ];

    const seccionesCompletas = secciones.filter(seccion => 
      seccion && Object.keys(seccion).length > 1 // Más de 1 campo (no solo el ID)
    ).length;

    const total = secciones.length;
    const porcentaje = (seccionesCompletas / total) * 100;

    return {
      porcentaje: Math.round(porcentaje * 10) / 10, // Redondear a 1 decimal
      completas: seccionesCompletas,
      total: total,
      esCompleto: seccionesCompletas === total
    };
  },

  // ===========================================================
  // CREAR SOLICITUD
  // ===========================================================
  crearSolicitud: async (req, res) => {
    let connection;

    try {
      const datos = req.body;

      // ✅ LOG INICIAL para debugging
      console.log("\n=== DATOS RECIBIDOS ===");
      console.log("usuario_id:", datos.usuario_id);
      console.log("animal_id:", datos.animal_id);
      console.log("Datos completos:", JSON.stringify(datos, null, 2));
      console.log("=======================\n");

      // ✅ VALIDACIÓN INICIAL con mensajes más específicos
      if (!datos.usuario_id) {
        console.error("❌ Falta usuario_id");
        return res.status(400).json({
          success: false,
          message: "Falta usuario_id",
          error: "El campo usuario_id es requerido"
        });
      }

      if (!datos.animal_id) {
        console.error("❌ Falta animal_id");
        return res.status(400).json({
          success: false,
          message: "Falta animal_id",
          error: "El campo animal_id es requerido"
        });
      }

      // ✅ Validar que sean números
      const usuario_id = parseInt(datos.usuario_id);
      const animal_id = parseInt(datos.animal_id);

      if (isNaN(usuario_id) || isNaN(animal_id)) {
        console.error("❌ IDs inválidos - usuario_id:", usuario_id, "animal_id:", animal_id);
        return res.status(400).json({
          success: false,
          message: "Los IDs deben ser números válidos",
          error: `usuario_id: ${usuario_id}, animal_id: ${animal_id}`
        });
      }

      console.log("✅ IDs validados correctamente");

      // ✅ Construir la solicitud desde el Builder
      let solicitud;
      try {
        solicitud = SolicitudBuilder.construirDesdeFormulario(datos);
        console.log("✅ Solicitud construida con Builder");
      } catch (builderError) {
        console.error("❌ Error en Builder:", builderError);
        return res.status(400).json({
          success: false,
          message: "Error al construir la solicitud",
          error: builderError.message
        });
      }

      // ✅ Validación desde la estructura Composite
      const errores = solicitud.validar();
      if (errores.length > 0) {
        console.error("❌ Errores de validación:", errores);
        return res.status(400).json({
          success: false,
          message: "La solicitud tiene errores de validación",
          errores
        });
      }

      console.log("✅ Solicitud validada correctamente");

      // ✅ Obtener datos en formato BD
      const datosDB = solicitud.toDatabaseFormat();

      console.log("\n=== DATOS PARA BD ===");
      console.log(JSON.stringify(datosDB, null, 2));
      console.log("====================\n");

      connection = await db.getConnection();
      await connection.beginTransaction();

      // ---------------------------------------------------------
      // 1. INSERTAR SOLICITUD PRINCIPAL
      // ---------------------------------------------------------
      console.log("📝 Insertando solicitud principal...");

      // Calcular valores iniciales
      const puntuacionTotal = 0;
      const clasificacion = 'Pendiente';
      const recomendacion = 'Solicitud recibida, pendiente de evaluación';
      const revisionManualRequerida = 1;
      const motivoRevisionManual = 'Solicitud nueva pendiente de evaluación';

      const [solicitudResult] = await connection.execute(
        `INSERT INTO solicitudes_adopcion (
          usuario_id, 
          animal_id, 
          fecha_solicitud, 
          estado,
          puntuacion_total,
          clasificacion,
          recomendacion,
          observaciones,
          revision_manual_requerida,
          motivo_revision_manual,
          fecha_resolucion,
          resuelto_por
        ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          usuario_id, 
          animal_id,
          'Pendiente',           
          puntuacionTotal,       
          clasificacion,         
          recomendacion,         
          null,                  
          revisionManualRequerida,
          motivoRevisionManual,  
          null,                  
          null                   
        ]
      );

      const solicitudId = solicitudResult.insertId;
      console.log(`✅ Solicitud creada con ID: ${solicitudId}`);

      // ---------------------------------------------------------
      // 2. INSERTAR SECCIÓN: VIVIENDA
      // ---------------------------------------------------------
      if (datosDB.secciones.Vivienda) {
        console.log("📝 Insertando datos de vivienda...");
        const v = datosDB.secciones.Vivienda;
        await connection.execute(
          `INSERT INTO vivienda_adoptante 
           (solicitud_id, tipo_vivienda, es_alquilada, tiene_permiso_escrito) 
           VALUES (?, ?, ?, ?)`,
          [solicitudId, v.tipo_vivienda, v.es_alquilada, v.tiene_permiso_escrito]
        );
        console.log("✅ Vivienda insertada");
      }

      // ---------------------------------------------------------
      // 3. HOGAR Y FAMILIA
      // ---------------------------------------------------------
      if (datosDB.secciones.HogarFamilia) {
        console.log("📝 Insertando datos de hogar...");
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
        console.log("✅ Hogar insertado");
      }

      // ---------------------------------------------------------
      // 4. EXPERIENCIA
      // ---------------------------------------------------------
      if (datosDB.secciones.Experiencia) {
        console.log("📝 Insertando experiencia...");
        const e = datosDB.secciones.Experiencia;
        await connection.execute(
          `INSERT INTO experiencia_motivacion 
           (solicitud_id, motivo_adopcion, ha_tenido_mascotas, detalle_mascotas_anteriores,
            tipo_mascotas_anteriores, preparado_compromiso_largo_plazo) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [solicitudId, e.motivo_adopcion, e.ha_tenido_mascotas,
           e.detalle_mascotas_anteriores, e.tipo_mascotas_anteriores,
           e.preparado_compromiso_largo_plazo]
        );
        console.log("✅ Experiencia insertada");
      }

      // ---------------------------------------------------------
      // 5. ECONÓMICO
      // ---------------------------------------------------------
      if (datosDB.secciones.Economico) {
        console.log("📝 Insertando datos económicos...");
        const ec = datosDB.secciones.Economico;
        await connection.execute(
          `INSERT INTO compromiso_economico 
           (solicitud_id, actitud_gastos_veterinarios, dispuesto_esterilizar, presupuesto_mensual_estimado) 
           VALUES (?, ?, ?, ?)`,
          [solicitudId, ec.actitud_gastos_veterinarios, ec.dispuesto_esterilizar,
           ec.presupuesto_mensual_estimado]
        );
        console.log("✅ Económico insertado");
      }

      // ---------------------------------------------------------
      // 6. PREFERENCIA
      // ---------------------------------------------------------
      if (datosDB.secciones.Preferencia) {
        console.log("📝 Insertando preferencia...");
        const p = datosDB.secciones.Preferencia;
        await connection.execute(
          `INSERT INTO preferencia_animal (solicitud_id, tipo_animal) VALUES (?, ?)`,
          [solicitudId, p.tipo_animal]
        );
        console.log("✅ Preferencia insertada");
      }

      // ---------------------------------------------------------
      // 7. PERROS
      // ---------------------------------------------------------
      if (datosDB.secciones.Perros) {
        console.log("📝 Insertando datos de perros...");
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
        console.log("✅ Datos de perros insertados");
      }

      // ---------------------------------------------------------
      // 8. GATOS
      // ---------------------------------------------------------
      if (datosDB.secciones.Gatos) {
        console.log("📝 Insertando datos de gatos...");
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
        console.log("✅ Datos de gatos insertados");
      }

      await connection.commit();
      console.log("✅✅✅ SOLICITUD CREADA EXITOSAMENTE ✅✅✅\n");

      res.status(201).json({
        success: true,
        message: "Solicitud creada exitosamente",
        solicitudId
      });

    } catch (error) {
      if (connection) await connection.rollback();

      console.error("\n❌❌❌ ERROR AL CREAR SOLICITUD ❌❌❌");
      console.error("Tipo de error:", error.name);
      console.error("Mensaje:", error.message);
      console.error("Stack:", error.stack);
      console.error("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌\n");

      res.status(500).json({
        success: false,
        message: "Error al crear la solicitud",
        error: error.message,
        detalles: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });

    } finally {
      if (connection) connection.release();
    }
  },

  // ===========================================================
// ✅ OBTENER SOLICITUD COMPLETA (CON PROGRESO)
// ===========================================================
obtenerSolicitudCompleta: async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await db.getConnection();

    // Obtener datos principales de la solicitud
    const [solicitud] = await connection.execute(
      'SELECT * FROM solicitudes_adopcion WHERE id = ?',
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

    // Obtener todas las secciones relacionadas
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

    // Construir la solicitud completa con secciones
    const solicitudCompleta = {
      id: solicitudData.id,
      usuario_id: solicitudData.usuario_id,
      fecha_solicitud: solicitudData.fecha_solicitud,
      estado: solicitudData.estado,
      puntuacion_total: solicitudData.puntuacion_total,
      clasificacion: solicitudData.clasificacion,
      recomendacion: solicitudData.recomendacion,
      observaciones: solicitudData.observaciones,
      secciones: {
        vivienda: vivienda[0] || {},
        hogar: hogar[0] || {},
        experiencia: experiencia[0] || {},
        economico: economico[0] || {},
        preferencia: preferencia[0] || {},
        perros: perros[0] || {},
        gatos: gatos[0] || {}
      }
    };

    // Calcular progreso
    const progreso = solicitudController.calcularProgreso(solicitudCompleta);

    res.json({
      success: true,
      solicitud: solicitudCompleta,
      progreso: progreso,
      esCompleto: progreso.esCompleto
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

  // ===========================================================
  // ✅ LISTAR SOLICITUDES (CON PROGRESO CALCULADO)
  // ===========================================================
  // ===========================================================
// ✅ LISTAR SOLICITUDES OPTIMIZADO (Sin calcular progreso aquí)
// ===========================================================
listarSolicitudes: async (req, res) => {
  try {
    const { usuario_id } = req.query;

    const connection = await db.getConnection();

    let query = `
      SELECT 
        s.id,
        s.usuario_id,
        u.nombre_completo AS nombre_usuario,
        s.animal_id,
        a.nombre AS nombre_animal,
        a.especie,
        s.fecha_solicitud,
        s.estado,
        s.puntuacion_total,
        s.clasificacion,
        s.recomendacion,
        s.observaciones,
        s.revision_manual_requerida,
        s.motivo_revision_manual,
        s.fecha_resolucion,
        s.resuelto_por
      FROM solicitudes_adopcion s
      LEFT JOIN usuarios u ON s.usuario_id = u.id
      LEFT JOIN animales a ON s.animal_id = a.id
    `;

    const params = [];

    if (usuario_id) {
      query += " WHERE s.usuario_id = ?";
      params.push(usuario_id);
    }

    query += " ORDER BY s.fecha_solicitud DESC";

    const [solicitudes] = await connection.execute(query, params);

    // ✅ Calcular progreso de forma más eficiente
    const solicitudesConProgreso = [];

    for (const solicitud of solicitudes) {
      try {
        // Contar secciones completas con una sola query por tipo
        const [counts] = await connection.execute(`
          SELECT 
            (SELECT COUNT(*) FROM vivienda_adoptante WHERE solicitud_id = ?) as vivienda,
            (SELECT COUNT(*) FROM hogar_familia WHERE solicitud_id = ?) as hogar,
            (SELECT COUNT(*) FROM experiencia_motivacion WHERE solicitud_id = ?) as experiencia,
            (SELECT COUNT(*) FROM compromiso_economico WHERE solicitud_id = ?) as economico,
            (SELECT COUNT(*) FROM preferencia_animal WHERE solicitud_id = ?) as preferencia,
            (SELECT COUNT(*) FROM datos_adopcion_perros WHERE solicitud_id = ?) as perros,
            (SELECT COUNT(*) FROM datos_adopcion_gatos WHERE solicitud_id = ?) as gatos
        `, [solicitud.id, solicitud.id, solicitud.id, solicitud.id, solicitud.id, solicitud.id, solicitud.id]);

        const count = counts[0];
        const seccionesCompletas = 
          (count.vivienda > 0 ? 1 : 0) +
          (count.hogar > 0 ? 1 : 0) +
          (count.experiencia > 0 ? 1 : 0) +
          (count.economico > 0 ? 1 : 0) +
          (count.preferencia > 0 ? 1 : 0) +
          (count.perros > 0 ? 1 : 0) +
          (count.gatos > 0 ? 1 : 0);

        const total = 7;
        const porcentaje = (seccionesCompletas / total) * 100;

        solicitudesConProgreso.push({
          ...solicitud,
          progreso: Math.round(porcentaje * 10) / 10,
          esCompleto: seccionesCompletas === total
        });

      } catch (error) {
        console.error(`Error calculando progreso para solicitud ${solicitud.id}:`, error);
        // Si hay error, agregar con progreso 0
        solicitudesConProgreso.push({
          ...solicitud,
          progreso: 0,
          esCompleto: false
        });
      }
    }

    connection.release();

    res.json({
      success: true,
      solicitudes: solicitudesConProgreso
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
  // ===========================================================
  // ✅ ACTUALIZAR ESTATUS
  // ===========================================================
  actualizarEstatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { estatus } = req.body;

      const estatusValidos = ["Pendiente", "En Revisión", "Aprobada", "Rechazada"];

      if (!estatusValidos.includes(estatus)) {
        return res.status(400).json({
          success: false,
          message: "Estatus no válido"
        });
      }

      const connection = await db.getConnection();

      const [result] = await connection.execute(
        "UPDATE solicitudes_adopcion SET estado = ? WHERE id = ?",
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