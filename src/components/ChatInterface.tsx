import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onConceptGenerated: (concept: string) => void;
}

const ChatInterface = ({ onConceptGenerated }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: "Hello, I'm Paul Cameron — it's lovely to meet you.",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "system",
      content: "Tell me, what would you love to create amongst your trees or garden?",
      timestamp: new Date(),
    },
    {
      id: "3",
      role: "system",
      content: "Share as much or as little as you like — a few words, or a voice note.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsProcessing(true);

    try {
      // Call backend API to generate concept with Notion integration
      const response = await fetch('http://localhost:3001/api/concept/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput,
          messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate concept');
      }

      const data = await response.json();

      if (data.success) {
        setIsProcessing(false);
        onConceptGenerated(data.concept);

        // Optionally show sources used
        if (data.sources && data.sources.length > 0) {
          console.log('Sources used:', data.sources);
        }
      } else {
        throw new Error(data.error || 'Failed to generate concept');
      }
    } catch (error) {
      console.error('Error generating concept:', error);

      // Fallback to simple response if backend is unavailable
      const fallbackConcept = `Based on your wish for "${userInput}", I envision a beautiful space that combines natural elegance with thoughtful design. This concept embraces the harmony between your dreams and the environment around you.`;

      setIsProcessing(false);
      onConceptGenerated(fallbackConcept);

      toast({
        title: "Limited functionality",
        description: "Using basic concept generation. Connect Notion API for enhanced responses.",
        variant: "default",
      });
    }
  };

  const handleVoiceNote = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice note recorded",
        description: "Processing your message...",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak your wishes...",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-6 py-4 shadow-lg ${
                message.role === "user"
                  ? "bg-forest-green text-white"
                  : message.role === "assistant"
                  ? "bg-card text-card-foreground"
                  : "bg-soft-sage text-foreground"
              }`}
            >
              <p className="font-sans text-base leading-relaxed">{message.content}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-center items-center space-x-2 text-muted-foreground animate-fade-in">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-sans text-sm">Listening to your wishes and shaping them into a concept...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Share your wishes here..."
            className="resize-none font-sans rounded-2xl border-border focus:ring-forest-green"
            rows={3}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleVoiceNote}
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className="rounded-full"
            >
              <Mic className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""}`} />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isProcessing}
              size="icon"
              className="rounded-full bg-forest-green hover:bg-forest-green/90"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
