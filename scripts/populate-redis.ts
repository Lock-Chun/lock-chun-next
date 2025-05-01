// scripts/populate-redis.ts
import * as fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createClient } from "redis"; // Import the function normally
import type { RedisClientType } from "redis"; // Import the type specifically for type checking
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RedisVectorStore } from "@langchain/redis";

// --- Interfaces ---
interface MenuItem {
    name: string;
    price?: number;
    prices?: Record<string, number>;
    quantity?: number | string;
    spicy?: boolean;
    details?: string;
}

// --- New Interface for Family Dinners ---
interface FamilyDinnerItem {
    name: string;
    price_per_person: number;
    minimum_persons: number;
    substitutions_allowed: boolean;
    description: string;
    base_items: string[];
    additions_by_person: Record<string, string>; // Keys are "3", "4", etc.
}

// --- Updated MenuData Type ---
// Allows sections to be either MenuItem[] or FamilyDinnerItem[]
type MenuSection = MenuItem[] | FamilyDinnerItem[];
type MenuData = Record<string, MenuSection>;

// --- Configuration & Paths ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MENU_FILE = path.join(process.cwd(), "public", "menu.json");
const INDEX_NAME = "lockchun-menu-index";
const EMBEDDING_MODEL = "text-embedding-004";
const REDIS_URL = process.env.REDIS_URL;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// --- Type Guard ---
// Checks if an item is a FamilyDinnerItem based on unique properties
function isFamilyDinnerItem(item: any): item is FamilyDinnerItem {
    return typeof item === 'object' && item !== null && 'price_per_person' in item && 'base_items' in item && 'additions_by_person' in item;
}

// --- Helper Functions ---

/** Formats price object (Small/Medium/Large) */
function formatPrices(prices: Record<string, number>): string {
    return Object.entries(prices)
        .map(([key, value]) => {
            let sizeLabel = key;
            if (key.length === 1) {
                switch (key.toUpperCase()) {
                    case "S": sizeLabel = "Small"; break;
                    case "M": sizeLabel = "Medium"; break;
                    case "L": sizeLabel = "Large"; break;
                }
            }
            return `${sizeLabel} $${value.toFixed(2)}`;
        })
        .join(" | ");
}

/** Formats a standard menu item line */
function formatMenuItemLine(item: MenuItem): string {
    const priceString = item.price
        ? `$${item.price.toFixed(2)}`
        : item.prices
        ? formatPrices(item.prices)
        : "";
    const quantityString = item.quantity ? ` (${item.quantity}${typeof item.quantity === 'number' ? ' pcs' : ''})` : "";
    const spicyMarker = item.spicy ? " 🔥 spicy" : "";
    const detailsString = item.details ? ` – ${item.details}` : "";

    return `• ${item.name} — ${priceString}${quantityString}${detailsString}${spicyMarker}`.replace(/\s+—\s+$/, '').trim();
}

/** --- New Function to Format Family Dinners --- */
function formatFamilyDinner(dinner: FamilyDinnerItem): string {
    const baseItemsFormatted = dinner.base_items.map(item => `  • ${item}`).join("\n");
    const additionsFormatted = Object.entries(dinner.additions_by_person)
        .map(([persons, dish]) => `  For ${persons} persons we add: ${dish}`)
        .join("\n");

    return `
${dinner.name}: $${dinner.price_per_person.toFixed(2)} Per Person
- Minimum ${dinner.minimum_persons} persons. ${dinner.description}
- Includes the following base items:
${baseItemsFormatted}
- Additional items based on group size:
${additionsFormatted}
`.trim(); // trim() removes leading/trailing whitespace from the template literal
}

// --- Main Script Logic ---

async function runPopulationScript() {
    console.log("🚀 Starting Redis population script...");

    if (!GOOGLE_API_KEY || !REDIS_URL) {
        throw new Error("❌ GOOGLE_API_KEY and REDIS_URL must be set in .env.local");
    }
    console.log("✅ Environment variables loaded.");

    let redisClient: RedisClientType | undefined;

    try {
        console.log(`📄 Reading menu data from: ${MENU_FILE}`);
        const fileContent = await fs.readFile(MENU_FILE, "utf8");
        // Explicitly cast to the new MenuData type
        const menuData = JSON.parse(fileContent) as MenuData;
        console.log("✅ Menu data parsed successfully.");

        // --- Updated Document Building ---
        const documents: Document[] = [];
        for (const [section, items] of Object.entries(menuData)) {
            let pageContent = `${section}\n`; // Start with section title

            if (section === "Family Dinners") {
                // Handle Family Dinners section specifically
                const dinnerLines = items
                    .filter(isFamilyDinnerItem) // Use type guard
                    .map(formatFamilyDinner) // Use the new formatting function
                    .join("\n\n"); // Add extra newline between dinners
                pageContent += dinnerLines;
            } else {
                // Handle regular menu sections
                const itemLines = items
                    .filter((item): item is MenuItem => !isFamilyDinnerItem(item)) // Ensure these are MenuItems
                    .map(formatMenuItemLine) // Use the existing formatting function
                    .join("\n");
                pageContent += itemLines;
            }

            documents.push(new Document({
                pageContent: pageContent.trim(), // Trim final content
                metadata: { section },
            }));
        }

        console.log(`📝 Built ${documents.length} documents from menu sections.`);
        // Log a sample, maybe specifically the Family Dinner one if found
        const familyDinnerDoc = documents.find(doc => doc.metadata.section === "Family Dinners");
        if (familyDinnerDoc) {
            console.log("👀 Sample Family Dinner document content:\n---\n", familyDinnerDoc.pageContent, "\n---");
        } else if (documents.length > 0) {
             console.log("👀 Sample document content (first section):\n---\n", documents[0].pageContent.substring(0, 300) + "...\n---");
        }

        // --- Services Initialization & Indexing (remains the same) ---
        console.log("✨ Initializing Google Embeddings...");
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: GOOGLE_API_KEY,
            model: EMBEDDING_MODEL,
        });
        console.log(`✨ Initializing Redis connection to ${REDIS_URL}...`);
        redisClient = createClient({ url: REDIS_URL }) as any as RedisClientType;
        redisClient.on('error', (err: Error) => console.error('❌ Redis Client Error:', err));
        await redisClient.connect();
        console.log("✅ Redis client connected successfully.");

        console.log(`🧹 Attempting to drop existing Redis index: ${INDEX_NAME}...`);
        try {
            await redisClient.ft.dropIndex(INDEX_NAME, { DD: true });
            console.log(`👍 Index ${INDEX_NAME} dropped.`);
        } catch (e: unknown) {
            if (e instanceof Error && e.message.includes("Unknown Index name")) {
                console.log(`ℹ️ Index ${INDEX_NAME} does not exist.`);
            } else {
                console.error("❌ Unexpected error dropping index:", e);
                throw e;
            }
        }

        console.log(`✍️ Populating Redis index ${INDEX_NAME} with ${documents.length} documents...`);
        await RedisVectorStore.fromDocuments(documents, embeddings, {
            redisClient: redisClient,
            indexName: INDEX_NAME,
        });
        console.log(`✅ Index ${INDEX_NAME} populated successfully.`);

        // --- Smoke Test (remains the same) ---
        console.log("💨 Performing similarity search smoke test...");
        const vectorStore = new RedisVectorStore(embeddings, {
            redisClient: redisClient,
            indexName: INDEX_NAME
        });
        const testQuery = "Family Dinner B"; // Update test query if desired
        const results = await vectorStore.similaritySearch(testQuery, 1);

        if (results.length > 0) {
            const [hit] = results;
            console.log(`   Query: "${testQuery}"`);
            console.log(`   Top result metadata:`, hit.metadata);
            console.log(`   Top result content snippet:\n---\n`, hit.pageContent.substring(0, 300) + "...", "\n---");
        } else {
            console.warn(`⚠️ Smoke test query "${testQuery}" returned no results.`);
        }

        console.log("🎉 Script finished successfully!");

    } catch (error: unknown) {
        console.error("❌ Script failed during execution:", error);
        throw error;
    } finally {
        if (redisClient?.isOpen) {
            console.log("🔌 Disconnecting Redis client...");
            await redisClient.disconnect();
            console.log("✅ Redis client disconnected.");
        } else if (redisClient) {
            console.log("ℹ️ Redis client was initialized but not connected or already closed.");
        } else {
            console.log("ℹ️ Redis client was not initialized (likely due to early error).");
        }
    }
}

// Execute the script
(async () => {
    try {
        await runPopulationScript();
        process.exit(0);
    } catch (e) {
        console.error("💥 Exiting script due to error:", e instanceof Error ? e.message : e);
        process.exit(1);
    }
})();