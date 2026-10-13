
import {
    hashPassword,
    verifyPassword
} from "./utils/password.js";

async function probarScrypt() {

    console.log("===== PRUEBA DE SCRYPT =====");

    const password = "MiPassword123";

    // Generamos dos hashes de la misma contraseña
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    console.log("\nContraseña original:", password);

    console.log("\nHash 1:", hash1);
    console.log("\nHash 2:", hash2);

    // Comparamos los hashes generados
    console.log("\n===== COMPARACIONES =====");

    console.log(
        "¿Los hashes son iguales?",
        hash1 === hash2
    );

    // Verificamos una contraseña correcta
    const resultadoCorrecto = await verifyPassword(
        "MiPassword123",
        hash1
    );

    console.log(
        "¿Contraseña correcta?",
        resultadoCorrecto
    );

    // Verificamos una contraseña incorrecta
    const resultadoIncorrecto = await verifyPassword(
        "MiPassword124",
        hash1
    );

    console.log(
        "¿Contraseña incorrecta?",
        resultadoIncorrecto
    );

}

probarScrypt().catch(console.error);
