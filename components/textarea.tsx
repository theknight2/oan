import { modelID } from "@/ai/providers";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { ArrowUp, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface InputProps {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  status: string;
  stop: () => void;
  selectedModel: modelID;
  setSelectedModel: (model: modelID) => void;
}

export const Textarea = ({
  input,
  handleInputChange,
  isLoading,
  status,
  stop,
  selectedModel,
  setSelectedModel,
}: InputProps) => {
  const isStreaming = status === "streaming" || status === "submitted";
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to get the correct scrollHeight
    textarea.style.height = "auto";
    
    // Set to scrollHeight to expand properly
    const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
    textarea.style.height = `${newHeight}px`;
  }, [input]);
  
  return (
    <div className="relative w-full bg-background/90 backdrop-blur-sm border border-input rounded-2xl shadow-sm transition-all hover:shadow-md">
      <ShadcnTextarea
        ref={textareaRef}
        className="resize-none bg-transparent w-full rounded-2xl px-4 pr-12 pt-3 pb-3 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70 placeholder:pl-1 min-h-[54px] transition-colors leading-normal flex items-center"
        value={input}
        autoFocus
        placeholder="Send a message..."
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isLoading && input.trim()) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        style={{ verticalAlign: 'middle', caretColor: 'var(--primary)' }}
      />

      <button
        type={isStreaming ? "button" : "submit"}
        onClick={isStreaming ? stop : undefined}
        disabled={(!isStreaming && !input.trim()) || (isStreaming && status === "submitted")}
        className="absolute right-2 bottom-2 rounded-full p-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        aria-label={isStreaming ? "Stop generating" : "Send message"}
      >
        {isStreaming ? (
          <Loader2 className="h-5 w-5 text-primary-foreground animate-spin" />
        ) : (
          <ArrowUp className="h-5 w-5 text-primary-foreground" />
        )}
      </button>
    </div>
  );
};
