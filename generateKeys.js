const crypto = require("crypto");
const fs = require("fs");

// Stop if keys already exist
if (fs.existsSync("public.pem") || fs.existsSync("private.pem")) {
    console.log("A key file already exists. Do not overwrite your existing keys.");
    process.exit(1);
}

// Generate RSA keys
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,

    publicKeyEncoding: {
        type: "spki",
        format: "pem"
    },

    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
    }
});

// Save keys
fs.writeFileSync("public.pem", publicKey);
fs.writeFileSync("private.pem", privateKey);

console.log("Public and private keys generated successfully!");