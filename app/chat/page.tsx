"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { suggestedQuestions } from "@/lib/mockChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { SuggestedQuestions } from "@/components/chat/SuggestedQuestions";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

export default function ChatPage() {
  const { messages, isTyping, sendMessage } = useChat();
  const [input, setInput] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scrolls to the newest message any time the list grows or typing starts.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  }

  return (
    <main className="flex h-screen flex-col bg-slate-950">
      <div className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold text-white">
          Ask Sahakari Nexus
        </h1>
        <p className="text-xs text-slate-400">
          Ask questions about cooperative risk, membership, and performance.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <SuggestedQuestions
            questions={suggestedQuestions}
            onSelect={(question) => sendMessage(question)}
          />
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-slate-800 px-6 py-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about risk, membership, reserves..."
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={input.trim().length === 0}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 transition-opacity disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </main>
  );
}