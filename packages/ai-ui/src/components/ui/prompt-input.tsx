import { Children, type ReactNode, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";
import { ArrowUp, AudioLines, Plus } from "lucide-react";
interface PromptInputProps {
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  children?: ReactNode;
}

export function PromptInput({
  onSubmit,
  placeholder = "Ask anything...",
  disabled = false,
  children,
}: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    const text = editableRef.current?.textContent?.trim() ?? "";
    if (!text || disabled) return;
    onSubmit?.(text);
    if (editableRef.current) {
      editableRef.current.textContent = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          //"flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring/50",
          "rounded-2xl border p-4 w-full max-w-3xl bg-white",
          "transition-colors duration-120 relative",
          isFocused
            ? "border-alation-neutral-400 shadow-sm"
            : "border-alation-neutral-200",
          "gap-3 flex flex-col",
        )}
      >
        {Children.count(children) > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">{children}</div>
        )}
        <div
          contentEditable
          ref={editableRef}
          data-placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (editableRef.current && !editableRef.current.textContent?.trim()) {
              editableRef.current.innerHTML = "";
            }
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "text-md font-normal leading-6 outline-none",
            "min-h-[44px] max-h-[240px] overflow-y-auto overflow-x-hidden w-full whitespace-pre-wrap break-words",
            "scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent",
            "[&:empty]:before:content-[attr(data-placeholder)] before:text-neutral-400 before:pointer-events-none",
          )}
        />
        <div className="flex items-center justify-between gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full cursor-pointer"
                  aria-label="Add context, files, or skills"
                >
                  <Plus className="size-4" />
                </Button>
              }
            ></TooltipTrigger>
            <TooltipContent>
              Add context, files, or skills
              <kbd>/</kbd>
            </TooltipContent>
          </Tooltip>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full cursor-pointer"
                    aria-label="Voice input"
                  >
                    <AudioLines className="size-4" />
                  </Button>
                }
              ></TooltipTrigger>
              <TooltipContent>Voice input</TooltipContent>
            </Tooltip>
            <Button
              size="icon"
              className="rounded-full cursor-pointer"
              aria-label="Send"
              onClick={handleSubmit}
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
