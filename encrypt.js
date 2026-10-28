const crypto = require("crypto");
const fs = require("fs");

// Read public key
const publicKey = fs.readFileSync("public.pem", "utf8");

// Read original data
const originalData = fs.readFileSync("models.json", "utf8");

// Generate AES key and IV
const aesKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);

// Encrypt original data
const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);

let encryptedData = cipher.update(originalData, "utf8", "hex");
encryptedData += cipher.final("hex");

const authTag = cipher.getAuthTag();

// Encrypt AES key using public key
const encryptedKey = crypto.publicEncrypt(
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256"
    },
    aesKey
);

// Save encrypted data
const result = {
    encryptedKey: encryptedKey.toString("base64"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    encryptedData
};

fs.writeFileSync(
    "encrypted-data.json",
    JSON.stringify(result, null, 2)
);

console.log("models.json encrypted successfully!");
console.log("Encrypted data saved to encrypted-data.json");