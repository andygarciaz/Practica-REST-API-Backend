
import sql from "mssql";
import "dotenv/config";

const options = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,

    server: process.env.DB_SERVER,
    port: 1433,

    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

export const getConnection = async () => {
    const pool = await sql.connect(options);
    return pool;
};

export { sql };