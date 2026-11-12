import { createPool, type Pool } from "mysql2/promise";

declare global {
  var caicosMySqlPool: Pool | undefined;
}

export function isMySqlConfigured() {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_DATABASE && process.env.MYSQL_USER);
}

export function getMySqlPool() {
  if (!globalThis.caicosMySqlPool) {
    globalThis.caicosMySqlPool = createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT || 3306),
      database: process.env.MYSQL_DATABASE || "",
      user: process.env.MYSQL_USER || "",
      password: process.env.MYSQL_PASSWORD || "",
      connectionLimit: 10,
      dateStrings: true,
    });
  }

  return globalThis.caicosMySqlPool;
}
