// /lib/services/redis.ts
import { createClient } from 'redis';
import type { RedisClientType } from "redis"; // Import type separately
import { RedisVectorStore } from "@langchain/redis";
import { embeddings } from "./googleAI"; // Import embeddings instance
import { config } from "@/lib/config"; // Import config

// Module-level state for singleton instances and initialization status
let redisClientInstance: RedisClientType | undefined;
let vectorStoreInstance: RedisVectorStore | undefined;
let isRedisInitialized = false;
let initializationError: Error | null = null;

// Internal function to perform the actual initialization
async function initializeRedisInternal(): Promise<void> {
    // Prevent re-initialization
    if (isRedisInitialized || initializationError) return;

    console.log("Initializing Redis connection...");
    try {
        // Type assertion might be needed depending on specific redis version/types setup
        const client = createClient({ url: config.redisUrl }) as any as RedisClientType;

        client.on("error", (e) => {
            console.error("Redis Client Background Error:", e);
            // Optionally handle persistent errors, maybe set state to uninitialized
            isRedisInitialized = false;
            initializationError = e instanceof Error ? e : new Error(String(e));
        });

        await client.connect();
        console.log("Redis client connected successfully.");

        const store = new RedisVectorStore(embeddings, {
            redisClient: client,
            indexName: config.redisIndexName,
        });

        // Optional: Test connection/index viability
        console.log("Performing Redis similarity search test...");
        await store.similaritySearch("test", 1); // Simple test query
        console.log("Redis similarity search test successful.");

        // Assign instances only on success
        redisClientInstance = client;
        vectorStoreInstance = store;
        isRedisInitialized = true;
        initializationError = null; // Clear any previous error on success
        console.log("Redis initialization complete.");

    } catch (error: unknown) {
        console.error("Failed to initialize Redis:", error);
        initializationError = error instanceof Error ? error : new Error(String(error));

        // Attempt to disconnect if client was partially created and opened
        if (redisClientInstance?.isOpen) {
            try {
                await redisClientInstance.disconnect();
            } catch (disconnectError) {
                console.error("Error disconnecting Redis after initialization failure:", disconnectError);
            }
        }
        isRedisInitialized = false; // Ensure state reflects failure
        // Re-throw the error so the promise rejects
        throw error;
    }
}

// --- Exported Promise and Accessors ---

// Export a promise that resolves when initialization is complete, or rejects on error.
// This ensures initialization only runs once.
export const redisInitializationPromise: Promise<void> = initializeRedisInternal();

// Export a function to safely get the Redis client *after* initialization
export function getRedisClient(): RedisClientType {
    if (!isRedisInitialized || !redisClientInstance) {
        // Check if initialization failed
        if (initializationError) {
             throw new Error(`Redis client cannot be accessed due to initialization error: ${initializationError.message}`);
        }
        // Otherwise, it's likely accessed too early
        throw new Error("Redis client accessed before initialization completed successfully. Ensure 'redisInitializationPromise' has resolved.");
    }
    return redisClientInstance;
}

// Export a function to safely get the Vector Store *after* initialization
export function getVectorStore(): RedisVectorStore {
    if (!isRedisInitialized || !vectorStoreInstance) {
         if (initializationError) {
             throw new Error(`Redis vector store cannot be accessed due to initialization error: ${initializationError.message}`);
        }
        throw new Error("Redis vector store accessed before initialization completed successfully. Ensure 'redisInitializationPromise' has resolved.");
    }
    return vectorStoreInstance;
}

// Export a function to check the current initialization status
export function checkRedisInitialized(): boolean {
    // Check init flag, instance existence, and connection status
    return isRedisInitialized && !!redisClientInstance && redisClientInstance.isOpen;
}