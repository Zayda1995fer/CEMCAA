const db = require('../config/database');

const Animal = {
  // 🔍 Leer todos
  getAll: (callback) => {
    db.query('SELECT * FROM animales', callback);
  },

  // 🔍 Leer por ID
  getById: (id, callback) => {
    db.query('SELECT * FROM animales WHERE Id = ?', [id], callback);
  },

  // ➕ Crear
  create: (data, callback) => {
    db.query('INSERT INTO animales SET ?', data, callback);
  },

  // ✏️ Actualizar
  update: (id, data, callback) => {
    db.query('UPDATE animales SET ? WHERE Id = ?', [data, id], callback);
  },

  // 🗑️ Eliminar
  delete: (id, callback) => {
    db.query('DELETE FROM animales WHERE Id = ?', [id], callback);
  }
};

module.exports = Animal;
