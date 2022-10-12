"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    development: {
        client: "mysql2",
        connection: {
            database: "demo_bank",
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "twmjtgma012"
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
            database: "bank_test",
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "twmjtgma012"
        },
        migrations: {
            tableName: "migrations",
            directory: "../../migrations",
        },
    },
};
exports.default = config;
