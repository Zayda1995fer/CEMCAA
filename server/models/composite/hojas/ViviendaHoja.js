// server/models/composite/hojas/ViviendaHoja.js
const SolicitudComponent = require('../SolicitudComponent');

class ViviendaHoja extends SolicitudComponent {
  constructor() {
    super('Vivienda');
    this.datos = {
      tipo_vivienda: null,
      es_alquilada: 0,
      tiene_permiso_escrito: 0
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
    console.log(`${indentacion}🏠 ${this.nombre}`);
    console.log(`${indentacion}   Tipo: ${this.datos.tipo_vivienda || 'No especificado'}`);
    console.log(`${indentacion}   Alquilada: ${this.datos.es_alquilada ? 'Sí' : 'No'}`);
    if (this.datos.es_alquilada) {
      console.log(`${indentacion}   Permiso: ${this.datos.tiene_permiso_escrito ? 'Sí' : 'No'}`);
    }
  }

  validar() {
    const errores = [];
    
    if (!this.datos.tipo_vivienda) {
      errores.push("Debe especificar el tipo de vivienda");
    }
    
    if (this.datos.es_alquilada && !this.datos.tiene_permiso_escrito) {
      errores.push("Vivienda alquilada requiere permiso escrito del propietario");
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

module.exports = ViviendaHoja;