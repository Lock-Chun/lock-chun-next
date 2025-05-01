// /lib/chat/relevance.ts
import { embeddings } from "@/lib/services/googleAI"; // Import embeddings instance
import { config } from "@/lib/config"; // Import config

// Define keywords for quick relevance check
const KEY_TERMS = [
  "menu", "price", "prices", "dish", "dishes", "special", "kung pao",
  "chicken", "beef", "shrimp", "soup", "hours", "time", "open", "close",
  "reservation", "reserve", "pickup", "order", "phone", "location",
  "address", "directions", "lunch", "family", "dinner",
];

// Define terms indicating a greeting
const GREETING_TERMS = [
  "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
];

/**
 * Checks if the query contains any predefined relevant keywords.
 * Case-insensitive.
 */
export function hasKeyword(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return KEY_TERMS.some((term) => lowerQuery.includes(term));
}

/**
 * Checks if the query starts with a common greeting.
 * Case-insensitive and trims whitespace.
 */
export function isGreeting(query: string): boolean {
  const lowerQuery = query.toLowerCase().trim();
  // Check if the query *starts with* any greeting term, possibly followed by punctuation or space
  return GREETING_TERMS.some((greeting) =>
    lowerQuery.startsWith(greeting + " ") ||
    lowerQuery.startsWith(greeting + "!") ||
    lowerQuery.startsWith(greeting + "?") ||
    lowerQuery.startsWith(greeting + ",") ||
    lowerQuery === greeting
  );
}

/**
 * Determines if a question is relevant to the chatbot's scope.
 * First checks for keywords, then falls back to semantic similarity.
 */
export async function isRelevant(question: string): Promise<boolean> {
  // 1. Keyword Check (Fastest)
  if (hasKeyword(question)) {
    return true;
  }

  // 2. Semantic Similarity Check (Slower, uses API)
  try {
    // Embed the question and the anchor phrase
    const questionVector = await embeddings.embedQuery(question);
    const anchorVector = await embeddings.embedQuery(config.relevanceAnchorPhrase);

    // --- Basic Cosine Similarity Calculation ---
    let dotProduct = 0;
    let questionMagnitude = 0;
    let anchorMagnitude = 0;
    const minLength = Math.min(questionVector.length, anchorVector.length); // Ensure vectors are comparable

    for (let i = 0; i < minLength; i++) {
      // Added check for undefined, although same model should yield same length
      if (anchorVector[i] === undefined || questionVector[i] === undefined) continue;
      dotProduct += questionVector[i] * anchorVector[i];
      questionMagnitude += questionVector[i] * questionVector[i];
      anchorMagnitude += anchorVector[i] * anchorVector[i];
    }

    questionMagnitude = Math.sqrt(questionMagnitude);
    anchorMagnitude = Math.sqrt(anchorMagnitude);

    // Avoid division by zero if a vector has zero magnitude (e.g., empty string embedded)
    if (questionMagnitude === 0 || anchorMagnitude === 0) {
        console.warn(`Warning: Zero magnitude vector encountered in relevance check for question: "${question}"`);
        return false;
    }

    const similarity = dotProduct / (questionMagnitude * anchorMagnitude);

    // console.log(`Relevance score for "${question}": ${similarity.toFixed(3)}`); // Debugging

    // Check against the threshold from config
    return similarity > config.relevanceThreshold;

  } catch (error: unknown) {
      // Log error during embedding or calculation
      console.error(`Error during relevance embedding/calculation for question "${question}":`, error);
      // Default to not relevant if embedding or calculation fails
      return false;
  }
}