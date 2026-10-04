import { getConnection, sql } from "../utils/db.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validamos que lleguen ambos datos
        if (!username || !password) {
            return res.status(400).json({
                login: false,
                message: "Username y password son obligatorios"
            });
        }

        const pool = await getConnection();

        const result = await pool.request()
            .input("username", sql.VarChar, username)
            .query("SELECT * FROM users WHERE username = @username");

        const user = result.recordset[0];

        // Si no existe el usuario
        if (!user) {
            return res.status(401).json({
                login: false,
                message: "Usuario no encontrado"
            });
        }

        // Si la contraseña coincide
        if (user.password === password) {
            return res.status(200).json({
                login: true,
                message: "Inicio de sesión correcto",
                user: {
                    id: user.id,
                    name: user.name,
                    age: user.age,
                    points: user.points,
                    username: user.username
                }
            });
        }

        // Si existe el usuario pero la contraseña es incorrecta
        return res.status(401).json({
            login: false,
            message: "Contraseña incorrecta"
        });

    } catch (error) {
        console.error("Error en login:", error);

        return res.status(500).json({
            login: false,
            message: "Error interno del servidor"
        });
    }
};