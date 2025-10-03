import { Pool } from "pg";
// import { DB_NAME } from "../constants.js";


const pool = new  Pool({
  connectionString: process.env.DB_URL,
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
