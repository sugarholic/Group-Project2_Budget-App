/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    //transaction_id, description, amount, users_id
    return knex.schema.createTable("transaction", (table) => {
        table.increments("transaction_id").primary().unsigned();
        table.string("description");
        table.integer("amount");
        table.integer("users_id").unsigned();
        table.foreign("users_id").references("users.id")
        table.timestamp("create_at").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("transaction");
};
