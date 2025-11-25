const db = require('../config/database');

const Desparasitacion = {
  getAllByAnimal: (id_animal, callback) => {
    db.query('SELECT * FROM desparasitaciones WHERE id_animal = ?', [id_animal], callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM desparasitaciones WHERE id_desparasitacion = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO desparasitaciones SET ?', data, callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE desparasitaciones SET ? WHERE id_desparasitacion = ?', [data, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM desparasitaciones WHERE id_desparasitacion = ?', [id], callback);
  }
};

module.exports = Desparasitacion;
