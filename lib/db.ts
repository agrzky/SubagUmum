import { createPool, PoolOptions } from 'mysql2/promise';

const dbConfig: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
};

const pool = createPool(dbConfig);

export async function query<T>(sql: string, params: (string | number)[] = []): Promise<T> {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

export default pool;

