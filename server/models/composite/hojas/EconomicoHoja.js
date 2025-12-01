// server/models/composite/hojas/EconomicoHoja.js
const SolicitudComponent = require('../SolicitudComponent');

class EconomicoHoja extends SolicitudComponent {
  constructor() {
    super('Economico');
    this.datos = {
      actitud_gastos_veterinarios: null,
      dispuesto_esterilizar: null,
      presupuesto_mensual_estimado: 0
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
    console.log(`${indentacion}💰 ${this.nombre}`);
    console.log(`${indentacion}   Gastos vet: ${this.datos.actitud_gastos_veterinarios || 'No especificado'}`);
    console.log(`${indentacion}   Esterilizar: ${this.datos.dispuesto_esterilizar || 'No especificado'}`);
    console.log(`${indentacion}   Presupuesto: $${this.datos.presupuesto_mensual_estimado || 0} MXN`);
  }

  validar() {
    const errores = [];
    
    if (!this.datos.actitud_gastos_veterinarios) {
      errores.push("Debe indicar su actitud hacia los gastos veterinarios");
    }
    
    if (!this.datos.dispuesto_esterilizar) {
      errores.push("Debe indicar si está dispuesto a esterilizar la mascota");
    }
    
    if (!this.datos.presupuesto_mensual_estimado || this.datos.presupuesto_mensual_estimado <= 0) {
      errores.push("Debe especificar un presupuesto mensual válido");
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

module.exports = EconomicoHoja;