// /lib/chat/ragChain.ts
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { model } from "@/lib/services/googleAI"; // Import LLM model
import { getVectorStore } from "@/lib/services/redis"; // Import function to get vector store
import { ragPromptTemplate } from "./prompts"; // Import the prompt template
import { config } from "@/lib/config"; // Import config for retriever K value

// Function to build the LangChain RAG RunnableSequence
export function buildRagChain() {
    // Ensure Vector Store is initialized before getting retriever
    // Note: getVectorStore() will throw an error if Redis isn't ready
    const vectorStore = getVectorStore();
    const retriever = vectorStore.asRetriever({
        k: config.retrieverK, // Use K value from config
        // Add other retriever options if needed (e.g., search type)
        // searchType: "similarity" | "mmr",
    });

    console.log(`RAG Chain configured with retriever k=${config.retrieverK}`);

    // Define the sequence of operations for the RAG chain
    const chain = RunnableSequence.from([
        {
            // Step 1: Retrieve context based on the question
            // The retriever uses the input (question) to find relevant documents
            // formatDocumentsAsString then joins their pageContent
            context: retriever.pipe(formatDocumentsAsString),
            // Step 2: Pass the original question through unchanged
            question: new RunnablePassthrough(),
        },
        // Step 3: Inject context and question into the prompt template
        ragPromptTemplate,
        // Step 4: Send the formatted prompt to the LLM
        model,
        // Step 5: Parse the LLM's response as a string
        new StringOutputParser(),
    ]);

    return chain;
}

// Optional: Initialize the chain once globally if desired,
// but ensure it only happens *after* Redis is confirmed ready.
// let ragChainInstance: ReturnType<typeof buildRagChain> | undefined;
// export function getRagChain(): ReturnType<typeof buildRagChain> {
//     if (!ragChainInstance) {
//         ragChainInstance = buildRagChain();
//     }
//     return ragChainInstance;
// }