exports.up = async knex => {
  await knex.schema.createTable('delivery_calculation', table => {
    table.increments('id').primary();
    table.string('csvFileName');
    table.string('userEmail');
    table.boolean('isZipValid');
    table.integer('rate');
    table.integer('duration');
    table.string('apiError');

    table.timestamp('createdAt');
    table.timestamp('updatedAt');
    table.timestamp('deletedAt');
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('delivery_calculation');
};
