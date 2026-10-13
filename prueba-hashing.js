import { createHash } from "node:crypto";

// Función para generar hash SHA-256
function generarHash(texto) {
    return createHash("sha256")
        .update(texto, "utf8")
        .digest("hex");
}

// Textos de prueba
const texto1 = "ConstruccionDeSoftware123";
const texto2 = "ConstruccionDeSoftware123";
const texto3 = "ConstruccionDeSoftware124";

// Generamos hashes
const hash1 = generarHash(texto1);
const hash2 = generarHash(texto2);
const hash3 = generarHash(texto3);

console.log("===== PRUEBA DE HASHING =====");

console.log("\nTexto 1:", texto1);
console.log("Hash 1:", hash1);

console.log("\nTexto 2:", texto2);
console.log("Hash 2:", hash2);

console.log("\nTexto 3:", texto3);
console.log("Hash 3:", hash3);

console.log("\n===== COMPARACIONES =====");

console.log("¿Hash 1 es igual a Hash 2?", hash1 === hash2);
console.log("¿Hash 1 es igual a Hash 3?", hash1 === hash3); 