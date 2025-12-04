// server/services/SolicitudBuilder.js
const SolicitudCompuesta = require('../models/composite/SolicitudCompuesta');
const {
  ViviendaHoja,
  HogarFamiliaHoja,
  ExperienciaHoja,
  EconomicoHoja,
  PreferenciaHoja,
  PerrosHoja,
  GatosHoja
} = require('../models/composite/hojas');

class SolicitudBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.solicitud = new SolicitudCompuesta("Solicitud de Adopción");
  }

  setDatosGenerales(datos) {
    this.solicitud.setDatosGenerales({
      usuario_id: datos.usuario_id,
      animal_id: datos.animal_id,
      fecha_solicitud: new Date(),
      estatus: 'Pendiente'
    });
    return this;
  }

  agregarVivienda(datos) {
    const vivienda = new ViviendaHoja();
    vivienda.setDatos(datos);
    this.solicitud.agregar(vivienda);
    return this;
  }

  agregarHogarFamilia(datos) {
    const hogar = new HogarFamiliaHoja();
    hogar.setDatos(datos);
    this.solicitud.agregar(hogar);
    return this;
  }

  agregarExperiencia(datos) {
    const exp = new ExperienciaHoja();
    exp.setDatos(datos);
    this.solicitud.agregar(exp);
    return this;
  }

  agregarEconomico(datos) {
    const eco = new EconomicoHoja();
    eco.setDatos(datos);
    this.solicitud.agregar(eco);
    return this;
  }

  agregarPreferencia(datos) {
    const pref = new PreferenciaHoja();
    pref.setDatos(datos);
    this.solicitud.agregar(pref);
    return this;
  }

  agregarPerros(datos) {
    if (datos && Object.keys(datos).length > 0) {
      const perros = new PerrosHoja();
      perros.setDatos(datos);
      this.solicitud.agregar(perros);
    }
    return this;
  }

  agregarGatos(datos) {
    if (datos && Object.keys(datos).length > 0) {
      const gatos = new GatosHoja();
      gatos.setDatos(datos);
      this.solicitud.agregar(gatos);
    }
    return this;
  }

  construir() {
    const resultado = this.solicitud;
    this.reset();
    return resultado;
  }

  // ------------------------------------------------------------
  // 🔥 RECONSTRUCCIÓN DESDE BD — VERSION CORREGIDA
  // ------------------------------------------------------------
  static reconstruirDesdeBD(datosBD) {
    const builder = new SolicitudBuilder();

    // Datos generales:
    builder.setDatosGenerales({
      usuario_id: datosBD.usuario_id,
      animal_id: datosBD.animal_id
    });

    // ------------------------------------------------------------
    // VIVIENDA — si la BD trae columnas planas
    // ------------------------------------------------------------
    if (datosBD.vivienda_tipo || datosBD.vivienda_ventanas || datosBD.vivienda_espacio) {
      builder.agregarVivienda({
        tipo_vivienda: datosBD.vivienda_tipo,
        ventanas_protegidas: datosBD.vivienda_ventanas,
        espacio: datosBD.vivienda_espacio
      });
    }

    // ------------------------------------------------------------
    // HOGAR
    // ------------------------------------------------------------
    if (datosBD.hogar_personas || datosBD.hogar_ninos) {
      builder.agregarHogarFamilia({
        personas_hogar: datosBD.hogar_personas,
        ninos_hogar: datosBD.hogar_ninos
      });
    }

    // ------------------------------------------------------------
    // EXPERIENCIA
    // ------------------------------------------------------------
    if (datosBD.exp_tiempo || datosBD.exp_tipo) {
      builder.agregarExperiencia({
        tiempo: datosBD.exp_tiempo,
        tipo_experiencia: datosBD.exp_tipo
      });
    }

    // ------------------------------------------------------------
    // ECONÓMICO
    // ------------------------------------------------------------
    if (datosBD.eco_ingresos || datosBD.eco_estabilidad) {
      builder.agregarEconomico({
        ingresos: datosBD.eco_ingresos,
        estabilidad: datosBD.eco_estabilidad
      });
    }

    // ------------------------------------------------------------
    // PREFERENCIAS
    // ------------------------------------------------------------
    if (datosBD.pref_tipo || datosBD.pref_tamano) {
      builder.agregarPreferencia({
        tipo: datosBD.pref_tipo,
        tamano: datosBD.pref_tamano
      });
    }

    // ------------------------------------------------------------
    // PERROS
    // ------------------------------------------------------------
    if (datosBD.perros_raza || datosBD.perros_patio) {
      builder.agregarPerros({
        raza: datosBD.perros_raza,
        patio: datosBD.perros_patio
      });
    }

    // ------------------------------------------------------------
    // GATOS
    // ------------------------------------------------------------
    if (datosBD.gatos_ventanas || datosBD.gatos_adaptacion) {
      builder.agregarGatos({
        ventanas_protegidas: datosBD.gatos_ventanas,
        adaptacion_hogar: datosBD.gatos_adaptacion
      });
    }

    const solicitud = builder.construir();

    // Restaurar campos
    solicitud.datosGenerales.fecha_solicitud = datosBD.fecha_solicitud;
    solicitud.datosGenerales.estatus = datosBD.estatus;

    return solicitud;
  }
}

module.exports = SolicitudBuilder;
