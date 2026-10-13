
import {
    randomBytes,
    scrypt,
    timingSafeEqual
} from "node:crypto";

import { promisify } from "node:util";

// Convertimos scrypt en una función compatible con await
const scryptAsync = promisify(scrypt);

// Configuración del hashing
const SALT_LENGTH = 32;
const KEY_LENGTH = 64;

// ------------------------------------------
// GENERAR HASH DE CONTRASEÑA
// ------------------------------------------

export async function hashPassword(password) {

    // Generamos una sal aleatoria para cada contraseña
    const salt = randomBytes(SALT_LENGTH).toString("hex");

    // Derivamos una clave usando scrypt
    const derivedKey = await scryptAsync(
        password,
        salt,
        KEY_LENGTH
    );

    // Convertimos el resultado a hexadecimal
    const hash = derivedKey.toString("hex");

    // Guardamos sal y hash juntos
    return `${salt}:${hash}`;
}


// ------------------------------------------
// VERIFICAR CONTRASEÑA
// ------------------------------------------

export async function verifyPassword(password, storedHash) {

    if (typeof storedHash !== "string") {
        return false;
    }

    // Separamos la sal y el hash almacenado
    const parts = storedHash.split(":");

    if (parts.length !== 2) {
        return false;
    }

    const [salt, hash] = parts;

    // Validamos el formato antes de convertir
    if (
        !/^[0-9a-f]{64}$/.test(salt) ||
        !/^[0-9a-f]{128}$/.test(hash)
    ) {
        return false;
    }

    // Convertimos el hash almacenado a bytes
    const storedKey = Buffer.from(hash, "hex");

    // Generamos un nuevo hash usando la misma sal
    const derivedKey = await scryptAsync(
        password,
        salt,
        storedKey.length
    );

    // Comparamos de manera segura
    return timingSafeEqual(storedKey, derivedKey);
}
