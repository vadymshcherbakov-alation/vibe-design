import { useState, type ReactNode } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import { TbPrompt } from "react-icons/tb";
import { cn } from "../../lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Button } from "./button";

// --- Tool (root) ---

interface ToolProps {
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Tool({ children, defaultOpen = false, className }: ToolProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn(
        "rounded-lg overflow-hidden border border-neutral-200 bg-white",
        className,
      )}
    >
      {children}
    </Collapsible>
  );
}

// --- ToolHeader ---

interface ToolHeaderProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function ToolHeader({
  children,
  icon = <TbPrompt />,
  className,
}: ToolHeaderProps) {
  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 p-3 text-sm font-medium transition-colors hover:bg-neutral-50 rounded-t-lg",
        className,
      )}
    >
      <span className="shrink-0 [&_svg]:size-4">{icon}</span>
      <span className="flex-1 text-left">{children}</span>
      <ChevronDown className="size-3.5 text-subtle transition-transform duration-200 -rotate-90 [[data-open]_&]:rotate-0" />
    </CollapsibleTrigger>
  );
}

// --- ToolBody ---

interface ToolBodyProps {
  children: ReactNode;
  className?: string;
}

export function ToolBody({ children, className }: ToolBodyProps) {
  return (
    <CollapsibleContent>
      <div className={cn("border-t border-neutral-200", className)}>
        {children}
      </div>
    </CollapsibleContent>
  );
}

// --- ToolSection (internal) ---

interface ToolSectionProps {
  label: string;
  children: string;
  className?: string;
}

function ToolSection({ label, children, className }: ToolSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className={cn("p-3", className)}>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-subtle">
        {label}
      </p>
      <div className="group/content relative">
        <pre className="overflow-x-auto rounded bg-neutral-50 px-3 py-2 text-xs text-foreground">
          {children}
        </pre>
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
  );
}

// --- ToolInput ---

interface ToolInputProps {
  children: string;
  className?: string;
}

export function ToolInput({ children, className }: ToolInputProps) {
  return (
    <ToolSection label="Input parameters" className={className}>
      {children}
    </ToolSection>
  );
}

// --- ToolOutput ---

interface ToolOutputProps {
  children: string;
  className?: string;
}

export function ToolOutput({ children, className }: ToolOutputProps) {
  return (
    <ToolSection label="Output" className={className}>
      {children}
    </ToolSection>
  );
}
