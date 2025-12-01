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

  agregar() {
    throw new Error("No se pueden agregar componentes a una hoja");
  }

  eliminar() {
    throw new Error("No se pueden eliminar componentes de una hoja");
  }

  obtenerHijos() {
    return [];
  }

  mostrar(nivel = 0) {
    const indentacion = '  '.repeat(nivel);
    console.log(`${indentacion}🐕 ${this.nombre}`);
    console.log(`${indentacion}   Paseos: ${this.datos.frecuencia_paseos || 'No especificado'}`);
    console.log(`${indentacion}   Duración: ${this.datos.duracion_paseos || 'No especificado'}`);
    console.log(`${indentacion}   Energía: ${this.datos.nivel_energia_preferido || 'No especificado'}`);
  }

  validar() {
    // Para perros, los campos son opcionales si no se selecciona esta preferencia
    return [];
  }

  esCompleto() {
    // Considerar completo si al menos algunos campos clave están llenos
    return !!(this.datos.frecuencia_paseos && this.datos.duracion_paseos);
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