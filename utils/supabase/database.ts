import { Client } from "pg";

export const databaseClient = () => {
    return new Client({
        connectionString: process.env.DB_CONNECTION_STRING'',
    })
}

