import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { Copy, Check, CircleCheck, ChevronDown, ArrowRightToLine, ListTree } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

// --- ToolTimeline (root) ---

interface ToolTimelineProps {
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function ToolTimeline({
  children,
  defaultOpen = false,
  className,
}: ToolTimelineProps) {
  const [header, ...rest] = Children.toArray(children);

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn("flex flex-col", className)}
    >
      {header}
      {rest.length > 0 && (
        <CollapsibleContent>
          <div className="pt-2">{rest}</div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

// --- ToolTimelineHeader ---

interface ToolTimelineHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ToolTimelineHeader({
  children,
  className,
}: ToolTimelineHeaderProps) {
  return (
    <CollapsibleTrigger
      className={cn(
        "inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm transition-colors text-subtle hover:text-neutral-700",
        className,
      )}
    >
      <span>
        Ran tool{" "}
        <span className="font-medium text-foreground">{children}</span>
      </span>
      <ChevronDown className="size-3.5 transition-transform duration-200 -rotate-90 [[data-open]_&]:rotate-0" />
    </CollapsibleTrigger>
  );
}

// --- ToolTimelineSection (internal) ---

interface ToolTimelineSectionProps {
  label: string;
  icon: ReactNode;
  children: string;
  className?: string;
}

function ToolTimelineSection({
  label,
  icon,
  children,
  className,
}: ToolTimelineSectionProps) {
  const [copied, setCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const checkScroll = () => {
    const el = preRef.current;
    if (!el) return;
    setShowTop(el.scrollTop > 0);
    setShowBottom(el.scrollTop + el.clientHeight < el.scrollHeight);
  };

  useEffect(() => {
    checkScroll();
  }, [children]);

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className={cn("flex gap-3", className)}>
      {/* Left: icon + connecting line */}
      <div className="flex flex-col items-center">
        <span className="mt-0.5 shrink-0 text-subtle [&_svg]:size-3.5">{icon}</span>
        <div className="mt-1.5 w-px flex-1 bg-neutral-200" />
      </div>
      {/* Right: label + content */}
      <div className="flex-1 pb-3">
        <p className="text-sm text-subtle">{label}</p>
        <div className="mt-1.5 group/content relative">
          <div className="relative">
            <pre
              ref={preRef}
              onScroll={checkScroll}
              className="max-h-48 overflow-auto rounded border border-neutral-100 bg-neutral-50 px-3 py-2 text-xs text-subtle scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-neutral-300"
            >
              {children}
            </pre>
            {showTop && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-8 rounded-t bg-gradient-to-b from-neutral-50 to-transparent" />
            )}
            {showBottom && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b bg-gradient-to-t from-neutral-50 to-transparent" />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleCopy}
            className="absolute right-1 top-1 opacity-0 transition-opacity group-hover/content:opacity-100"
          >
            {copied ? (
              <Check className="size-3.5 text-subtle" />
            ) : (
              <Copy className="size-3.5 text-subtle" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- ToolTimelineInput ---

interface ToolTimelineInputProps {
  children: string;
  className?: string;
}

export function ToolTimelineInput({ children, className }: ToolTimelineInputProps) {
  return (
    <ToolTimelineSection label="Input parameters" icon={<ArrowRightToLine />} className={className}>
      {children}
    </ToolTimelineSection>
  );
}

// --- ToolTimelineOutput ---

interface ToolTimelineOutputProps {
  children: string;
  className?: string;
}

export function ToolTimelineOutput({ children, className }: ToolTimelineOutputProps) {
  return (
    <ToolTimelineSection label="Output" icon={<ListTree />} className={className}>
      {children}
    </ToolTimelineSection>
  );
}

// --- ToolTimelineFooter ---

interface ToolTimelineFooterProps {
  duration?: number;
  acuCredits?: number;
  className?: string;
}

export function ToolTimelineFooter({ duration, acuCredits, className }: ToolTimelineFooterProps) {
  return (
    <div className={cn("flex gap-3 text-sm text-subtle", className)}>
      <span className="mt-0.5 shrink-0 [&_svg]:size-3.5">
        <CircleCheck />
      </span>
      <div className="flex flex-col gap-0.5">
        <span>Done</span>
        {(duration !== undefined || acuCredits !== undefined) && (
          <div className="flex flex-col gap-0.5 text-xs text-subtle">
            {duration !== undefined && <span>Duration {duration}s</span>}
            {acuCredits !== undefined && <span>ACU used {acuCredits} credits</span>}
          </div>
        )}
      </div>
    </div>
  );
}
