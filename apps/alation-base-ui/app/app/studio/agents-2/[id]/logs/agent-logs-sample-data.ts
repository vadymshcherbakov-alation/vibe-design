"use client";

import type { LogEffortStep, LogTableRow } from "../../../logs/mock-logs";

const EMPTY_EFFORTS: LogEffortStep[] = [
  {
    id: "r1",
    type: "reasoning",
    label: "Process request",
    content: "Processing user request.",
  },
  {
    id: "a1",
    type: "assistant_result",
    label: "Response",
    content: "Response generated.",
  },
];

function buildMessage(): string {
  return "assistant_reasoning -> assistant_response";
}

type SampleTemplate = Omit<
  LogTableRow,
  "id" | "timestamp" | "responseId" | "message" | "agent"
>;

const SAMPLE_TEMPLATES: SampleTemplate[] = [
  {
    userName: "Alex Chen",
    input: "What were last month's top selling products?",
    output: "Top 5 products: Widget A (1,200 units), Widget B (980 units)...",
    efforts: EMPTY_EFFORTS,
    metadata: "AGENT_STUDIO",
    toolCallCount: 1,
    callerIdentity: "session | user_id: 101",
    llm: "gpt-4o",
    tokens: 420,
    functions: "catalog_search_tool()",
    configuration: "default",
    responseType: "text",
    reasoningEffort: "medium",
    reasoningSummary: "concise",
    verbosity: "medium",
  },
  {
    userName: "Sam Rivera",
    input: '{"query":"revenue_summary","period":"Q1"}',
    output: "Q1 revenue summary: $2.4M total, up 12% YoY.",
    efforts: EMPTY_EFFORTS,
    metadata: "REST_API",
    toolCallCount: 1,
    callerIdentity: "bearer | client: abc123",
    llm: "gpt-5",
    tokens: 310,
    functions: "sql_execution_tool()",
    configuration: "balanced",
    responseType: "text",
    reasoningEffort: "low",
    reasoningSummary: "short",
    verbosity: "low",
  },
  {
    userName: "Jordan Lee",
    input: "List datasets updated in the last 7 days",
    output: "Found 8 datasets updated in the last 7 days.",
    efforts: EMPTY_EFFORTS,
    metadata: "MCP",
    toolCallCount: 1,
    callerIdentity: "session | user_id: 42",
    llm: "claude-3.5",
    tokens: 280,
    functions: "catalog_search_tool()",
    configuration: "default",
    responseType: "text",
    reasoningEffort: "medium",
    reasoningSummary: "detailed",
    verbosity: "medium",
  },
  {
    userName: "Casey Kim",
    input: "Run data quality check on sales.orders",
    output: "Quality check complete. 3 warnings, 0 errors.",
    efforts: EMPTY_EFFORTS,
    metadata: "FLOW",
    toolCallCount: 2,
    callerIdentity: "bearer | client: def456",
    llm: "gpt-4o",
    tokens: 550,
    functions: "quality_check_tool(), report_builder()",
    configuration: "safe",
    responseType: "text",
    reasoningEffort: "medium",
    reasoningSummary: "concise",
    verbosity: "medium",
  },
  {
    userName: "Morgan Taylor",
    input: "Generate documentation for schema public.customers",
    output: "Documentation generated and saved.",
    efforts: EMPTY_EFFORTS,
    metadata: "AGENT_STUDIO",
    toolCallCount: 1,
    callerIdentity: "session | user_id: 88",
    llm: "gpt-5",
    tokens: 390,
    functions: "doc_generator()",
    configuration: "default",
    responseType: "text",
    reasoningEffort: "low",
    reasoningSummary: "short",
    verbosity: "high",
  },
  {
    userName: "Riley Park",
    input: "Show me lineage for table analytics.events",
    output: "Lineage: 3 upstream sources, 2 downstream consumers.",
    efforts: EMPTY_EFFORTS,
    metadata: "CHAT_WITH_DATA",
    toolCallCount: 0,
    callerIdentity: "session | user_id: 15",
    llm: "gpt-4o",
    tokens: 180,
    functions: "-",
    configuration: "default",
    responseType: "text",
    reasoningEffort: "low",
    reasoningSummary: "short",
    verbosity: "low",
  },
];

/**
 * Returns sample log rows for an agent. Used when the main logs dataset
 * has no rows for this agent so the logs page always shows something.
 */
export function getAgentLogSamples(
  agentId: string,
  agentName: string
): LogTableRow[] {
  const baseDate = new Date();
  return SAMPLE_TEMPLATES.map((template, index) => {
    const createdAt = new Date(baseDate);
    createdAt.setHours(createdAt.getHours() - index * 2);
    createdAt.setMinutes(createdAt.getMinutes() - index * 17);
    const id = `agent-${agentId}-log-${index + 1}`;
    const responseId = `resp_${agentId}_${String(index + 1).padStart(4, "0")}`;
    return {
      ...template,
      agent: agentName,
      message: buildMessage(),
      id,
      responseId,
      timestamp: createdAt.toISOString(),
    };
  });
}
