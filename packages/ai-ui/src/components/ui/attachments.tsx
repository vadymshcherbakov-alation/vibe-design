import { type ReactNode } from "react";
import { File, FileText, Video, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AttachmentData {
  id: string;
  filename: string;
  mediaType: string;
  type: "file";
  url: string;
}

// --- Attachments (container) ---

interface AttachmentsProps {
  children: ReactNode;
  variant?: "grid" | "list";
  className?: string;
}

export function Attachments({
  children,
  variant = "grid",
  className,
}: AttachmentsProps) {
  return (
    <div
      className={cn(
        variant === "grid" && "flex flex-wrap gap-2",
        variant === "list" && "flex flex-col gap-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- Attachment ---

interface AttachmentProps {
  label?: string;
  icon?: ReactNode;
  data?: AttachmentData;
  onRemove?: () => void;
  className?: string;
}

function resolveIcon(data: AttachmentData): ReactNode {
  const isImage = data.mediaType.startsWith("image/") && data.url;
  if (isImage) {
    return (
      <img
        src={data.url}
        alt=""
        className="size-3.5 rounded-sm object-cover"
      />
    );
  }
  const Icon =
    data.mediaType === "application/pdf"
      ? FileText
      : data.mediaType.startsWith("video/")
        ? Video
        : File;
  return <Icon />;
}

export function Attachment({
  label,
  icon,
  data,
  onRemove,
  className,
}: AttachmentProps) {
  const resolvedLabel = data ? data.filename : (label ?? "");
  const resolvedIcon = data ? resolveIcon(data) : icon;

  return (
    <div
      className={cn(
        "group/chip inline-flex h-auto items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-1 text-sm transition-colors hover:bg-neutral-200",
        className,
      )}
    >
      {resolvedIcon && (
        <button
          type="button"
          onClick={onRemove}
          className="relative size-3.5 shrink-0 [&_svg]:size-3.5 [&_svg]:stroke-[1.5] cursor-pointer!"
        >
          <span className="absolute inset-0 transition-opacity group-hover/chip:opacity-0">
            {resolvedIcon}
          </span>
          <X className="absolute inset-0 size-3.5 opacity-0 transition-opacity group-hover/chip:opacity-100" />
        </button>
      )}
      <span className="max-w-[140px] truncate font-normal">{resolvedLabel}</span>
    </div>
  );
}
