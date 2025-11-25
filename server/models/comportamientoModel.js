const db = require('../config/database');

const Comportamiento = {
  getByAnimal: (id_animal, callback) => {
    db.query('SELECT * FROM comportamiento WHERE id_animal = ?', [id_animal], callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM comportamiento WHERE id_comportamiento = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO comportamiento SET ?', data, callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE comportamiento SET ? WHERE id_comportamiento = ?', [data, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM comportamiento WHERE id_comportamiento = ?', [id], callback);
  }
};

module.exports = Comportamiento;
