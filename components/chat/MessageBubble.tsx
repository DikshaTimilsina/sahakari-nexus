import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-300"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "rounded-tr-sm bg-cyan-500/10 text-cyan-100"
            : "rounded-tl-sm bg-slate-800 text-slate-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}