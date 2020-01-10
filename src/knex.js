module.exports = () => {
  const config = require('config');
  const knex = require('knex')({ ...config.db, useNullAsDefault: true });

  return knex;
};
