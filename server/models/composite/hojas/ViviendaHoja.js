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

  validar() {
    const errores = [];

    if (!this.datos.tipo_vivienda) {
      errores.push("Debe especificar el tipo de vivienda");
    }

    if (this.datos.es_alquilada === 1 &&
        (this.datos.tiene_permiso_escrito === null || this.datos.tiene_permiso_escrito === 0)) {
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
