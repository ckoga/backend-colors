
exports.up = function(knex) {
  return knex.schema.table('projects', table => {
    table.integer('palette1_id').unsigned();
    table.foreign('palette1_id').references('palettes.id').onDelete('CASCADE');
    table.integer('palette2_id').unsigned();
    table.foreign('palette2_id').references('palettes.id').onDelete('CASCADE');
    table.integer('palette3_id').unsigned();
    table.foreign('palette3_id').references('palettes.id').onDelete('CASCADE');
  })
};

exports.down = function(knex) {
  return knex.schema.table('projects', table => {
    table.dropColumn('palette1_id')
    table.dropColumn('palette2_id')
    table.dropColumn('palette3_id')
  })
};
