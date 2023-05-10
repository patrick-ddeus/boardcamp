import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const configDatabase = {
    connectionString: process.env.DATABASE_URL,
}

export const db = new Pool(configDatabase)