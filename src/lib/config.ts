// /lib/config.ts
import dotenv from "dotenv";
import path from "path";

// Load .env.local located in the parent directory (project root)
// Ensure this runs early, potentially adjust path if needed
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Define and export configuration constants
export const config = {
    googleApiKey: process.env.GOOGLE_API_KEY,
    redisUrl: process.env.REDIS_URL,
    redisIndexName: "lockchun-menu-index",
    llmModel: "gemini-1.5-flash",
    embeddingModel: "text-embedding-004",
    relevanceThreshold: 0.4,
    retrieverK: 14, // Increased K value
    // Anchor phrase for relevance checking
    relevanceAnchorPhrase: "Lock Chun Chinese Cuisine food dishes prices hours location ordering reservations menu items restaurant greetings lunch specials family dinners"
} as const; // Using 'as const' for stricter type inference

// --- Runtime Validation ---
// Ensure critical environment variables are loaded
if (!config.googleApiKey) {
    console.error("FATAL ERROR: GOOGLE_API_KEY environment variable is not set.");
    throw new Error("GOOGLE_API_KEY missing");
}
if (!config.redisUrl) {
    console.error("FATAL ERROR: REDIS_URL environment variable is not set.");
    throw new Error("REDIS_URL missing");
}

console.log("Configuration loaded successfully.");

// Optionally export individual values if preferred for cleaner imports elsewhere
// export const GOOGLE_API_KEY = config.googleApiKey;
// export const REDIS_URL = config.redisUrl;
// export const REDIS_INDEX_NAME = config.redisIndexName;