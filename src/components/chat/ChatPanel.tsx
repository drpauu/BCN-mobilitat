"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, ChevronDown, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Quines obres hi ha ara a l'Eixample?",
  "Com puc anar al Camp Nou dissabte?",
  "Hi ha accidents actius?",
  "Quin transport usar pel concert?",
];

interface ChatPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatPanel({ isOpen, onToggle }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hola! Soc l'assistent de mobilitat de Barcelona. Puc informar-te sobre el trànsit, obres, esdeveniments i transport públic de la ciutat. En què et puc ajudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content || data.error || "Error obtenint resposta.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error de connexió. Torna-ho a intentar." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button (visible when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className={cn(
            "fixed bottom-6 right-6 z-30",
            "w-14 h-14 rounded-2xl",
            "flex items-center justify-center",
            "shadow-2xl transition-all duration-300 hover:scale-105",
            "border border-blue-500/30"
          )}
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
            boxShadow: "0 8px 32px rgba(29, 78, 216, 0.4)",
          }}
        >
          <Bot className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-4 top-4 bottom-4 z-30",
          "flex flex-col rounded-2xl overflow-hidden",
          "transition-all duration-300 ease-out",
          isOpen
            ? "w-[360px] opacity-100 translate-x-0"
            : "w-0 opacity-0 translate-x-8 pointer-events-none"
        )}
        style={{
          background: "hsl(220 16% 11%)",
          border: "1px solid hsl(220 14% 20%)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "hsl(220 14% 20%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Assistent BCN</div>
              <div className="text-xs text-white/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                En línia · GPT-4o
              </div>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/8 transition-colors"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2 animate-fade-in",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[260px] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "rounded-tr-sm text-white"
                    : "rounded-tl-sm text-white/85"
                )}
                style={
                  msg.role === "user"
                    ? {
                        background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                        boxShadow: "0 2px 12px rgba(29,78,216,0.3)",
                      }
                    : {
                        background: "hsl(220 16% 16%)",
                        border: "1px solid hsl(220 14% 22%)",
                      }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-2 animate-fade-in">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/20 flex-shrink-0 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div
                className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1"
                style={{
                  background: "hsl(220 16% 16%)",
                  border: "1px solid hsl(220 14% 22%)",
                }}
              >
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="px-3 pb-2">
            <div className="text-xs text-white/30 px-1 mb-2">Preguntes freqüents</div>
            <div className="grid grid-cols-2 gap-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-xs px-2.5 py-2 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 hover:border-white/15 transition-all text-white/60 hover:text-white/80 leading-tight"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div
          className="p-3 border-t"
          style={{ borderColor: "hsl(220 14% 20%)" }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              background: "hsl(220 14% 16%)",
              border: "1px solid hsl(220 14% 24%)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Pregunta sobre mobilitat..."
              className="flex-1 bg-transparent text-sm text-white/85 placeholder-white/25 outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                input.trim() && !isLoading
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-white/8 text-white/25"
              )}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
