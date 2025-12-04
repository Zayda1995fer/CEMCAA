// server/models/composite/hojas/GatosHoja.js
const SolicitudComponent = require('../SolicitudComponent');

class GatosHoja extends SolicitudComponent {
  constructor() {
    super('Gatos');
    this.datos = {
      ventanas_protegidas: null,
      adaptacion_hogar: null,
      conocimiento_higiene: null,
      frecuencia_limpieza_arenero: null,
      manejo_cuidado_pelaje: null,
      conocimiento_higiene_dental: null,
      personalidad_preferida: null,
      plan_enriquecimiento: null,
      tipo_alimentacion: null,
      considera_desungulacion: 0
    };
  }

  setDatos(datos) {
    this.datos = { ...this.datos, ...datos };
  }

  validar() {
    const errores = [];

    if (this.datos.considera_desungulacion === 1) {
      errores.push("La desungulación no está permitida - práctica cruel");
    }

    return errores;
  }

  esCompleto() {
    return (
      this.datos.ventanas_protegidas &&
      this.datos.frecuencia_limpieza_arenero &&
      this.datos.personalidad_preferida
    );
  }

  toJSON() {
    return {
      nombre: this.nombre,
      datos: this.datos,
      esCompleto: this.esCompleto()
    };
  }
}

module.exports = GatosHoja;
