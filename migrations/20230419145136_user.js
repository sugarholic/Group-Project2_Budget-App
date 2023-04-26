/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary().unsigned();
        table.string("name");
        table.string("password");
        table.string("email").notNullable();
        table.string("facebookID");
        table.string("accessToken");   //needed when logging in in facebook
        table.string("google_id");
        table.timestamp("create_at").defaultTo(knex.fn.now());
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users");
};
