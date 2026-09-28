
import { getConnection } from "./utils/db.js";

try {
    const pool = await getConnection();

    console.log("Conexión exitosa a SQL Server");

    const result = await pool.request().query(
        "SELECT DB_NAME() AS databaseName"
    );

    console.log("Base de datos:", result.recordset[0].databaseName);

    await pool.close();

} catch (error) {
    console.error("Error al conectar:", error.message);
    process.exitCode = 1;
}