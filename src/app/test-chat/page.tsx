// src/app/test-chat/page.tsx
"use client";

import { useState, FormEvent, ChangeEvent, useRef, useEffect } from "react";
import Navbar from "../components/navbar";
import Link from "next/link";
import ReactMarkdown, { Components } from 'react-markdown'; // <-- Import Components type

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
  isWelcomeMessage?: boolean;
}

const welcomeMessageContent = `Welcome to Lock Chun, a family-owned American-Chinese restaurant!

**Location:** 4495 Stevens Creek Blvd, Santa Clara, CA 95051
**Hours:**

  • Tue-Thu: 11:30 AM - 8:30 PM

  • Fri-Sat: 11:30 AM - 9:00 PM

  • Sun: 2:00 PM - 8:30 PM

  • Mon: Closed

**Phone for Reservations/Pickup:** (408) 249-2784

• We do not offer online ordering or delivery. 

• Please call for reservations or pickup orders. 

• Call for dietary information.

**Directions:** [Click Here for Directions on Google Maps](https://www.google.com/maps/search/?api=1&query=Lock+Chun+Chinese+Cuisine%2C+Santa+Clara+CA)

How can I help you with our menu today?`;

const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Lock+Chun+Chinese+Cuisine%2C+Santa+Clara+CA`;

// Define custom renderers for Markdown elements
const customMarkdownComponents: Components = {
  // Target the 'a' (anchor/link) tag
  a: ({ node, ...props }) => (
    <a
      {...props}
      style={{ textDecoration: 'underline', color: '#2563eb' }} // Apply inline style for underline and blue color
      target="_blank" // Ensure external links open in a new tab
      rel="noopener noreferrer" // Security best practice for target="_blank"
    />
    // Note: props already contains href and children, so we spread them
  ),
  // You can override other elements here too if needed, e.g.:
  // strong: ({node, ...props}) => <strong style={{ fontWeight: 'bold' }} {...props} />
};

export default function TestChatPage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      role: "bot",
      content: welcomeMessageContent,
      isWelcomeMessage: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- (useEffect, handleInputChange, handleSendMessage remain the same) ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch { errorData = { error: `API Error: ${response.statusText}` }; }
        throw new Error(errorData?.error || errorData?.details || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.reply) throw new Error("API response is missing the 'reply' field.");

      const botMessage: Message = { id: Date.now() + 1, role: "bot", content: data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err: unknown) {
      console.error("Failed to send message:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Failed to get response: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  // ---

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pt-[88px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}>
            <div
              // Removed prose classes as we are handling styles directly or via Markdown renderers
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow break-words ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              {/* Pass the custom components to ReactMarkdown */}
              <ReactMarkdown components={customMarkdownComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {/* Loading Indicator */}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow animate-pulse">
               Thinking...
             </div>
           </div>
         )}
        {/* Error Display */}
        {error && (
          <div className="flex justify-start">
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow">
              <p>Error: {error}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Footer remains the same, potentially removing the separate Link if you embed it above */}
       <footer className="p-4 bg-stone-100 border-t border-stone-300">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask about the menu..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading || !inputValue.trim()}>
            {isLoading ? "..." : "Send"}
          </button>
        </form>
         {/* You might remove this separate link if the embedded one above is sufficient */}
         {/* <div className="text-center text-sm">
           <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:underline">
             Get Directions on Google Maps
           </Link>
         </div> */}
      </footer>
    </div>
  );
}