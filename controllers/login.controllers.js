
import { getConnection, sql } from "../utils/db.js";
import { verifyPassword } from "../utils/password.js";

// ------------------------------------------
// INICIAR SESIÓN
// ------------------------------------------

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar credenciales recibidas
        if (
            typeof username !== "string" ||
            !username.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                login: false,
                message: "Username y password son obligatorios"
            });
        }

        const pool = await getConnection();

        // Buscar usuario por username
        const result = await pool.request()
            .input("username", sql.VarChar(50), username)
            .query(`
                SELECT
                    id,
                    name,
                    age,
                    points,
                    username,
                    password
                FROM dbo.users
                WHERE username = @username
            `);

        const user = result.recordset[0];

        // Si el usuario no existe
        if (!user) {
            return res.status(401).json({
                login: false,
                message: "Credenciales incorrectas"
            });
        }

        // Verificar contraseña usando scrypt
        const passwordCorrecta = await verifyPassword(
            password,
            user.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                login: false,
                message: "Credenciales incorrectas"
            });
        }

        // Inicio de sesión exitoso
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

    } catch (error) {
        console.error("Error en login:", error);

        return res.status(500).json({
            login: false,
            message: "Error interno del servidor"
        });
    }
};
