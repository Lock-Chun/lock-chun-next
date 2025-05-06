# Lock Chun Cuisine Chatbot

This project implements a chatbot backend for "Lock Chun Chinese Cuisine" using a Next.js API route. It leverages Retrieval-Augmented Generation (RAG) with LangChain.js, Google Generative AI (Gemini and Embeddings), and Redis as a vector store to answer user questions specifically about the restaurant's menu, hours, location, ordering, and reservations.

## Features

*   **Restaurant-Specific:** Answers questions only within the scope of Lock Chun Chinese Cuisine.
*   **Contextual Answers (RAG):** Retrieves relevant menu sections from a vector database (Redis) to provide accurate, grounded answers about menu items and prices.
*   **Relevance Gate:** Filters out off-topic questions using a multi-layered approach (greetings, keywords, semantic similarity with cosine distance).
*   **Specific Rules Handling:** Provides exact, pre-defined answers for common queries like hours, location, reservation policy, and ordering details when not directly found in the menu context.
*   **Greeting Support:** Recognizes and responds to common greetings.
*   **Basic Security Filter:** Attempts to block requests asking the bot to act outside its defined role or ignore instructions.
*   **Data Population Script:** Includes a script to process a `menu.json` file, generate embeddings, and populate the Redis vector store.

## Technology Stack

*   **Framework:** Next.js (for the API route)
*   **Language:** TypeScript
*   **Orchestration:** LangChain.js (`@langchain/core`, `@langchain/google-genai`, `@langchain/redis`)
*   **LLM:** Google Generative AI (Gemini 1.5 Flash via `ChatGoogleGenerativeAI`)
*   **Embeddings:** Google Generative AI (`text-embedding-004` via `GoogleGenerativeAIEmbeddings`)
*   **Vector Store:** Redis (via `@langchain/redis` and `redis` client)
*   **Environment Variables:** `dotenv`
*   **Runtime:** Node.js (for the population script and Next.js backend)

## How It Works & Design Decisions

This project follows a Retrieval-Augmented Generation (RAG) pattern to create a knowledgeable and focused chatbot. The process involves an offline data preparation step and an online request handling step.

### Visual Overview

**(Diagram 1: High-Level Technology Interaction)**

```mermaid
graph TD
    subgraph "Setup / Data Population (populate-redis.ts)"
        direction LR
        Dev[Developer] --> Script["Node.js Script<br>(populate-redis.ts)"];
        Script -- Reads --> MenuJSON[menu.json];
        Script -- Uses --> LCEmbedPopulate["LangChain:<br>GoogleEmbeddings"];
        LCEmbedPopulate -- Embeds --> GoogleAIEmbed1["Google AI API<br>(Embeddings)"];
        Script -- Uses --> RedisClientPopulate["Redis Client"];
        RedisClientPopulate -- Writes Index --> Redis["Redis Database<br>(Vector Store)"];
        LCEmbedPopulate -- Data+Embeddings --> RedisClientPopulate;
    end

    subgraph "Chat Request Handling (/api/chat/route.ts)"
        User["End User"] --> Browser["Browser/Client App"];
        Browser -- POST /api/chat --> NextAPI["Next.js API Route"];

        NextAPI -- Initializes/Checks --> RedisClientAPI["Redis Client"];
        RedisClientAPI -- Checks Status --> Redis;

        %% Relevance & RAG
        NextAPI -- Uses --> LCRelevance["LangChain:<br>Relevance Logic"];
        LCRelevance -- Needs Embedding --> LCEmbedAPI["LangChain:<br>GoogleEmbeddings"];
        LCEmbedAPI -- Embeds Query --> GoogleAIEmbed2["Google AI API<br>(Embeddings)"];

        NextAPI -- Uses --> LCRAG["LangChain:<br>RAG Chain"];
        LCRAG -- Retrieves --> LCRedisStore["LangChain:<br>RedisVectorStore"];
        LCRedisStore -- Reads Index --> Redis;
        LCRAG -- Formats Prompt --> LCPrompt["LangChain:<br>ChatPromptTemplate"];
        LCRAG -- Invokes LLM --> LCModel["LangChain:<br>ChatGoogleGenerativeAI"];
        LCModel -- Sends Prompt --> GoogleAILLM["Google AI API<br>(Gemini Model)"];
        GoogleAILLM -- Receives Response --> LCModel;
        LCModel -- Parses --> LCParser["LangChain:<br>StringOutputParser"];

        %% Response Path
        LCParser -- Reply --> NextAPI;
        NextAPI -- Reply JSON --> Browser;
        Browser --> User;

        %% External Services Linkage
        RedisClientAPI --> Redis;
    end

    %% Style Key Technologies - Styling uses node IDs, which remain the same
    style Redis fill:#f96,stroke:#333,stroke-width:2px;
    style GoogleAIEmbed1 fill:#ccf,stroke:#333,stroke-width:2px;
    style GoogleAIEmbed2 fill:#ccf,stroke:#333,stroke-width:2px;
    style GoogleAILLM fill:#ccf,stroke:#333,stroke-width:2px;
    style NextAPI fill:#f9f,stroke:#333,stroke-width:2px;
    style Script fill:#9cf,stroke:#333,stroke-width:2px;
    style RedisClientPopulate fill:#f96,stroke:#333,stroke-width:1px; %% Added style for clarity
    style RedisClientAPI fill:#f96,stroke:#333,stroke-width:1px; %% Added style for clarity
```

### 1. Data Preparation (Offline Process - `scripts/populate-redis.ts`)

*   **Input:** Reads structured data from `public/menu.json`.
*   **Processing:**
    *   Formats items within each menu *section* into a single text block. Grouping by section provides coherent chunks of context.
    *   Each section becomes a LangChain `Document`.
*   **Embedding:** Converts each document's text into a numerical vector using Google's `text-embedding-004` model. (See "Role of Embeddings" below).
*   **Storage:** Stores the text, metadata, and corresponding vector for each document in a Redis vector index using `RedisVectorStore.fromDocuments`.
*   **Why this approach?** Storing embeddings of menu sections allows the bot to retrieve the most relevant part of the menu based on semantic meaning.

### 2. Chat Request Handling (Online Process - `/app/api/chat/route.ts`)

**(Diagram 2: Detailed API Route Flow)**

```mermaid
flowchart TD
    A["User Sends Message via Client"] --> B{POST /api/chat};

    subgraph "Next.js API Route Handler"
        B --> C{Await Redis Init?};
        C -- Initialized --> D{Validate Request Body?};
        C -- Not Initialized --> C_Fail["Return 503 Service Unavailable"];

        D -- Valid --> E{Security/Role-Play Filter?};
        D -- Invalid --> D_Fail["Return 400 Bad Request"];

        E -- Pass --> F{Is Greeting?};
        E -- Block --> E_Fail["Return Refusal: Security"];
        %% Node E_Fail defines the refusal message for security blocks

        F -- Yes --> F_Success["Return Canned Greeting"];
        F -- No --> G{Relevance Check};

        subgraph "Relevance Check Logic"
            G -- Check --> G1["Has Keywords?"];
            G1 -- Yes --> H["Relevant"];
            G1 -- No --> G2["Get Query Embedding"];
            G2 --> G3["Google AI Embeddings API"];
            G3 --> G4["Calculate Similarity"];
            G4 -- Score > Threshold --> H;
            G4 -- Score <= Threshold --> G_Fail["Not Relevant"];
        end

        G_Fail --> I_Fail["Return Refusal: Irrelevant"];
        %% Node I_Fail defines the refusal message for irrelevance

        H --> J{Execute RAG Chain};

        subgraph "RAG Chain Execution"
            J --> J1["Retrieve Context: k=12"];
            J1 -- Query --> J2["RedisVectorStore"];
            J2 -- Search Index --> J3[(Redis)];
            J3 -- Return Docs --> J2;
            J2 -- Return Docs --> J4["Format Docs as String"];
            J4 --> J5["Build Prompt: Template + Context + Question"];
            J5 -- Prompt --> J6["Invoke LLM: Gemini"];
            J6 --> J7["Google AI Gemini API"];
            J7 -- Response --> J6;
            J6 -- Raw Response --> J8["Parse Output: String"];
        end

        J8 -- Parsed Reply --> K_Success["Return AI Reply"];
    end

    %% Connect Final Outputs back to Client
    C_Fail --> L["Client Receives Response"];
    D_Fail --> L;
    E_Fail --> L;
    F_Success --> L;
    I_Fail --> L;
    K_Success --> L;
    L --> M["User Sees Reply"];

    %% Style Key Components
    style J3 fill:#f96,stroke:#333,stroke-width:2px; %% Redis DB
    style G3 fill:#ccf,stroke:#333,stroke-width:2px; %% Google Embeddings
    style J7 fill:#ccf,stroke:#333,stroke-width:2px; %% Google Gemini
    style B fill:#f9f,stroke:#333,stroke-width:2px;  %% API Route Entry
```

**Flow Steps:**

1.  **Initialization & Validation:** Check Redis readiness and validate input.
2.  **Security/Role-Play Filter:** Block attempts to manipulate the bot's persona.
3.  **Greeting Shortcut:** Handle simple greetings efficiently.
4.  **Relevance Gate:**
    *   **Keyword Check:** First, quickly check if the user's message contains any predefined keywords (e.g., "menu", "hours", "location"). This is a fast initial filter.
    *   **Semantic Similarity Check (if no keywords):** If no keywords are found, use a more nuanced semantic check:
        *   Embed the user's query using the Google embedding model (`text-embedding-004`).
        *   Embed a pre-defined **"anchor phrase"** (from `config.relevanceAnchorPhrase`) that represents the core scope of the chatbot (e.g., "Information about Lock Chun Chinese Cuisine restaurant including menu, food, hours, location, address, reservations, and ordering").
        *   Calculate the **cosine similarity** between the user's query vector and the anchor phrase vector. This score measures how closely related the meanings of the two texts are.
        *   Compare the calculated similarity score against a configurable **threshold** (`config.relevanceThreshold`).
        *   If the score is above the threshold, the query is considered semantically relevant even without exact keywords.
    *   Refuse if irrelevant (neither keywords nor sufficient semantic similarity).
5.  **RAG Execution (if relevant):**
    *   **Retrieve:** Use query embedding to find the top `k` similar menu sections from Redis (vector search).
    *   **Augment:** Format retrieved text and inject it (`{context}`) along with the user's query (`{question}`) into the system prompt (`ragPromptTemplate`). The prompt guides the LLM and includes fallback rules.
    *   **Generate:** Send the augmented prompt to the Gemini LLM.
    *   **Parse:** Extract the text response.
6.  **Response:** Send the final reply (AI-generated or pre-canned refusal/greeting) to the user.

### Role of Embeddings (Google `text-embedding-004`)

Embeddings are numerical representations (vectors) of text that capture semantic meaning. Texts with similar meanings have vectors that are "close" together mathematically. Google's `text-embedding-004` model creates these vectors. They are critical for:

1.  **Semantic Storage (in `populate-redis.ts`):**
    *   Each menu section's text is converted into a vector and stored in Redis. This allows searching based on meaning, not just exact words.
2.  **Semantic Relevance Check (in `api/chat`):**
    *   The user's query is embedded.
    *   This query vector is compared to the vector of a pre-defined **"anchor phrase"** representing the bot's intended scope (e.g., "Information about Lock Chun Chinese Cuisine restaurant...").
    *   The comparison is done using **cosine similarity**, which calculates the angle between the two vectors in high-dimensional space. A score close to 1 indicates high semantic similarity.
    *   If the similarity score exceeds a defined threshold (`config.relevanceThreshold`), the query is deemed relevant, even if it doesn't contain specific keywords.
3.  **Semantic Retrieval for RAG (in `api/chat`):**
    *   The user's query embedding is used to search Redis.
    *   Redis finds the stored menu sections whose vectors are most similar (closest, typically using cosine similarity search) to the query vector.
    *   This ensures the most relevant menu context is retrieved to help the LLM answer accurately.

### Why RAG?

LLMs like Gemini lack specific, up-to-date knowledge (like Lock Chun's menu). RAG overcomes this:

1.  **Retrieves** relevant facts (menu sections) from an external source (Redis).
2.  **Augments** the LLM's prompt with these facts.
3.  **Generates** an answer grounded in the provided facts.

This dramatically increases accuracy and relevance for domain-specific chatbots.

### Why LangChain?

LangChain.js acts as an orchestration framework:

*   **Abstraction:** Provides standard interfaces for LLMs, Embeddings, Vector Stores, Prompts, Parsers.
*   **Composability:** `RunnableSequence` chains components together logically (Retrieve -> Format -> Prompt -> LLM -> Parse), making the RAG flow manageable and readable.
*   **Integrations:** Offers pre-built connections to services like Google AI and Redis.
*   **Helpers:** Provides utility functions (`formatDocumentsAsString`).

It provides the structure to build applications *around* LLMs efficiently.

### Why Redis as a Vector Store?

*   **Performance:** Fast in-memory operations speed up vector similarity searches.
*   **Persistence:** Data (embeddings, text) survives application restarts.
*   **Vector Search:** RediSearch module provides necessary vector indexing and search capabilities.
*   **Mature & Scalable:** Well-supported and scalable database.
*   **LangChain Integration:** Dedicated `@langchain/redis` package.