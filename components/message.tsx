"use client";

import type { Message as TMessage } from "ai";
import { memo, useCallback, useEffect, useState } from "react";
import equal from "fast-deep-equal";
import { Markdown } from "./markdown";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon, LightbulbIcon, BrainIcon } from "lucide-react";
import { SpinnerIcon } from "./icons";
import { ToolInvocation } from "./tool-invocation";
import { CopyButton } from "./copy-button";

interface ReasoningPart {
  type: "reasoning";
  reasoning: string;
  details: Array<{ type: "text"; text: string }>;
}

interface ReasoningMessagePartProps {
  part: ReasoningPart;
  isReasoning: boolean;
}

export function ReasoningMessagePart({
  part,
  isReasoning,
}: ReasoningMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const memoizedSetIsExpanded = useCallback((value: boolean) => {
    setIsExpanded(value);
  }, []);

  useEffect(() => {
    memoizedSetIsExpanded(isReasoning);
  }, [isReasoning, memoizedSetIsExpanded]);

  return (
    <div className="flex flex-col mb-2">
      {isReasoning ? (
        <div className="flex items-center gap-2.5 rounded-full py-1.5 px-3 bg-muted border border-border w-fit">
          <div className="h-3.5 w-3.5">
            <SpinnerIcon />
          </div>
          <div className="text-xs font-medium">Thinking...</div>
        </div>
      ) : (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full rounded-md py-2 px-3 mb-0.5 bg-muted border border-border"
        >
          <div className="flex items-center gap-2.5">
            <LightbulbIcon className="h-4 w-4" />
            <div className="text-sm font-medium">
              Reasoning {isExpanded ? "(hide)" : "(view)"}
            </div>
          </div>
          <div>
            {isExpanded ? (
              <ChevronDownIcon className="h-3 w-3" />
            ) : (
              <ChevronUpIcon className="h-3 w-3" />
            )}
          </div>
        </button>
      )}

      {isExpanded && (
        <div className="text-sm text-muted-foreground pl-3 ml-1 mt-1 border-l border-border">
          <div className="text-xs pl-1 mb-2">
            The assistant&apos;s thought process:
          </div>
          {part.details.map((detail, detailIndex) =>
            detail.type === "text" ? (
              <div key={detailIndex} className="px-2 py-1.5 mb-2 bg-background border border-border rounded">
                <Markdown>{detail.text}</Markdown>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

const PurePreviewMessage = ({
  message,
  isLatestMessage,
  status,
  isLoading,
}: {
  message: TMessage;
  isLoading: boolean;
  status: "error" | "submitted" | "streaming" | "ready";
  isLatestMessage: boolean;
}) => {
  // Create a string with all text parts for copy functionality
  const getMessageText = () => {
    if (!message.parts) return "";
    return message.parts
      .filter(part => part.type === "text")
      .map(part => (part.type === "text" ? part.text : ""))
      .join("\n\n");
  };

  // Only show copy button if the message is from the assistant and not currently streaming
  const shouldShowCopyButton = message.role === "assistant" && (!isLatestMessage || status !== "streaming");

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 group/message",
        message.role === "assistant" ? "mb-4" : "mb-4"
      )}
      data-role={message.role}
    >
      <div
        className={cn(
          "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
          "group-data-[role=user]/message:w-fit",
        )}
      >
        <div className="flex flex-col w-full space-y-3">
          {message.parts?.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <div
                    key={`message-${message.id}-part-${i}`}
                    className="flex flex-row gap-2 items-start w-full"
                  >
                    <div
                      className={cn("flex flex-col gap-3 w-full", {
                        "bg-secondary/80 text-secondary-foreground px-4 py-3 rounded-2xl shadow-sm":
                          message.role === "user",
                        "prose dark:prose-invert max-w-none":
                          message.role === "assistant"
                      })}
                    >
                      <Markdown>{part.text}</Markdown>
                    </div>
                  </div>
                );
              case "tool-invocation":
                const { toolName, state, args } = part.toolInvocation;
                const result = 'result' in part.toolInvocation ? part.toolInvocation.result : null;
                
                return (
                  <ToolInvocation
                    key={`message-${message.id}-part-${i}`}
                    toolName={toolName}
                    state={state}
                    args={args}
                    result={result}
                    isLatestMessage={isLatestMessage}
                    status={status}
                  />
                );
              case "reasoning":
                return (
                  <ReasoningMessagePart
                    key={`message-${message.id}-${i}`}
                    // @ts-expect-error part
                    part={part}
                    isReasoning={
                      (message.parts &&
                        status === "streaming" &&
                        i === message.parts.length - 1) ??
                      false
                    }
                  />
                );
              default:
                return null;
            }
          })}
          
          {shouldShowCopyButton && (
            <div className="flex justify-start mt-2">
              <CopyButton text={getMessageText()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Message = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLatestMessage !== nextProps.isLatestMessage) return false;
  if (prevProps.message.annotations !== nextProps.message.annotations) return false;
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
  return true;
});
