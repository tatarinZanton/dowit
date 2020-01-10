const config = require('config');

module.exports = {
  client: 'mysql',
  connection: config.db.connection,
  migrations: {
    tableName: 'knex_migrations',
  },
};
