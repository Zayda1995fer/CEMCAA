const db = require('../config/database');

const Vacuna = {
  getAllByAnimal: (id_animal, callback) => {
    db.query('SELECT * FROM vacunas WHERE id_animal = ?', [id_animal], callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM vacunas WHERE id_vacuna = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO vacunas SET ?', data, callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE vacunas SET ? WHERE id_vacuna = ?', [data, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM vacunas WHERE id_vacuna = ?', [id], callback);
  }
};

module.exports = Vacuna;
