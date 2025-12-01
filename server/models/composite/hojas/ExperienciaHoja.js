// server/models/composite/hojas/ExperienciaHoja.js
const SolicitudComponent = require('../SolicitudComponent');

class ExperienciaHoja extends SolicitudComponent {
  constructor() {
    super('Experiencia');
    this.datos = {
      motivo_adopcion: null,
      ha_tenido_mascotas: 0,
      detalle_mascotas_anteriores: null,
      tipo_mascotas_anteriores: null,
      preparado_compromiso_largo_plazo: null
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
    console.log(`${indentacion}📚 ${this.nombre}`);
    console.log(`${indentacion}   Motivo: ${this.datos.motivo_adopcion?.substring(0, 50) || 'No especificado'}...`);
    console.log(`${indentacion}   Ha tenido mascotas: ${this.datos.ha_tenido_mascotas ? 'Sí' : 'No'}`);
    console.log(`${indentacion}   Compromiso: ${this.datos.preparado_compromiso_largo_plazo || 'No especificado'}`);
  }

  validar() {
    const errores = [];
    
    if (!this.datos.motivo_adopcion || this.datos.motivo_adopcion.trim().length < 10) {
      errores.push("Debe explicar el motivo de adopción (mínimo 10 caracteres)");
    }
    
    if (!this.datos.preparado_compromiso_largo_plazo) {
      errores.push("Debe indicar si está preparado para un compromiso a largo plazo");
    }
    
    if (this.datos.ha_tenido_mascotas && !this.datos.tipo_mascotas_anteriores) {
      errores.push("Debe especificar qué tipo de mascotas ha tenido");
    }
    
    return errores;
  }

  esCompleto() {
    return this.validar().length === 0;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      datos: this.datos,
      esCompleto: this.esCompleto()
    };
  }
}

module.exports = ExperienciaHoja;