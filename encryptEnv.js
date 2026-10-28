const fs = require("fs");
const crypto = require("crypto");

const envFile = ".env";
const encryptedFile = "encrypted-env.json";
const keyFile = "env-encryption-key.txt";

try {
    if (!fs.existsSync(envFile)) {
        throw new Error(".env file not found");
    }

    // Read the original .env file
    const envData = fs.readFileSync(envFile, "utf8");

    // Generate an AES-256 key and IV
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);

    // Encrypt the .env content
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    let encryptedData = cipher.update(envData, "utf8", "hex");
    encryptedData += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Save the encrypted file
    const encryptedEnv = {
        algorithm: "aes-256-gcm",
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
        encryptedData
    };

    fs.writeFileSync(
        encryptedFile,
        JSON.stringify(encryptedEnv, null, 2)
    );

    // Save the key separately
    fs.writeFileSync(keyFile, key.toString("hex"), {
        mode: 0o600
    });

    console.log(".env encrypted successfully!");
    console.log(`Encrypted file: ${encryptedFile}`);
    console.log(`Encryption key: ${keyFile}`);
    console.log("Keep the encryption key secret!");

} catch (error) {
    console.error("Encryption failed:", error.message);
    process.exitCode = 1;
}