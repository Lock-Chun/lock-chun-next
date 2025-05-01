// /app/api/chat/route.ts - Refactored API Handler
import { NextResponse } from "next/server";
import { redisInitializationPromise, checkRedisInitialized } from "@/lib/services/redis"; // Service status/init
import { isRelevant, isGreeting, hasKeyword } from "@/lib/chat/relevance"; // Chat logic utilities
import { buildRagChain } from "@/lib/chat/ragChain"; // RAG chain builder
import type { RunnableSequence } from "@langchain/core/runnables"; // Type for chain instance

// --- State ---
// Cache the RAG chain instance after successful initialization
let ragChainInstance: RunnableSequence | undefined;
let chainBuildError: Error | null = null;

// --- API Handler ---
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Ensure Redis is initialized (await the promise)
    // We await here to handle potential initialization errors directly
    try {
        await redisInitializationPromise;
    } catch (initError) {
         console.error("Redis initialization failed:", initError);
         return NextResponse.json(
             { error: "Chat service initialization failed. Please try again later." },
             { status: 503 } // Service Unavailable
         );
    }

    // Double-check status just in case promise resolved but connection dropped
    if (!checkRedisInitialized()) {
      console.error("POST /api/chat: Service unavailable - Redis connection check failed after init.");
      return NextResponse.json(
        { error: "Chat service is currently unavailable. Please check back soon." },
        { status: 503 }
      );
    }

    // 2. Build or get cached RAG chain *after* successful initialization
    // Include error handling for chain building itself (e.g., if getVectorStore fails somehow)
    if (!ragChainInstance && !chainBuildError) {
        try {
            console.log("Building RAG chain instance...");
            ragChainInstance = buildRagChain();
            console.log("RAG chain instance built successfully.");
        } catch (error) {
            console.error("Error building RAG chain:", error);
            chainBuildError = error instanceof Error ? error : new Error("Failed to build RAG chain");
             // Return an error if chain build fails
             return NextResponse.json(
                 { error: "Chat service configuration error. Please contact support." },
                 { status: 500 }
             );
        }
    } else if (chainBuildError) {
         // If chain building previously failed, return error immediately
         console.error("Returning error due to previous chain build failure.");
         return NextResponse.json(
                 { error: "Chat service configuration error. Please contact support." },
                 { status: 500 }
             );
    }


    // 3. Input Validation
    let message: string;
    try {
      const body = await request.json();
      message = body?.message; // Use optional chaining
      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return NextResponse.json(
          { error: "Message is required and must be a non-empty string." },
          { status: 400 } // Bad Request
        );
      }
      message = message.trim(); // Trim whitespace
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 } // Bad Request
      );
    }


    // 4. Security / Role-play Filter
    if (/impersonat|speak like|act like|role ?play|persona|ignore.*instruct|forget.*prompt/i.test(message)) {
       console.warn(`Blocked potential role-play/instruction bypass attempt: "${message}"`);
      return NextResponse.json({
        reply: "I’m sorry, I can only help with questions about Lock Chun Chinese Cuisine.",
      });
    }

    // 5. Greeting Shortcut
    // Handle messages that appear to be *only* greetings
    if (isGreeting(message) && !hasKeyword(message)) {
        console.log(`Handling simple greeting: "${message}"`);
        return NextResponse.json({
          reply: "Hello! How can I help you with Lock Chun Chinese Cuisine today?",
        });
    }


    // 6. Relevance Check (using imported function)
    const relevant = await isRelevant(message);
    if (!relevant) {
      console.log(`Blocked irrelevant question: "${message}"`);
      return NextResponse.json({
        reply: "I’m sorry, I can only help with questions about Lock Chun Chinese Cuisine.",
      });
    }

    // 7. Invoke RAG Chain (using imported & instantiated chain)
    console.log(`Processing relevant question: "${message}"`);
    // Added assertion because we check chainBuildError earlier
    const aiResponse = await ragChainInstance!.invoke(message);
    console.log(`AI response generated for: "${message}"`);
    return NextResponse.json({ reply: aiResponse });

  } catch (error: unknown) {
    // Catch any unexpected errors during request processing
    console.error("Unexpected error in /api/chat POST handler:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while processing your request." },
      { status: 500 } // Internal Server Error
    );
  }
}