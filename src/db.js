import pg from 'pg';

const { Pool } = pg;

/*
 * ======================================================
 * CONEXIÓN CON POSTGRESQL
 * ======================================================
 * El Pool administra las conexiones que utilizará la API.
 * La configuración se obtiene desde variables de entorno
 * para no escribir credenciales directamente en el código.
 */
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

export default pool;
