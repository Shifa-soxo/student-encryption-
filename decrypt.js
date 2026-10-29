// const crypto = require("crypto");
// const fs = require("fs");

// // Read private key
// const privateKey = fs.readFileSync("private.pem", "utf8");

// // Read encrypted data
// const data = JSON.parse(
//     fs.readFileSync("encrypted-data.json", "utf8")
// );

// // Decrypt AES key
// const aesKey = crypto.privateDecrypt(
//     {
//         key: privateKey,
//         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//         oaepHash: "sha256"
//     },
//     Buffer.from(data.encryptedKey, "base64")
// );

// // Decrypt data
// const decipher = crypto.createDecipheriv(
//     "aes-256-gcm",
//     aesKey,
//     Buffer.from(data.iv, "hex")
// );

// decipher.setAuthTag(Buffer.from(data.authTag, "hex"));

// let originalData = decipher.update(
//     data.encryptedData,
//     "hex",
//     "utf8"
// );

// originalData += decipher.final("utf8");

// // Display original data
// console.log("Original data=============================:");
// console.log(originalData);

// // Save decrypted content to a separate file
// fs.writeFileSync("decrypted-models.json", originalData);

// console.log("Decrypted data saved to decrypted-models.json");


// const { setCache, getCache } = require("./cache");
// // Example decrypted data
// const decryptedData = {
//     id: 1,
//     name: "Rahul",
//     course: "Node.js"
// };

// // Store the decrypted value
// setCache("studentData", decryptedData);

// // Retrieve the cached value

// const cachedData = getCache('decryptedStudents');

// if (cachedData !== null) {
//     console.log('Using cached decrypted data');
// } else {
//     console.log('Cache expired or data not cached');
// }
// console.log(cachedData);


const fs = require("fs");
const crypto = require("crypto");
const { setCache, getCache } = require("./cache");

const encryptedFile = "./encrypted-data.json";
const privateKeyFile = "./private.pem";
const CACHE_KEY = "decryptedStudents";

function decryptData() {
    try {
        // 1. Check cache
        const cachedData = getCache(CACHE_KEY);

        if (cachedData !== null) {
            console.log("Returning decrypted data from cache");
            return cachedData;
        }

        console.log("Cache miss. Decrypting data...");

        // 2. Check files
        if (!fs.existsSync(encryptedFile)) {
            throw new Error("encrypted-data.json not found");
        }

        if (!fs.existsSync(privateKeyFile)) {
            throw new Error("private.pem not found");
        }

        // 3. Read encrypted data and private key
        const encryptedContent = JSON.parse(
            fs.readFileSync(encryptedFile, "utf8")
        );

        const privateKey = fs.readFileSync(privateKeyFile, "utf8");

        // 4. Decrypt the AES key using RSA
        const aesKey = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256"
            },
            Buffer.from(encryptedContent.encryptedKey, "base64")
        );

        // 5. Decrypt the original data using AES-256-GCM
        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            aesKey,
            Buffer.from(encryptedContent.iv, "hex")
        );

        decipher.setAuthTag(
            Buffer.from(encryptedContent.authTag, "hex")
        );

        let originalData = decipher.update(
            encryptedContent.encryptedData,
            "hex",
            "utf8"
        );

        originalData += decipher.final("utf8");

        // 6. Convert decrypted JSON text into JavaScript data
        const decryptedData = JSON.parse(originalData);

        // 7. Save data in cache
        setCache(CACHE_KEY, decryptedData);

        // 8. Save decrypted data to a file
        fs.writeFileSync(
            "./decrypted-models.json",
            JSON.stringify(decryptedData, null, 2)
        );

        console.log("Decryption successful!");
        console.log("Data stored in cache");
        console.log("Decrypted data saved to decrypted-models.json");

        return decryptedData;

    } catch (error) {
        console.error("Decryption failed:", error.message);
        throw error;
    }
}

// Run only when executing node decrypt.js
if (require.main === module) {
    try {
        const data = decryptData();
        console.log("Decrypted data:", data);
    } catch {
        process.exitCode = 1;
    }
}

module.exports = decryptData;
