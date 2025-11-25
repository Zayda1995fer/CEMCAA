
const db = require('../config/database');

const ExpedienteClinico = {
  getAllByAnimal: (id_animal, callback) => {
    db.query('SELECT * FROM expediente_clinico WHERE id_animal = ?', [id_animal], callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM expediente_clinico WHERE id_expediente = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO expediente_clinico SET ?', data, callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE expediente_clinico SET ? WHERE id_expediente = ?', [data, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM expediente_clinico WHERE id_expediente = ?', [id], callback);
  }
};

module.exports = ExpedienteClinico;
