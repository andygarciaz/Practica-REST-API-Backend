
import { getConnection, sql } from "../utils/db.js";
import { hashPassword } from "../utils/password.js";

// ------------------------------------------
// OBTENER TODOS LOS USUARIOS
// ------------------------------------------

export const getUsers = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(
            "SELECT id, name, age, points, username FROM dbo.users"
        );

        res.json(result.recordset);

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

// ------------------------------------------
// OBTENER UN USUARIO POR ID
// ------------------------------------------

export const getUser = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query(
                "SELECT id, name, age, points, username FROM dbo.users WHERE id = @id"
            );

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

// ------------------------------------------
// CREAR USUARIO CON CONTRASEÑA HASHEADA
// ------------------------------------------

export const postUser = async (req, res) => {
    try {
        const { name, age, points, username, password } = req.body;

        if (
            !name || !username ||
            typeof password !== "string" ||
            password.length === 0
        ) {
            return res.status(400).json({
                message: "Nombre, username y password son obligatorios"
            });
        }

        // Generar hash con una sal aleatoria
        const passwordHash = await hashPassword(password);

        const pool = await getConnection();

        await pool.request()
            .input("name", sql.VarChar, name)
            .input("age", sql.Int, age)
            .input("points", sql.Int, points ?? 0)
            .input("username", sql.VarChar, username)
            .input("password", sql.VarChar(255), passwordHash)
            .query(`
                INSERT INTO dbo.users
                    (name, age, points, username, password)
                VALUES
                    (@name, @age, @points, @username, @password)
            `);

        res.status(201).json({
            message: "Usuario creado correctamente"
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

// ------------------------------------------
// ACTUALIZAR USUARIO
// ------------------------------------------

export const putUser = async (req, res) => {
    try {
        const { name, age, points, username, password } = req.body;

        const pool = await getConnection();

        const request = pool.request()
            .input("id", sql.Int, req.params.id)
            .input("name", sql.VarChar, name)
            .input("age", sql.Int, age)
            .input("points", sql.Int, points)
            .input("username", sql.VarChar, username);

        let query = `
            UPDATE dbo.users
            SET
                name = @name,
                age = @age,
                points = @points,
                username = @username
        `;

        // Solo cambiar la contraseña si se proporciona una nueva
        if (typeof password === "string" && password.length > 0) {
            const passwordHash = await hashPassword(password);

            request.input(
                "password",
                sql.VarChar(255),
                passwordHash
            );

            query += ", password = @password";
        }

        query += " WHERE id = @id";

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json({
            message: "Usuario actualizado correctamente"
        });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

// ------------------------------------------
// ELIMINAR USUARIO
// ------------------------------------------

export const deleteUser = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("DELETE FROM dbo.users WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json({
            message: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error interno" });
    }
};
