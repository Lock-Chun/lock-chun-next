## 1. Introduction: The Problem & The Goal

*   **The Problem:**
    *   Generic chatbots (like ChatGPT out-of-the-box) lack specific, up-to-date knowledge about niche topics, like a local restaurant's menu or hours.
    *   Customers need quick, accurate answers about Lock Chun Cuisine (menu items, prices, hours, location, reservations).
    *   Providing this manually is time-consuming; a generic bot might give wrong or irrelevant answers ("hallucinate").
*   **The Goal:**
    *   Build an **automated, specialized chatbot** for Lock Chun Cuisine.
    *   It should **accurately** answer questions *only* within its defined scope (the restaurant).
    *   It should be **reliable** and **grounded** in the restaurant's actual data (menu, rules).
*   **Our Solution:** A chatbot backend using **Retrieval-Augmented Generation (RAG)**.

---

## 2. Core Concept: What is RAG? 

*   **LLMs are Powerful, But Limited:** Large Language Models (like Google's Gemini) are great at language but don't inherently know specific, real-time facts (like Lock Chun's current menu). Their knowledge is frozen at training time.
*   **Enter RAG (Retrieval-Augmented Generation):** A technique to make LLMs smarter using external knowledge.
    *   Think of it like an **"open-book exam"** for the LLM.
*   **How RAG Works (Simplified):**
    1.  **Retrieve:** When a user asks a question (e.g., "Do you have spring rolls?"), the system *first* searches a dedicated knowledge base (our restaurant menu data) to find the *most relevant* information.
    2.  **Augment:** It takes the relevant information found (e.g., the "Appetizers" section of the menu) and adds it ("augments") to the user's original question.
    3.  **Generate:** It sends this combined information (context + question) to the LLM (Gemini) and asks it to generate an answer *based specifically on the provided context*.
*   **Why Use RAG?**
    *   **Accuracy:** Answers are based on real, provided data, not just the LLM's internal (potentially outdated) knowledge.
    *   **Relevance:** Grounds the LLM, reducing "hallucinations" or off-topic answers.
    *   **Up-to-Date:** The knowledge base can be updated easily (e.g., update the menu file) without retraining the entire LLM.
    *   **Specificity:** Allows the chatbot to be an expert on *just* Lock Chun.

---

## 3. Our Implementation: How the Lock Chun Bot Works 

*   **Technology Stack Highlights:**
    *   **Next.js:** Web framework (to create the API endpoint).
    *   **LangChain.js:** The "Orchestrator" - connects all the pieces (LLM, database, logic). Makes building complex LLM applications easier.
    *   **Google AI:**
        *   **Gemini 1.5 Flash:** The LLM (the "brain" generating answers).
        *   **Embeddings Model:** Crucial for RAG! Converts text (menu sections, user questions) into numerical vectors that capture *semantic meaning*.
    *   **Redis:** A fast database used as a **Vector Store**. Stores the menu data embeddings for quick semantic searching.
*   **The Flow (Step-by-Step):**
    1.  **(Offline Prep):**
        *   Take `menu.json` -> Process into logical chunks (menu sections).
        *   Use Google Embeddings to create vectors for each chunk.
        *   Store text + vectors in Redis (our "knowledge base").
    2.  **(Online - User Request):**
        *   User sends a message (e.g., "What soups do you have?").
        *   **Security Check:** Basic filter for inappropriate requests.
        *   **Greeting Check:** Handle simple "Hi", "Hello".
        *   **Relevance Check (Crucial!):** Is this question *about* Lock Chun?
            *   **Step 1: Keywords:** Check for simple terms ("menu", "hours", "location"). (Fast!)
            *   **Step 2: Semantic Similarity (If no keywords):**
                *   Embed the user's question (get its meaning vector).
                *   Compare this vector to an "anchor" vector representing "Lock Chun topics" using **Cosine Similarity**. (Measures how similar the meanings are).
                *   If similarity > threshold -> Relevant! (Smarter, catches phrasing variations).
            *   If not relevant -> Respond politely that it's off-topic.
        *   **(If Relevant) Execute RAG:**
            *   Embed the user's question.
            *   Search Redis for the menu sections with the *most similar embeddings* (semantic search).
            *   **Augment:** Create a prompt for Gemini including:
                *   Instructions ("You are a Lock Chun chatbot...")
                *   Retrieved menu context.
                *   Specific rules (hours, location info - as fallback).
                *   The user's question.
            *   **Generate:** Send prompt to Gemini.
            *   Return Gemini's answer to the user.

*   **Key Role of Embeddings:** Enables searching based on *meaning*, not just keywords. Allows finding "vegetable soup" context even if the user asks "What veggie broth options are there?".