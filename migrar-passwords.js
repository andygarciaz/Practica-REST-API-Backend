
import { getConnection, sql } from "./utils/db.js";
import { hashPassword } from "./utils/password.js";

// Formato que utiliza nuestro módulo password.js
const FORMATO_SCRYPT = /^[0-9a-f]{64}:[0-9a-f]{128}$/;

async function migrarPasswords() {
    let transaction;
    let transactionStarted = false;

    try {
        console.log("===== MIGRACIÓN DE PASSWORDS =====");

        const pool = await getConnection();

        // Verificar que estamos en la base correcta
        const resultadoBD = await pool.request()
            .query("SELECT DB_NAME() AS baseActual");

        const baseActual = resultadoBD.recordset[0].baseActual;

        console.log("Base de datos:", baseActual);

        if (baseActual !== "RestAPI_DB") {
            throw new Error(
                "Migración cancelada: base de datos inesperada."
            );
        }

        transaction = new sql.Transaction(pool);

        await transaction.begin();
        transactionStarted = true;

        // Leer y bloquear registros durante la transacción
        const resultado = await new sql.Request(transaction)
            .query(`
                SELECT id, password
                FROM dbo.users WITH (UPDLOCK, HOLDLOCK)
                ORDER BY id
            `);

        const usuarios = resultado.recordset;

        console.log("Usuarios encontrados:", usuarios.length);

        if (usuarios.length === 0) {
            console.log("No hay usuarios por migrar.");
            await transaction.rollback();
            transactionStarted = false;
            return;
        }

        // Cancelar si hay registros que ya parecen migrados
        const usuariosHasheados = usuarios.filter(
            usuario =>
                typeof usuario.password === "string" &&
                FORMATO_SCRYPT.test(usuario.password)
        );

        if (usuariosHasheados.length > 0) {
            if (usuariosHasheados.length === usuarios.length) {
                console.log(
                    "Todos los usuarios ya tienen formato scrypt."
                );
                await transaction.rollback();
                transactionStarted = false;
                return;
            }

            throw new Error(
                "Se detectaron usuarios previamente migrados. " +
                "Migración cancelada para evitar doble hashing."
            );
        }

        // Convertir cada contraseña original en un hash
        for (const usuario of usuarios) {

            if (
                typeof usuario.password !== "string" ||
                usuario.password.length === 0
            ) {
                throw new Error(
                    `Contraseña inválida en usuario ID ${usuario.id}`
                );
            }

            const passwordHash = await hashPassword(
                usuario.password
            );

            const resultadoUpdate =
                await new sql.Request(transaction)
                    .input("id", sql.Int, usuario.id)
                    .input(
                        "passwordOriginal",
                        sql.VarChar(255),
                        usuario.password
                    )
                    .input(
                        "passwordHash",
                        sql.VarChar(255),
                        passwordHash
                    )
                    .query(`
                        UPDATE dbo.users
                        SET password = @passwordHash
                        WHERE id = @id
                          AND password = @passwordOriginal
                    `);

            if (resultadoUpdate.rowsAffected[0] !== 1) {
                throw new Error(
                    `No se pudo actualizar el usuario ID ${usuario.id}`
                );
            }

            console.log(
                `Usuario ID ${usuario.id}: migrado correctamente`
            );
        }

        // Confirmar únicamente si todos terminaron
        await transaction.commit();
        transactionStarted = false;

        console.log("\n===== MIGRACIÓN COMPLETADA =====");
        console.log(
            `Total de contraseñas migradas: ${usuarios.length}`
        );

    } catch (error) {

        if (transactionStarted) {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.error(
                    "Error al revertir transacción:",
                    rollbackError.message
                );
            }
        }

        console.error(
            "Error de migración:",
            error.message
        );

        process.exitCode = 1;

    } finally {
        await sql.close();
    }
}

await migrarPasswords();
