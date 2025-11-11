import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";
// import { DB_NAME } from "../constants.js";

if (!process.env.DB_URL) {
  console.error('Database URL not found in environment variables');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DB_URL,
  // Add some reasonable defaults
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

export default pool;

// Handle unexpected errors on idle clients (recommended by `node-postgres`).
pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
  // Depending on your desired behaviour you might want to exit the process here:
  // process.exit(-1);
});

// Runs a quick connectivity check on import so startup failures are visible and
// can be handled early. Wraped in try/catch to avoid unhandled promise rejections.
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Postgres pool connected');
  } catch (err) {
    console.error('Error connecting to Postgres', err);
    process.exit(1);
  }
})();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT || 5432,
// });
