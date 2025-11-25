const db = require("../config/database");
const nodemailer = require("nodemailer");

// Configuración del correo
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "zaydafervar@gmail.com",
    pass: "xvff lccv yoml dfjh",
  },
});

const enviarNotificacionUsuario = (email, nombreUsuario) => {
  const mailOptions = {
    from: '"CEMCAA" <zaydafervar@gmail.com>',
    to: email,
    subject: "Solicitud de adopción aprobada",
    text: `Hola ${nombreUsuario},\n\n¡Tu solicitud de adopción ha sido aprobada! Puedes agendar tu cita para visitar el centro.\n\nSaludos,\nCEMCAA`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error("Error al enviar correo:", error);
    else console.log("Correo enviado:", info.response);
  });
};

// Promisificar query
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// ==================================================
// FUNCIONES AUXILIARES PARA CALCULAR PUNTOS
// ==================================================

function calcularPuntosVivienda(tipo) {
  const puntos = {
    'Casa Patio Grande': 20,
    'Casa Patio Pequeño': 15,
    'Depto Grande': 10,
    'Depto Pequeño': 5,
    'Otro': 0
  };
  return puntos[tipo] || 0;
}

function calcularPuntosSituacion(esAlquilada, tienePermiso) {
  if (!esAlquilada) return 10;
  if (esAlquilada && tienePermiso) return 5;
  return 0;
}

function calcularPuntosHorasSolo(horas) {
  const puntos = {
    '0-2 horas': 20,
    '3-4 horas': 15,
    '5-6 horas': 10,
    '7-8 horas': 5,
    'Más de 8 horas': 0
  };
  return puntos[horas] || 0;
}

function calcularPuntosResponsable(responsable) {
  return responsable && responsable.length > 0 ? 10 : 0;
}

function calcularPuntosMotivo(motivo) {
  return motivo && motivo.length > 50 ? 10 : 5;
}

function calcularPuntosTipoMascotas(tipo) {
  if (!tipo) return 0;
  const tipoLower = tipo.toLowerCase();
  if (tipoLower.includes('perro') || tipoLower.includes('gato')) return 10;
  return 5;
}

function calcularPuntosCompromiso(compromiso) {
  const puntos = {
    'Completamente preparado': 20,
    'Preparado': 15,
    'Algo preparado': 10,
    'No estoy seguro': 5
  };
  return puntos[compromiso] || 0;
}

function calcularPuntosGastos(actitud) {
  const puntos = {
    'Dispuesto a cualquier costo necesario': 20,
    'Dispuesto dentro de lo razonable': 15,
    'Solo gastos básicos': 10,
    'Preocupado por los costos': 5
  };
  return puntos[actitud] || 0;
}

function calcularPuntosEsterilizacion(dispuesto) {
  const puntos = {
    'Sí, definitivamente': 20,
    'Sí, si es necesario': 15,
    'No estoy seguro': 5,
    'No': 0
  };
  return puntos[dispuesto] || 0;
}

// ==================================================
// CONTROLADOR PRINCIPAL
// ==================================================
const solicitudController = {
  // 🔹 Crear una nueva solicitud
  crear: async (req, res) => {
    try {
      const { 
        usuario_id, 
        animal_id, 
        vivienda, 
        hogar, 
        experiencia, 
        economico, 
        preferencia, 
        perros, 
        gatos 
      } = req.body;

      // Validaciones básicas
      if (!usuario_id || !animal_id) {
        return res.status(400).json({ 
          success: false,
          message: "Faltan campos obligatorios: usuario_id y animal_id" 
        });
      }

      await query("START TRANSACTION");

      // 1️⃣ Insertar solicitud principal
      const resultSolicitud = await query(
        `INSERT INTO solicitudes_adopcion 
         (usuario_id, animal_id, estado, puntuacion_total) 
         VALUES (?, ?, 'Pendiente', 0)`,
        [usuario_id, animal_id]
      );
      
      const solicitudId = resultSolicitud.insertId;

      // 2️⃣ Insertar VIVIENDA
      if (vivienda) {
        const puntosVivienda = calcularPuntosVivienda(vivienda.tipo_vivienda);
        const puntosSituacion = calcularPuntosSituacion(
          vivienda.es_alquilada, 
          vivienda.tiene_permiso_escrito
        );
        
        await query(
          `INSERT INTO vivienda_adoptante 
           (solicitud_id, tipo_vivienda, puntos_tipo_vivienda, es_alquilada, tiene_permiso_escrito, puntos_situacion_vivienda) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            solicitudId,
            vivienda.tipo_vivienda,
            puntosVivienda,
            vivienda.es_alquilada,
            vivienda.tiene_permiso_escrito,
            puntosSituacion
          ]
        );
      }

      // 3️⃣ Insertar HOGAR Y FAMILIA
      if (hogar) {
        const puntosHoras = calcularPuntosHorasSolo(hogar.horas_solo_al_dia);
        const puntosResponsable = calcularPuntosResponsable(hogar.responsable_principal);
        
        await query(
          `INSERT INTO hogar_familia 
           (solicitud_id, vive_solo, vive_con_adultos, vive_con_ninos_menores_5, vive_con_ninos_6_12, 
            vive_con_adolescentes, vive_con_adultos_mayores, vive_con_otras_mascotas, tipos_mascotas_actuales, 
            horas_solo_al_dia, puntos_horas_solo, responsable_principal, puntos_responsable) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            solicitudId,
            hogar.vive_solo || 0,
            hogar.vive_con_adultos || 0,
            hogar.vive_con_ninos_menores_5 || 0,
            hogar.vive_con_ninos_6_12 || 0,
            hogar.vive_con_adolescentes || 0,
            hogar.vive_con_adultos_mayores || 0,
            hogar.vive_con_otras_mascotas || 0,
            hogar.tipos_mascotas_actuales || null,
            hogar.horas_solo_al_dia,
            puntosHoras,
            hogar.responsable_principal,
            puntosResponsable
          ]
        );
      }

      // 4️⃣ Insertar EXPERIENCIA Y MOTIVACIÓN
      if (experiencia) {
        const puntosMotivo = calcularPuntosMotivo(experiencia.motivo_adopcion);
        const puntosExp = experiencia.ha_tenido_mascotas ? 10 : 0;
        const puntosTipo = calcularPuntosTipoMascotas(experiencia.tipo_mascotas_anteriores);
        const puntosCompromiso = calcularPuntosCompromiso(experiencia.preparado_compromiso_largo_plazo);
        
        await query(
          `INSERT INTO experiencia_motivacion 
           (solicitud_id, motivo_adopcion, puntos_motivo, ha_tenido_mascotas, detalle_mascotas_anteriores, 
            puntos_experiencia, tipo_mascotas_anteriores, puntos_tipo_mascotas, preparado_compromiso_largo_plazo, puntos_compromiso) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            solicitudId,
            experiencia.motivo_adopcion,
            puntosMotivo,
            experiencia.ha_tenido_mascotas || 0,
            experiencia.detalle_mascotas_anteriores || null,
            puntosExp,
            experiencia.tipo_mascotas_anteriores || null,
            puntosTipo,
            experiencia.preparado_compromiso_largo_plazo,
            puntosCompromiso
          ]
        );
      }

      // 5️⃣ Insertar COMPROMISO ECONÓMICO
      if (economico) {
        const puntosGastos = calcularPuntosGastos(economico.actitud_gastos_veterinarios);
        const puntosEsteril = calcularPuntosEsterilizacion(economico.dispuesto_esterilizar);
        
        await query(
          `INSERT INTO compromiso_economico 
           (solicitud_id, actitud_gastos_veterinarios, puntos_gastos_veterinarios, dispuesto_esterilizar, 
            puntos_esterilizacion, presupuesto_mensual_estimado) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            solicitudId,
            economico.actitud_gastos_veterinarios,
            puntosGastos,
            economico.dispuesto_esterilizar,
            puntosEsteril,
            economico.presupuesto_mensual_estimado || 0
          ]
        );
      }

      // 6️⃣ Insertar PREFERENCIA DE ANIMAL
      if (preferencia) {
        await query(
          `INSERT INTO preferencia_animal (solicitud_id, tipo_animal) VALUES (?, ?)`,
          [solicitudId, preferencia.tipo_animal || 'Sin Preferencia']
        );
      }

      // 7️⃣ Insertar DATOS ADOPCIÓN PERROS (si aplica)
      if (perros) {
        const puntosFrecuencia = perros.frecuencia_paseos === '3+ veces al día' ? 20 : 10;
        const puntosDuracion = perros.duracion_paseos === 'Más de 1 hora' ? 15 : 10;
        const puntosEnergia = 10;
        const puntosEntrenamiento = perros.disposicion_entrenamiento?.includes('Muy dispuesto') ? 15 : 10;
        const puntosSocializacion = perros.plan_socializacion ? 10 : 5;
        const puntosHigiene = perros.conocimiento_higiene === 'Experto' ? 15 : 10;
        const puntosFrecuenciaHigiene = perros.frecuencia_bano_cepillado === 'Semanal' ? 10 : 5;
        const puntosMuda = perros.manejo_muda_pelaje?.includes('preparado') ? 10 : 5;
        const puntosDental = perros.conocimiento_cuidado_dental === 'Experto' ? 10 : 5;

        await query(
          `INSERT INTO datos_adopcion_perros 
           (solicitud_id, frecuencia_paseos, puntos_frecuencia_paseos, duracion_paseos, puntos_duracion_paseos, 
            nivel_energia_preferido, puntos_nivel_energia, disposicion_entrenamiento, puntos_entrenamiento, 
            plan_socializacion, puntos_socializacion, conocimiento_higiene, puntos_conocimiento_higiene, 
            frecuencia_bano_cepillado, puntos_frecuencia_higiene, manejo_muda_pelaje, puntos_muda_pelaje, 
            conocimiento_cuidado_dental, puntos_cuidado_dental) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            solicitudId,
            perros.frecuencia_paseos || null,
            puntosFrecuencia,
            perros.duracion_paseos || null,
            puntosDuracion,
            perros.nivel_energia_preferido || null,
            puntosEnergia,
            perros.disposicion_entrenamiento || null,
            puntosEntrenamiento,
            perros.plan_socializacion || null,
            puntosSocializacion,
            perros.conocimiento_higiene || null,
            puntosHigiene,
            perros.frecuencia_bano_cepillado || null,
            puntosFrecuenciaHigiene,
            perros.manejo_muda_pelaje || null,
            puntosMuda,
            perros.conocimiento_cuidado_dental || null,
            puntosDental
          ]
        );
      }

      // 8️⃣ Insertar DATOS ADOPCIÓN GATOS (si aplica)
      if (gatos) {
        const puntosVentanas = gatos.ventanas_protegidas === 'Sí, todas' ? 20 : 10;
        const puntosAdaptacion = gatos.adaptacion_hogar?.includes('Completamente') ? 15 : 10;
        const puntosHigiene = gatos.conocimiento_higiene === 'Experto' ? 15 : 10;
        const puntosArenero = gatos.frecuencia_limpieza_arenero === 'Diaria' ? 20 : 10;
        const puntosPelaje = gatos.manejo_cuidado_pelaje?.includes('diario') ? 15 : 10;
        const puntosDental = gatos.conocimiento_higiene_dental === 'Experto' ? 10 : 5;
        const puntosPersonalidad = 10;
        const puntosEnriquecimiento = gatos.plan_enriquecimiento === 'Completo' ? 20 : 10;
        const puntosAlimentacion = gatos.tipo_alimentacion === 'Premium' ? 15 : 10;

        await query(
          `INSERT INTO datos_adopcion_gatos 
           (solicitud_id, ventanas_protegidas, puntos_ventanas, adaptacion_hogar, puntos_adaptacion, 
            conocimiento_higiene, puntos_conocimiento_higiene, frecuencia_limpieza_arenero, puntos_limpieza_arenero, 
            manejo_cuidado_pelaje, puntos_cuidado_pelaje, conocimiento_higiene_dental, puntos_higiene_dental, 
            personalidad_preferida, puntos_personalidad, plan_enriquecimiento, puntos_enriquecimiento, 
            tipo_alimentacion, puntos_alimentacion, considera_desungulacion) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            solicitudId,
            gatos.ventanas_protegidas || null,
            puntosVentanas,
            gatos.adaptacion_hogar || null,
            puntosAdaptacion,
            gatos.conocimiento_higiene || null,
            puntosHigiene,
            gatos.frecuencia_limpieza_arenero || null,
            puntosArenero,
            gatos.manejo_cuidado_pelaje || null,
            puntosPelaje,
            gatos.conocimiento_higiene_dental || null,
            puntosDental,
            gatos.personalidad_preferida || null,
            puntosPersonalidad,
            gatos.plan_enriquecimiento || null,
            puntosEnriquecimiento,
            gatos.tipo_alimentacion || null,
            puntosAlimentacion,
            gatos.considera_desungulacion || 0
          ]
        );
      }

      // 9️⃣ Calcular puntuación total y actualizar
      let puntuacionTotal = 0;
      
      if (vivienda) {
        puntuacionTotal += calcularPuntosVivienda(vivienda.tipo_vivienda);
        puntuacionTotal += calcularPuntosSituacion(vivienda.es_alquilada, vivienda.tiene_permiso_escrito);
      }
      
      if (hogar) {
        puntuacionTotal += calcularPuntosHorasSolo(hogar.horas_solo_al_dia);
        puntuacionTotal += calcularPuntosResponsable(hogar.responsable_principal);
      }
      
      if (experiencia) {
        puntuacionTotal += calcularPuntosMotivo(experiencia.motivo_adopcion);
        puntuacionTotal += experiencia.ha_tenido_mascotas ? 10 : 0;
        puntuacionTotal += calcularPuntosCompromiso(experiencia.preparado_compromiso_largo_plazo);
      }
      
      if (economico) {
        puntuacionTotal += calcularPuntosGastos(economico.actitud_gastos_veterinarios);
        puntuacionTotal += calcularPuntosEsterilizacion(economico.dispuesto_esterilizar);
      }

      // Actualizar puntuación total
      await query(
        `UPDATE solicitudes_adopcion SET puntuacion_total = ? WHERE id = ?`,
        [puntuacionTotal, solicitudId]
      );

      await query("COMMIT");

      res.status(201).json({
        success: true,
        message: 'Solicitud creada exitosamente',
        data: {
          solicitudId: solicitudId,
          puntuacionTotal: puntuacionTotal
        }
      });

    } catch (error) {
      await query("ROLLBACK");
      console.error('Error al crear solicitud:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear la solicitud',
        error: error.message
      });
    }
  },

  // 🔹 Obtener todas las solicitudes
  obtenerTodas: async (req, res) => {
    try {
      const solicitudes = await query(`
        SELECT 
          s.*,
          u.nombre_completo as usuario_nombre,
          u.email as usuario_email,
          a.nombre as animal_nombre,
          a.especie as animal_especie
        FROM solicitudes_adopcion s
        LEFT JOIN usuarios u ON s.usuario_id = u.id
        LEFT JOIN animales a ON s.animal_id = a.id
        ORDER BY s.fecha_solicitud DESC
      `);
      
      res.json({
        success: true,
        data: solicitudes
      });
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      res.status(500).json({ 
        success: false,
        message: "Error al obtener las solicitudes",
        error: error.message 
      });
    }
  },

  // 🔹 Obtener una solicitud por ID con todos sus detalles
  obtenerPorId: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Solicitud principal
      const [solicitud] = await query(
        `SELECT 
          s.*,
          u.nombre_completo, u.email, u.telefono, u.direccion,
          a.nombre as animal_nombre, a.especie, a.raza
        FROM solicitudes_adopcion s
        LEFT JOIN usuarios u ON s.usuario_id = u.id
        LEFT JOIN animales a ON s.animal_id = a.id
        WHERE s.id = ?`,
        [id]
      );

      if (!solicitud) {
        return res.status(404).json({ 
          success: false,
          message: "Solicitud no encontrada" 
        });
      }

      // Obtener datos relacionados
      const [vivienda] = await query(
        "SELECT * FROM vivienda_adoptante WHERE solicitud_id = ?",
        [id]
      );
      
      const [hogar] = await query(
        "SELECT * FROM hogar_familia WHERE solicitud_id = ?",
        [id]
      );
      
      const [experiencia] = await query(
        "SELECT * FROM experiencia_motivacion WHERE solicitud_id = ?",
        [id]
      );
      
      const [economico] = await query(
        "SELECT * FROM compromiso_economico WHERE solicitud_id = ?",
        [id]
      );
      
      const [preferencia] = await query(
        "SELECT * FROM preferencia_animal WHERE solicitud_id = ?",
        [id]
      );
      
      const [perros] = await query(
        "SELECT * FROM datos_adopcion_perros WHERE solicitud_id = ?",
        [id]
      );
      
      const [gatos] = await query(
        "SELECT * FROM datos_adopcion_gatos WHERE solicitud_id = ?",
        [id]
      );

      res.json({
        success: true,
        data: {
          solicitud,
          vivienda,
          hogar,
          experiencia,
          economico,
          preferencia,
          perros,
          gatos
        }
      });
    } catch (error) {
      console.error('Error al obtener solicitud:', error);
      res.status(500).json({ 
        success: false,
        message: "Error al obtener la solicitud",
        error: error.message 
      });
    }
  },

  // 🔹 Aprobar una solicitud
  aprobar: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Obtener datos de la solicitud y usuario
      const [solicitud] = await query(
        `SELECT s.*, u.email, u.nombre_completo 
         FROM solicitudes_adopcion s
         JOIN usuarios u ON s.usuario_id = u.id
         WHERE s.id = ?`,
        [id]
      );

      if (!solicitud) {
        return res.status(404).json({ 
          success: false,
          message: "Solicitud no encontrada" 
        });
      }

      // Actualizar estado
      await query(
        "UPDATE solicitudes_adopcion SET estado = 'Aprobada', fecha_resolucion = NOW() WHERE id = ?",
        [id]
      );

      // Enviar notificación por correo
      enviarNotificacionUsuario(solicitud.email, solicitud.nombre_completo);

      res.json({ 
        success: true,
        message: "Solicitud aprobada con éxito" 
      });
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      res.status(500).json({ 
        success: false,
        message: "Error al aprobar la solicitud",
        error: error.message 
      });
    }
  },

  // 🔹 Rechazar una solicitud
  rechazar: async (req, res) => {
    const { id } = req.params;
    const { observaciones } = req.body;
    
    try {
      await query(
        `UPDATE solicitudes_adopcion 
         SET estado = 'Rechazada', fecha_resolucion = NOW(), observaciones = ? 
         WHERE id = ?`,
        [observaciones || null, id]
      );

      res.json({ 
        success: true,
        message: "Solicitud rechazada" 
      });
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      res.status(500).json({ 
        success: false,
        message: "Error al rechazar la solicitud",
        error: error.message 
      });
    }
  },
};

module.exports = solicitudController;