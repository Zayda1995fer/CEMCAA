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
    console.log(`${indentacion}🐱 ${this.nombre}`);
    console.log(`${indentacion}   Ventanas: ${this.datos.ventanas_protegidas || 'No especificado'}`);
    console.log(`${indentacion}   Arenero: ${this.datos.frecuencia_limpieza_arenero || 'No especificado'}`);
    console.log(`${indentacion}   Personalidad: ${this.datos.personalidad_preferida || 'No especificado'}`);
  }

  validar() {
    const errores = [];
    
    if (this.datos.considera_desungulacion === 1) {
      errores.push("La desungulación no está permitida - práctica cruel");
    }
    
    return errores;
  }

  esCompleto() {
    // Considerar completo si al menos algunos campos clave están llenos
    return !!(this.datos.ventanas_protegidas && this.datos.frecuencia_limpieza_arenero);
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