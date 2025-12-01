// server/models/composite/hojas/HogarFamiliaHoja.js
const SolicitudComponent = require('../SolicitudComponent');

class HogarFamiliaHoja extends SolicitudComponent {
  constructor() {
    super('HogarFamilia');
    this.datos = {
      vive_solo: 0,
      vive_con_adultos: 0,
      vive_con_ninos_menores_5: 0,
      vive_con_ninos_6_12: 0,
      vive_con_adolescentes: 0,
      vive_con_adultos_mayores: 0,
      vive_con_otras_mascotas: 0,
      tipos_mascotas_actuales: null,
      horas_solo_al_dia: null,
      responsable_principal: null
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
    console.log(`${indentacion}👨‍👩‍👧‍👦 ${this.nombre}`);
    console.log(`${indentacion}   Horas solo: ${this.datos.horas_solo_al_dia || 'No especificado'}`);
    console.log(`${indentacion}   Responsable: ${this.datos.responsable_principal || 'No especificado'}`);
    console.log(`${indentacion}   Otras mascotas: ${this.datos.vive_con_otras_mascotas ? 'Sí' : 'No'}`);
  }

  validar() {
    const errores = [];
    
    if (!this.datos.horas_solo_al_dia) {
      errores.push("Debe especificar las horas que el animal estará solo");
    }
    
    if (!this.datos.responsable_principal) {
      errores.push("Debe indicar quién será el responsable principal");
    }
    
    if (this.datos.vive_con_otras_mascotas && !this.datos.tipos_mascotas_actuales) {
      errores.push("Debe especificar qué mascotas tiene actualmente");
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

module.exports = HogarFamiliaHoja;