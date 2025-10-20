// /lib/db.ts
/*import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,      // e.g. 'localhost' or 'YOURSERVER\\SQLEXPRESS'
  database: process.env.DB_NAME!,
  options: { encrypt: true, trustServerCertificate: true },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool() {
  if (pool && pool.connected) return pool;
  pool = await new sql.ConnectionPool(config).connect();
  return pool;
}

export { sql };
*/