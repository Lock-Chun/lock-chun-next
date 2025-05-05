// src/app/components/ChatWidgetContainer.tsx
"use client";

import { useState } from "react";
import ChatInterface from "./ChatInterface"; // Import the interface component

export default function ChatWidgetContainer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        title="Open Chat"
        className={`fixed bottom-5 right-5 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-200 ${
          isOpen ? 'transform scale-0 opacity-0' : 'transform scale-100 opacity-100' // Hide button when open
        }`}
      >
        {/* Chat Icon SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.04 8.25-7.625 8.25-1.686 0-3.283-.395-4.688-1.123a.75.75 0 0 1-.358-.627V17.31c0-.411.336-.75.75-.75h.75a.75.75 0 0 0 .75-.75V14.5c0-.414.336-.75.75-.75h.75a.75.75 0 0 0 .75-.75V11.31c0-.414.336-.75.75-.75h.75a.75.75 0 0 0 .75-.75V8.312c0-.414.336-.75.75-.75h.75a.75.75 0 0 0 .75-.75V6.062c0-.414.336-.75.75-.75h.75a.75.75 0 0 1 .75.75v1.687c0 .414.336.75.75.75h.75c.414 0 .75.336.75.75v1.688c0 .414.336.75.75.75h.75c.414 0 .75.336.75.75V12Z" />
        </svg>
      </button>

      {/* Chat Widget Panel */}
      <div
        className={`fixed bottom-[85px] right-5 z-50 w-[360px] h-[500px] bg-stone-50 border border-gray-300 rounded-lg shadow-xl flex flex-col transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-4 pointer-events-none' // Hidden state
        }`}
      >
        {/* Widget Header */}
        <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-lg">
          <h3 className="font-semibold text-lg">Lock Chun Chat</h3>
          <button
            onClick={toggleChat}
            title="Close Chat"
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            {/* Close Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Interface Area */}
        <div className="flex-grow overflow-hidden"> {/* Ensure inner div scrolls, not this one */}
          {/* Render the chat interface if the widget is open */}
          {isOpen && <ChatInterface />}
        </div>
      </div>
    </>
  );
}