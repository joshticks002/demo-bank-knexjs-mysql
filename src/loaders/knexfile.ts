import type { Knex } from "knex";
import dotenv from "dotenv";
import configuration from "../config/index"
dotenv.config();

const db = configuration.Database
const config: { [key: string]: Knex.Config } = {
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

  production: {
    client: "mysql2",
    connection: {
      host: configuration.Production.host,
      port: db.port,
      user: configuration.Production.user,
      password: configuration.Production.password,
      database: configuration.Production.database,
    },
    migrations: {
      tableName: "migrations",
      directory: "../../migrations",
    },
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

export default config
