import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Shimmer } from "../ai-elements/shimmer";

type ReasoningStatus = "thinking" | "complete";

interface ReasoningContextValue {
  status: ReasoningStatus;
  duration?: number;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

function useReasoning() {
  const ctx = useContext(ReasoningContext);
  if (!ctx)
    throw new Error("Reasoning subcomponents must be used within <Reasoning>");
  return ctx;
}

// --- Reasoning (root) ---

interface ReasoningProps {
  children: ReactNode;
  defaultOpen?: boolean;
  status?: ReasoningStatus;
  duration?: number;
  className?: string;
}

export function Reasoning({
  children,
  defaultOpen = false,
  status = "complete",
  duration,
  className,
}: ReasoningProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (status === "complete") setOpen(true);
  }, [status]);

  return (
    <ReasoningContext.Provider value={{ status, duration }}>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className={cn("flex flex-col ", className)}
      >
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
}

// --- ReasoningTrigger ---

interface ReasoningTriggerProps {
  className?: string;
}

export function ReasoningTrigger({ className }: ReasoningTriggerProps) {
  const { status, duration } = useReasoning();
  const isThinking = status === "thinking";

  return (
    <CollapsibleTrigger
      className={cn(
        "inline-flex items-center gap-1.5 text-sm transition-colors w-fit text-subtle hover:text-neutral-700 cursor-pointer",
        className,
      )}
    >
      {isThinking ? (
        <Shimmer className="font-medium">Thinking</Shimmer>
      ) : (
        <span className="font-medium">
          Thought
          {duration !== undefined && (
            <span className="font-normal"> for {duration}s</span>
          )}
        </span>
      )}
      <ChevronDown className="size-3.5 transition-transform duration-200 -rotate-90 [[data-open]_&]:rotate-0" />
    </CollapsibleTrigger>
  );
}

// --- ReasoningContent ---

interface ReasoningContentProps {
  children: ReactNode;
  className?: string;
}

export function ReasoningContent({
  children,
  className,
}: ReasoningContentProps) {
  const paragraphs =
    typeof children === "string" ? children.split("\n\n") : null;

  return (
    <CollapsibleContent className="mt-2">
      <div
        className={cn(
          "text-sm text-subtle leading-relaxed mt-1.5 space-y-2",
          className,
        )}
      >
        {paragraphs ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : children}
      </div>
    </CollapsibleContent>
  );
}
