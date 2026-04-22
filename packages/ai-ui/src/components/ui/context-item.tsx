import { type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

interface ContextItemProps {
  label: string;
  icon?: ReactNode;
  onRemove?: () => void;
  className?: string;
}

export function ContextItem({
  label,
  icon,
  onRemove,
  className,
}: ContextItemProps) {
  return (
    <Button
      variant="ghost"
      onClick={onRemove}
      className={cn(
        "group/chip inline-flex h-auto cursor-pointer items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-1 text-sm transition-colors hover:bg-neutral-200",
        className,
      )}
    >
      {icon && (
        <span className="relative size-3.5 shrink-0 [&_svg]:size-3.5">
          <span className="absolute inset-0 transition-opacity group-hover/chip:opacity-0">
            {icon}
          </span>
          <X className="absolute inset-0 size-3.5 opacity-0 transition-opacity group-hover/chip:opacity-100" />
        </span>
      )}
      <span className="truncate font-normal">{label}</span>
    </Button>
  );
}
