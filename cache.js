const cache = new Map();

const CACHE_DURATION = 60 * 1000; // 1 minute

// Store decrypted data in cache
function setCache(key, value) {
cache.set(key, {
value: value,
expiresAt: Date.now() + CACHE_DURATION
});

console.log("Decrypted data stored in cache");


}

// Retrieve decrypted data from cache
function getCache(key) {
const cached = cache.get(key);

if (!cached) {
    return null;
}

// Check whether the cache has expired
if (Date.now() > cached.expiresAt) {
    cache.delete(key);
    return null;
}

return cached.value;


}

// Clear cached data
function clearCache(key) {
cache.delete(key);
console.log("Cache cleared");
}

module.exports = {
setCache,
getCache,
clearCache
};
