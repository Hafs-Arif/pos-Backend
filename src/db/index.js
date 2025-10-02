import { Pool } from "pg";
import { DB_NAME } from "../constants.js";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

export default pool;
