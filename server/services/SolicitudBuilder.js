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
    const experiencia = new ExperienciaHoja();
    experiencia.setDatos(datos);
    this.solicitud.agregar(experiencia);
    return this;
  }

  agregarEconomico(datos) {
    const economico = new EconomicoHoja();
    economico.setDatos(datos);
    this.solicitud.agregar(economico);
    return this;
  }

  agregarPreferencia(datos) {
    const preferencia = new PreferenciaHoja();
    preferencia.setDatos(datos);
    this.solicitud.agregar(preferencia);
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

  // Método estático para construir desde datos del frontend
  static construirDesdeFormulario(datos) {
    const builder = new SolicitudBuilder();

    builder
      .setDatosGenerales({
        usuario_id: datos.usuario_id,
        animal_id: datos.animal_id
      })
      .agregarVivienda(datos.vivienda)
      .agregarHogarFamilia(datos.hogar)
      .agregarExperiencia(datos.experiencia)
      .agregarEconomico(datos.economico)
      .agregarPreferencia(datos.preferencia);

    // Agregar secciones opcionales según la preferencia
    if (datos.perros) {
      builder.agregarPerros(datos.perros);
    }

    if (datos.gatos) {
      builder.agregarGatos(datos.gatos);
    }

    return builder.construir();
  }

  // Método estático para reconstruir desde BD
  static reconstruirDesdeBD(datosBD) {
    const builder = new SolicitudBuilder();

    builder.setDatosGenerales({
      usuario_id: datosBD.usuario_id,
      animal_id: datosBD.animal_id
    });

    // Reconstruir cada sección si existe
    if (datosBD.vivienda) {
      builder.agregarVivienda(datosBD.vivienda);
    }

    if (datosBD.hogar) {
      builder.agregarHogarFamilia(datosBD.hogar);
    }

    if (datosBD.experiencia) {
      builder.agregarExperiencia(datosBD.experiencia);
    }

    if (datosBD.economico) {
      builder.agregarEconomico(datosBD.economico);
    }

    if (datosBD.preferencia) {
      builder.agregarPreferencia(datosBD.preferencia);
    }

    if (datosBD.perros) {
      builder.agregarPerros(datosBD.perros);
    }

    if (datosBD.gatos) {
      builder.agregarGatos(datosBD.gatos);
    }

    const solicitud = builder.construir();
    
    // Restaurar fecha y estatus si existen
    if (datosBD.fecha_solicitud) {
      solicitud.datosGenerales.fecha_solicitud = datosBD.fecha_solicitud;
    }
    if (datosBD.estatus) {
      solicitud.datosGenerales.estatus = datosBD.estatus;
    }

    return solicitud;
  }
}

module.exports = SolicitudBuilder;