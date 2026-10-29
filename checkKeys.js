const crypto = require("crypto");
const fs = require("fs");

try {
const publicKey = fs.readFileSync("public.pem", "utf8");
const privateKey = fs.readFileSync("private.pem", "utf8");

// Derive the public key from the private key
const derivedPublicKey = crypto.createPublicKey(privateKey);

// Convert both public keys to a comparable format
const original = crypto.createPublicKey(publicKey).export({
    type: "spki",
    format: "der"
});

const derived = derivedPublicKey.export({
    type: "spki",
    format: "der"
});

if (original.equals(derived)) {
    console.log("SUCCESS: Public and private keys MATCH.");
} else {
    console.log("ERROR: Public and private keys DO NOT MATCH.");
}
} catch (error) {
console.log("Key check failed:", error.message);
}
