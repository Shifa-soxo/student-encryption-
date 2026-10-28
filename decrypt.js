const crypto = require("crypto");
const fs = require("fs");

// Read private key
const privateKey = fs.readFileSync("private.pem", "utf8");

// Read encrypted data
const data = JSON.parse(
    fs.readFileSync("encrypted-data.json", "utf8")
);

// Decrypt AES key
const aesKey = crypto.privateDecrypt(
    {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256"
    },
    Buffer.from(data.encryptedKey, "base64")
);

// Decrypt data
const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    aesKey,
    Buffer.from(data.iv, "hex")
);

decipher.setAuthTag(Buffer.from(data.authTag, "hex"));

let originalData = decipher.update(
    data.encryptedData,
    "hex",
    "utf8"
);

originalData += decipher.final("utf8");

// Display original data
console.log("Original data:");
console.log(originalData);

// Save decrypted content to a separate file
fs.writeFileSync("decrypted-models.json", originalData);

console.log("Decrypted data saved to decrypted-models.json");