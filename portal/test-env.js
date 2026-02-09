const { loadEnvConfig } = require('@next/env');
const result = loadEnvConfig(process.cwd());
console.log("Loaded files:", result.loadedEnvFiles.map(f => f.path));

console.log("API_KEY defined?", !!process.env.API_KEY);
console.log("FIREBASE_SERVICE_ACCOUNT defined?", !!process.env.FIREBASE_SERVICE_ACCOUNT);

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const { privateKey } = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log("Private key found, length:", privateKey.length);
    } catch (e) {
        console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", e.message);
    }
} else {
    console.error("No FIREBASE_SERVICE_ACCOUNT found in process.env");
}
console.log("Private key found, length:", privateKey.length);
if (privateKey.includes('\\n')) {
    console.log("Private key contains escaped newlines as expected.");
} else {
    console.log("Warning: Private key does NOT contain escaped newlines.");
}
