import { type ElementType, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

type ShimmerProps<T extends ElementType = "span"> = {
  as?: T;
  duration?: number;
  spread?: number;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "duration" | "spread" | "className">;

export function Shimmer<T extends ElementType = "span">({
  as,
  duration = 2,
  spread = 2,
  className,
  style,
  ...props
}: ShimmerProps<T>) {
  const Tag = (as ?? "span") as ElementType;

  return (
    <Tag
      className={cn("animate-shimmer-text", className)}
      style={{
        backgroundSize: `${spread * 100}% auto`,
        animationDuration: `${duration}s`,
        ...(style as object),
      }}
      {...props}
    />
  );
}
