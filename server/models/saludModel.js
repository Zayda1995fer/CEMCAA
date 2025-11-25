
const db = require('../config/database');

const Salud = {
  getByAnimal: (id_animal, callback) => {
    db.query('SELECT * FROM salud WHERE id_animal = ?', [id_animal], callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM salud WHERE id_salud = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO salud SET ?', data, callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE salud SET ? WHERE id_salud = ?', [data, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM salud WHERE id_salud = ?', [id], callback);
  }
};

module.exports = Salud;
