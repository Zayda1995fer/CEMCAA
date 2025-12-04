// server/models/composite/hojas/PerrosHoja.js
const SolicitudComponent = require('../SolicitudComponent');

class PerrosHoja extends SolicitudComponent {
  constructor() {
    super('Perros');
    this.datos = {
      frecuencia_paseos: null,
      duracion_paseos: null,
      nivel_energia_preferido: null,
      disposicion_entrenamiento: null,
      plan_socializacion: null,
      conocimiento_higiene: null,
      frecuencia_bano_cepillado: null,
      manejo_muda_pelaje: null,
      conocimiento_cuidado_dental: null
    };
  }

  setDatos(datos) {
    this.datos = { ...this.datos, ...datos };
  }

  validar() {
    return [];
  }

  esCompleto() {
    return (
      this.datos.frecuencia_paseos &&
      this.datos.duracion_paseos
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

module.exports = PerrosHoja;
