"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = function(knex) {
    return knex.schema.createTable("users", function(table) {
        table.uuid("id").primary();
        table.string("name").notNullable();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table.timestamps(true);
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable("users");
};