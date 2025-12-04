// server/models/composite/hojas/ExperienciaHoja.js
const SolicitudComponent = require('../SolicitudComponent');

class ExperienciaHoja extends SolicitudComponent {
  constructor() {
    super('Experiencia');
    this.datos = {
      motivo_adopcion: null,
      ha_tenido_mascotas: 0, // 0 = Sí, 1 = No
      detalle_mascotas_anteriores: null,
      tipo_mascotas_anteriores: null,
      preparado_compromiso_largo_plazo: null
    };
  }

  setDatos(datos) {
    this.datos = { ...this.datos, ...datos };
  }

  validar() {
    const errores = [];

    // Normalizar cadenas
    if (typeof this.datos.motivo_adopcion === "string") {
      this.datos.motivo_adopcion = this.datos.motivo_adopcion.trim();
    }

    // Validar motivo
    if (!this.datos.motivo_adopcion || this.datos.motivo_adopcion.length < 10) {
      errores.push("Debe explicar el motivo de adopción (mínimo 10 caracteres)");
    }

    // Validar compromiso
    if (this.datos.preparado_compromiso_largo_plazo === null ||
        this.datos.preparado_compromiso_largo_plazo === undefined) {
      errores.push("Debe indicar si está preparado para un compromiso a largo plazo");
    }

    // ⇨ AQUÍ ESTABA EL PROBLEMA
    // 0 = Sí tuvo mascotas → debe especificar
    // 1 = No tuvo mascotas → no se pide nada
    if (this.datos.ha_tenido_mascotas === 0) {
      if (
        !this.datos.tipo_mascotas_anteriores ||
        typeof this.datos.tipo_mascotas_anteriores !== "string" ||
        this.datos.tipo_mascotas_anteriores.trim() === ""
      ) {
        errores.push("Debe especificar qué tipo de mascotas ha tenido");
      }
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
