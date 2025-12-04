// server/models/composite/hojas/PreferenciaLeaf.js

const SolicitudComponent = require('../SolicitudComponent');

/**
 * Hoja (Leaf) - Representa la sección de Preferencia de Animal
 */
class PreferenciaLeaf extends SolicitudComponent {
  constructor() {
    super('Preferencia', 'leaf');
    this.datos = {
      tipo_animal: null, // 'perro', 'gato', 'sin_preferencia'
      edad_preferida: null,
      sexo_preferido: null,
      tamano_preferido: null,
      caracteristicas_deseadas: null,
      razones_preferencia: null
    };
  }

  setDatos(datos) {
    this.datos = { ...this.datos, ...datos };
    return this;
  }

  validar() {
    const errores = [];

    if (this.datos.tipo_animal) {
    this.datos.tipo_animal = this.datos.tipo_animal.toLowerCase().trim();
   }

    if (!this.datos.tipo_animal) {
      errores.push('Preferencia: Debe indicar el tipo de animal que desea adoptar');
    }

    const tiposValidos = ['perro', 'gato', 'sin_preferencia'];
    if (this.datos.tipo_animal && !tiposValidos.includes(this.datos.tipo_animal)) {
      errores.push('Preferencia: El tipo de animal debe ser perro, gato o sin_preferencia');
    }

    return errores;
  }

  calcularProgreso() {
    const camposRequeridos = ['tipo_animal'];

    // Campos opcionales pero recomendados
    const camposOpcionales = [
      'edad_preferida',
      'sexo_preferido',
      'tamano_preferido',
      'caracteristicas_deseadas',
      'razones_preferencia'
    ];

    const requeridosCompletados = camposRequeridos.filter(
      campo => this.datos[campo] !== null && this.datos[campo] !== undefined && this.datos[campo] !== ''
    ).length;

    const opcionalesCompletados = camposOpcionales.filter(
      campo => this.datos[campo] !== null && this.datos[campo] !== undefined && this.datos[campo] !== ''
    ).length;

    // El progreso se calcula dando más peso a los campos requeridos
    const totalCampos = camposRequeridos.length + camposOpcionales.length;
    const pesoRequeridos = 0.7;
    const pesoOpcionales = 0.3;

    const progresoRequeridos = (requeridosCompletados / camposRequeridos.length) * pesoRequeridos;
    const progresoOpcionales = (opcionalesCompletados / camposOpcionales.length) * pesoOpcionales;

    return {
      porcentaje: Math.round((progresoRequeridos + progresoOpcionales) * 100),
      completadas: requeridosCompletados + opcionalesCompletados,
      totales: totalCampos
    };
  }

  exportarJSON() {
    return {
      nombre: this.nombre,
      tipo: this.tipo,
      datos: this.datos,
      progreso: this.calcularProgreso()
    };
  }

  toDatabaseFormat() {
    return {
      tipo_animal: this.datos.tipo_animal
    };
  }

  mostrar(nivel = 0) {
    const indent = '  '.repeat(nivel);
    const progreso = this.calcularProgreso();
    console.log(`${indent}🎯 ${this.nombre} (${this.tipo}) - ${progreso.porcentaje}% completado`);
    console.log(`${indent}   Tipo de animal: ${this.datos.tipo_animal || 'No especificado'}`);
    if (this.datos.edad_preferida) {
      console.log(`${indent}   Edad preferida: ${this.datos.edad_preferida}`);
    }
    if (this.datos.tamano_preferido) {
      console.log(`${indent}   Tamaño preferido: ${this.datos.tamano_preferido}`);
    }
  }
}

module.exports = PreferenciaLeaf;