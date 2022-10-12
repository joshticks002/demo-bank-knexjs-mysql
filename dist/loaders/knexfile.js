"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("../config/index"));
dotenv_1.default.config();
const db = index_1.default.Database;
const config = {
    development: {
        client: "mysql2",
        connection: {
            database: db.database,
            host: db.host,
            port: db.port,
            user: db.user,
            password: db.password
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "migrations",
            directory: "../../migrations",
        }
    },
    test: {
        client: "mysql2",
        connection: {
            database: db.dbTest,
            host: db.host,
            port: db.port,
            user: db.user,
            password: db.password
        },
        migrations: {
            tableName: "migrations",
            directory: "../../migrations",
        },
    },
};
exports.default = config;
