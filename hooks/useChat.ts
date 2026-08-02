"use client";

import { useState, useCallback } from "react";
import { getMockReply } from "@/lib/mockChat";
import type { ChatMessage } from "@/types/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const sendMessage = useCallback((content: string) => {
    const trimmed = content.trim();
    if (trimmed.length === 0) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // setTimeout simulates network + AI "thinking" delay.
    // In Phase 10 this becomes a real Axios call, and isTyping will flip
    // to false inside a .then()/.finally() instead of a timer.
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: getMockReply(trimmed),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  }, []);

  return { messages, isTyping, sendMessage };
}