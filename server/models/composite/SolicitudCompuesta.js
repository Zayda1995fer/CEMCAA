// server/models/composite/SolicitudCompuesta.js
const SolicitudComponent = require('./SolicitudComponent');

class SolicitudCompuesta extends SolicitudComponent {
  constructor(nombre) {
    super(nombre);
    this.hijos = [];
    this.datosGenerales = {
      usuario_id: null,
      animal_id: null,
      fecha_solicitud: null,
      estatus: 'Pendiente'
    };
  }

  setDatosGenerales(datos) {
    this.datosGenerales = { ...this.datosGenerales, ...datos };
  }

  agregar(componente) {
    if (componente instanceof SolicitudComponent) {
      this.hijos.push(componente);
    } else {
      throw new Error("Solo se pueden agregar componentes de tipo SolicitudComponent");
    }
  }

  eliminar(componente) {
    const index = this.hijos.indexOf(componente);
    if (index > -1) {
      this.hijos.splice(index, 1);
    }
  }

  obtenerHijos() {
    return this.hijos;
  }

  obtenerPorNombre(nombre) {
    return this.hijos.find(hijo => hijo.nombre === nombre);
  }

  mostrar(nivel = 0) {
    const indentacion = '  '.repeat(nivel);
    console.log(`${indentacion}📋 Solicitud: ${this.nombre}`);
    console.log(`${indentacion}   Usuario ID: ${this.datosGenerales.usuario_id}`);
    console.log(`${indentacion}   Animal ID: ${this.datosGenerales.animal_id}`);
    console.log(`${indentacion}   Estatus: ${this.datosGenerales.estatus}`);
    
    if (this.hijos.length > 0) {
      console.log(`${indentacion}   Secciones:`);
      this.hijos.forEach(hijo => hijo.mostrar(nivel + 1));
    }
  }

  validar() {
    const errores = [];
    
    // Validar datos generales
    if (!this.datosGenerales.usuario_id) {
      errores.push("Falta el ID de usuario");
    }
    if (!this.datosGenerales.animal_id) {
      errores.push("Falta el ID del animal");
    }

    // Validar cada sección
    this.hijos.forEach(hijo => {
      const erroresHijo = hijo.validar();
      if (erroresHijo.length > 0) {
        errores.push({
          seccion: hijo.nombre,
          errores: erroresHijo
        });
      }
    });

    return errores;
  }

  esCompleto() {
    // La solicitud está completa si no tiene errores de validación
    const errores = this.validar();
    return errores.length === 0;
  }

  obtenerProgreso() {
    const seccionesCompletas = this.hijos.filter(hijo => hijo.esCompleto()).length;
    const totalSecciones = this.hijos.length;
    return {
      completas: seccionesCompletas,
      total: totalSecciones,
      porcentaje: totalSecciones > 0 ? (seccionesCompletas / totalSecciones) * 100 : 0
    };
  }

  toJSON() {
    return {
      nombre: this.nombre,
      datosGenerales: this.datosGenerales,
      secciones: this.hijos.map(hijo => hijo.toJSON()),
      progreso: this.obtenerProgreso(),
      esCompleto: this.esCompleto()
    };
  }

  // Método para obtener datos en formato para la BD
  toDatabaseFormat() {
    const datos = {
      solicitud: this.datosGenerales,
      secciones: {}
    };

    this.hijos.forEach(hijo => {
      datos.secciones[hijo.nombre] = hijo.datos;
    });

    return datos;
  }
}

module.exports = SolicitudCompuesta;