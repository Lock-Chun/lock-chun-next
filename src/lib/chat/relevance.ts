// /lib/chat/relevance.ts (or your actual file path)

import { embeddings } from "@/lib/services/googleAI"; // Ensure this path is correct
import { config } from "@/lib/config"; // Ensure this path is correct

// Define keywords for quick relevance check
const KEY_TERMS = [
  "menu", "price", "prices", "dish", "dishes", "special", "kung pao",
  "chicken", "beef", "shrimp", "soup", "hours", "time", "open", "close",
  "reservation", "reserve", "pickup", "order", "phone", "location", "located",
  "address", "directions", "lunch", "family", "dinner",
  "food",
  // Add any other terms specific to your restaurant/menu context if needed
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
  console.log(`[hasKeyword] Checking query: "${lowerQuery}"`); // Debug log
  const found = KEY_TERMS.some((term) => {
    const includes = lowerQuery.includes(term);
    // Log only if a keyword *is* found to avoid excessive logging
    if (includes) {
        console.log(`[hasKeyword] Found keyword "${term}" in "${lowerQuery}"`); // Debug log
    }
    return includes;
  });
  console.log(`[hasKeyword] Result for "${lowerQuery}": ${found}`); // Debug log
  return found;
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
  console.log(`[isRelevant] Checking relevance for: "${question}"`); // Debug log

  // 1. Keyword Check (Fastest)
  if (hasKeyword(question)) {
    console.log(`[isRelevant] Keyword found via hasKeyword for "${question}". Returning true.`); // Debug log
    return true;
  }
  console.log(`[isRelevant] No keyword found in "${question}". Proceeding to semantic check.`); // Debug log

  // 2. Semantic Similarity Check (Slower, uses API)
  try {
    console.log(`[isRelevant] Performing semantic embedding for "${question}" and anchor phrase.`); // Debug log
    // Embed the question and the anchor phrase
    const questionVector = await embeddings.embedQuery(question);
    const anchorVector = await embeddings.embedQuery(config.relevanceAnchorPhrase);
    console.log(`[isRelevant] Embeddings obtained. Calculating similarity.`); // Debug log

    // --- Basic Cosine Similarity Calculation ---
    let dotProduct = 0;
    let questionMagnitude = 0;
    let anchorMagnitude = 0;
    // Use full vector length assuming embeddings model returns consistent length
    const vectorLength = questionVector.length;
    if (vectorLength !== anchorVector.length) {
        console.warn(`[isRelevant] Warning: Mismatched vector lengths! Question: ${vectorLength}, Anchor: ${anchorVector.length}`);
        // Handle mismatch - perhaps return false or use Math.min as before
        return false; // Safer to return false on mismatch
    }

    for (let i = 0; i < vectorLength; i++) {
      // Check for undefined/null just in case, though less likely with consistent model
      if (anchorVector[i] == null || questionVector[i] == null) {
          console.warn(`[isRelevant] Warning: Found null/undefined value at index ${i} in vectors.`);
          continue; // Skip this dimension
      }
      dotProduct += questionVector[i] * anchorVector[i];
      questionMagnitude += questionVector[i] * questionVector[i];
      anchorMagnitude += anchorVector[i] * anchorVector[i];
    }

    questionMagnitude = Math.sqrt(questionMagnitude);
    anchorMagnitude = Math.sqrt(anchorMagnitude);

    // Avoid division by zero
    if (questionMagnitude === 0 || anchorMagnitude === 0) {
        console.warn(`[isRelevant] Warning: Zero magnitude vector encountered in relevance check for question: "${question}"`);
        return false;
    }

    const similarity = dotProduct / (questionMagnitude * anchorMagnitude);

    // Check against the threshold from config
    const isSemanticallyRelevant = similarity > config.relevanceThreshold;

    console.log(`[isRelevant] Semantic similarity for "${question}": ${similarity.toFixed(4)}. Threshold: ${config.relevanceThreshold}. Relevant: ${isSemanticallyRelevant}`); // Debug log

    return isSemanticallyRelevant;

  } catch (error: unknown) {
      // Log the specific error
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[isRelevant] Error during relevance embedding/calculation for question "${question}":`, errorMessage, error);
      return false; // Return false on error
  }
}