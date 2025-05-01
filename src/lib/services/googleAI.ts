// /lib/services/googleAI.ts
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { config } from "@/lib/config"; // Adjust path if needed (@/lib/...)

// Initialize and export the LLM instance
export const model = new ChatGoogleGenerativeAI({
    apiKey: config.googleApiKey,
    model: config.llmModel,
    // Add other parameters like temperature, topP if needed
    // temperature: 0.7,
});

// Initialize and export the Embeddings instance
export const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: config.googleApiKey,
    model: config.embeddingModel,
});

console.log(`Google AI Services Initialized (LLM: ${config.llmModel}, Embeddings: ${config.embeddingModel})`);