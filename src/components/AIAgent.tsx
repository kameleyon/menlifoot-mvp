import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
}

const AIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: "Hey there! 👋 I'm your soccer companion. Ask me anything about football - match predictions, player stats, transfer news, or World Cup 2026!",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Great question! Based on current form and head-to-head stats, I'd say it's going to be a close match. The home team has won 60% of their recent encounters.",
        "The World Cup 2026 is set to be historic! With 48 teams and matches across USA, Mexico, and Canada, it's going to be the biggest tournament ever.",
        "Looking at the transfer market, there are some exciting moves expected in January. Would you like me to break down the top rumored transfers?",
        "That's an interesting tactical question! Modern formations like the 3-5-2 offer great flexibility. The key is having wing-backs with exceptional stamina.",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          content: randomResponse,
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 4 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          className="h-14 w-14 rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Chat"
        >
          <MessageSquare className="h-6 w-6 text-background" />
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] glass-card overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-card p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-background" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">Soccer AI</span>
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Always ready to help</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-surface-elevated text-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-card">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about soccer..."
                  className="flex-1 bg-surface-elevated rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  variant="gold"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handleSend}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAgent;
