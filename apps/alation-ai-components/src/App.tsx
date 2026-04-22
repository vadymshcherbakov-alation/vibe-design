import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  PromptInput,
  Attachment,
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
  ToolTimeline,
  ToolTimelineHeader,
  ToolTimelineInput,
  ToolTimelineOutput,
  ToolTimelineFooter,
  Button,
  type AttachmentData,
} from "@repo/ai-ui";
import { Table2, FileText } from "lucide-react";

const MOCK_STREAM_TEXT = `Let me analyze this step by step.

First, I need to identify the key data sources mentioned. The user referenced the "sales_data" table and "Q3 Report.pdf". I'll need to cross-reference both to get a complete picture.

Step 1 — Query the sales_data table
I'll filter records where quarter = 'Q3' and group by product_category. This should give me aggregate revenue and volume figures. I also want to calculate month-over-month delta within Q3 itself.

Step 2 — Parse the document context
The Q3 Report contains executive commentary and targets. I need to compare actuals from the database against the targets outlined in the document. Any gap larger than 10% should be flagged explicitly.

Step 3 — Identify trends
Looking at month-over-month changes within Q3 (July, August, September). I should highlight categories that underperformed relative to Q2 and note any that exceeded projections — those are worth calling out positively.

Step 4 — Formulate the response
I'll structure the answer with a summary paragraph, a breakdown by category, and finally the top 3 takeaways the user should act on.

This approach ensures the response is grounded in both structured data and document context, reducing the risk of hallucination.`;

const initialAttachments: AttachmentData[] = [
  {
    filename: "mountain-landscape.jpg",
    id: crypto.randomUUID(),
    mediaType: "image/jpeg",
    type: "file",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  },
  {
    filename: "ocean-sunset.jpg",
    id: crypto.randomUUID(),
    mediaType: "image/jpeg",
    type: "file",
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop",
  },
  {
    filename: "document.pdf",
    id: crypto.randomUUID(),
    mediaType: "application/pdf",
    type: "file",
    url: "",
  },
  {
    filename: "video.mp4",
    id: crypto.randomUUID(),
    mediaType: "video/mp4",
    type: "file",
    url: "",
  },
];

interface AttachmentItemProps {
  attachment: AttachmentData;
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id],
  );
  return <Attachment data={attachment} onRemove={handleRemove} />;
});
AttachmentItem.displayName = "AttachmentItem";

const initialContextItems = [
  { id: crypto.randomUUID(), label: "sales_data", icon: <Table2 /> },
  { id: crypto.randomUUID(), label: "Q3 Report.pdf", icon: <FileText /> },
];

function App() {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [contextItems, setContextItems] = useState(initialContextItems);
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);

  const handleRemove = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleRemoveContext = useCallback((id: string) => {
    setContextItems((prev) => prev.filter((c) => c.id !== id));
  }, []);

  type StreamStatus = "idle" | "thinking" | "complete";
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("idle");
  const [streamContent, setStreamContent] = useState("");
  const [streamDuration, setStreamDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runStream = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStreamStatus("thinking");
    setStreamContent("");
    const start = Date.now();
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 6;
      setStreamContent(MOCK_STREAM_TEXT.slice(0, i));
      if (i >= MOCK_STREAM_TEXT.length) {
        clearInterval(intervalRef.current!);
        setStreamStatus("complete");
        setStreamDuration(Math.round((Date.now() - start) / 1000));
      }
    }, 16);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-10 antialiased">
      <div className="mx-auto max-w-2xl space-y-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Alation
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            AI Components
          </h1>
        </div>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Prompt Input
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Multi-line prompt input with attachments, char count, and ⌘↵ to
              submit
            </p>
          </div>
          <PromptInput
            onSubmit={(val) => setLastSubmitted(val)}
            placeholder="Ask anything..."
            maxLength={2000}
          >
            {contextItems.map((item) => (
              <Attachment
                key={item.id}
                label={item.label}
                icon={item.icon}
                onRemove={() => handleRemoveContext(item.id)}
              />
            ))}
            {attachments.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                attachment={attachment}
                onRemove={handleRemove}
              />
            ))}
          </PromptInput>
          {lastSubmitted && (
            <p className="text-xs text-muted-foreground">
              Submitted:{" "}
              <span className="font-medium text-foreground">
                "{lastSubmitted}"
              </span>
            </p>
          )}
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Reasoning</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Two states: thinking (in progress) and complete (collapsible)
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs text-neutral-400 uppercase tracking-wide">Thinking</p>
              <Reasoning status="thinking">
                <ReasoningTrigger />
                <ReasoningContent>
                  First, I need to identify the key entities in the user's
                  question. The query mentions "sales trends" and "Q3" — I'll
                  cross-reference the uploaded report with the sales_data table...
                </ReasoningContent>
              </Reasoning>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-neutral-400 uppercase tracking-wide">Complete</p>
              <Reasoning status="complete" duration={4} defaultOpen>
                <ReasoningTrigger />
                <ReasoningContent>
                  First, I need to identify the key entities in the user's
                  question. The query mentions "sales trends" and "Q3" — I'll
                  cross-reference the uploaded report with the sales_data table to
                  find relevant aggregates. I should filter by date range and
                  group by product category before summarizing.
                </ReasoningContent>
              </Reasoning>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-neutral-400 uppercase tracking-wide">Streaming</p>
              <Button size="sm" onClick={runStream} disabled={streamStatus === "thinking"}>
                Run
              </Button>
              {streamStatus !== "idle" && (
                <Reasoning status={streamStatus} duration={streamDuration} defaultOpen>
                  <ReasoningTrigger />
                  <ReasoningContent>{streamContent}</ReasoningContent>
                </Reasoning>
              )}
            </div>
          </div>
        </section>
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Tool</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Collapsible tool call with input parameters and output
            </p>
          </div>
          <ToolTimeline defaultOpen>
            <ToolTimelineHeader>search_catalog</ToolTimelineHeader>
            <ToolTimelineInput>
              {JSON.stringify({ query: "sales data Q3 2024", limit: 20, filters: { domain: "finance" } }, null, 2)}
            </ToolTimelineInput>
            <ToolTimelineOutput>
              {JSON.stringify({ total: 12, results: [{ id: "tbl_001", name: "sales_data", schema: "finance", updated_at: "2024-09-30" }, { id: "tbl_002", name: "q3_revenue_summary", schema: "finance", updated_at: "2024-10-01" }] }, null, 2)}
            </ToolTimelineOutput>
            <ToolTimelineFooter duration={120} acuCredits={123} />
          </ToolTimeline>
        </section>
      </div>
    </div>
  );
}

export default App;
