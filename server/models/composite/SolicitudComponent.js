// server/models/composite/SolicitudComponent.js
class SolicitudComponent {
  constructor(nombre) {
    if (this.constructor === SolicitudComponent) {
      throw new Error("SolicitudComponent es una clase abstracta");
    }
    this.nombre = nombre;
  }

  agregar(componente) {
    throw new Error("Método agregar() debe ser implementado");
  }

  eliminar(componente) {
    throw new Error("Método eliminar() debe ser implementado");
  }

  obtenerHijos() {
    throw new Error("Método obtenerHijos() debe ser implementado");
  }

  mostrar() {
    throw new Error("Método mostrar() debe ser implementado");
  }

  validar() {
    throw new Error("Método validar() debe ser implementado");
  }

  esCompleto() {
    throw new Error("Método esCompleto() debe ser implementado");
  }
}

module.exports = SolicitudComponent;