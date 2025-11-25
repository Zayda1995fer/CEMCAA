
const db = require('../config/database');

const HistorialVida = {
  getByAnimal: (id_animal, callback) => {
    db.query('SELECT * FROM historial_vida WHERE id_animal = ?', [id_animal], callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM historial_vida WHERE id_historial = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO historial_vida SET ?', data, callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE historial_vida SET ? WHERE id_historial = ?', [data, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM historial_vida WHERE id_historial = ?', [id], callback);
  }
};

module.exports = HistorialVida;
