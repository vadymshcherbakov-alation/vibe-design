"use client";

export type ExecutionSource =
  | "agent_studio"
  | "chat_with_data"
  | "rest_api"
  | "mcp"
  | "flow"
  | "flow_scheduled"
  | "evaluation";

export type ExecutionStatus = "success" | "error";
export type AuthType = "session" | "bearer";

export interface AgentExecutionLogListItem {
  id: string;
  agent_config_id: string;
  execution_source: ExecutionSource;
  status: ExecutionStatus;
  auth_type: AuthType;
  user_id: string | null;
  tenant_user_id: number | null;
  oauth_client_id: string | null;
  duration_ms: number | null;
  input_payload: Record<string, unknown>;
  output_payload: unknown;
  error_message: string | null;
  tool_calls_count: number;
  tools_used: string[];
  chat_id: string | null;
  message_id: string | null;
  workflow_id: string | null;
  workflow_execution_id: string | null;
  node_id: string | null;
  created_at: string;
}

export interface LogTracePart {
  part_kind: "text" | "tool-call" | "tool-return";
  content: string;
  tool_name?: string;
}

export interface LogTraceMessage {
  kind: "request" | "response";
  role: "user" | "assistant" | "tool";
  parts: LogTracePart[];
}

export interface AgentExecutionLogDetail extends AgentExecutionLogListItem {
  message_trace: LogTraceMessage[];
  chat_deep_link: string | null;
}

export interface LogsFiltersValue {
  executionSource: ExecutionSource | "all";
  status: ExecutionStatus | "all";
  createdAfter: string;
  createdBefore: string;
}

const MOCK_LOGS: AgentExecutionLogDetail[] = [
  {
    id: "log-1001",
    agent_config_id: "1",
    execution_source: "flow",
    status: "success",
    auth_type: "bearer",
    user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    tenant_user_id: 42,
    oauth_client_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    duration_ms: 4200,
    input_payload: {
      question: "What was our Q4 revenue by region?",
      data_product_id: "superstore",
    },
    output_payload:
      "Q4 revenue by region:\n- West: $1,234,567\n- East: $987,654\n- Central: $876,432",
    error_message: null,
    tool_calls_count: 1,
    tools_used: ["sql_execution_tool"],
    chat_id: null,
    message_id: null,
    workflow_id: "workflow-1",
    workflow_execution_id: "workflow-exec-1",
    node_id: "query_agent",
    created_at: "2025-02-12T14:32:01Z",
    chat_deep_link: null,
    message_trace: [
      {
        kind: "request",
        role: "user",
        parts: [
          {
            part_kind: "text",
            content: "What was our Q4 revenue by region?",
          },
        ],
      },
      {
        kind: "response",
        role: "assistant",
        parts: [
          {
            part_kind: "text",
            content: "I will query the revenue data broken down by region for Q4.",
          },
        ],
      },
      {
        kind: "response",
        role: "assistant",
        parts: [
          {
            part_kind: "tool-call",
            tool_name: "sql_execution_tool",
            content: 'SELECT region, SUM(revenue) FROM sales WHERE quarter = "Q4"',
          },
        ],
      },
      {
        kind: "request",
        role: "tool",
        parts: [
          {
            part_kind: "tool-return",
            tool_name: "sql_execution_tool",
            content: '{"rows":[{"region":"West","revenue":1234567},{"region":"East","revenue":987654}]}',
          },
        ],
      },
      {
        kind: "response",
        role: "assistant",
        parts: [
          {
            part_kind: "text",
            content: "Based on query results, here is the Q4 revenue breakdown.",
          },
        ],
      },
    ],
  },
  {
    id: "log-1002",
    agent_config_id: "1",
    execution_source: "agent_studio",
    status: "success",
    auth_type: "session",
    user_id: "7d8d00bd-0c08-4f95-aaf9-e9dbf2d24f01",
    tenant_user_id: 42,
    oauth_client_id: null,
    duration_ms: 2100,
    input_payload: {
      question: "Show me top 10 customers",
      data_product_id: "crm",
    },
    output_payload: "Top 10 customers:\n1. Acme Corp\n2. Oscorp\n3. Stark Industries",
    error_message: null,
    tool_calls_count: 1,
    tools_used: ["sql_execution_tool"],
    chat_id: "chat-11",
    message_id: "message-101",
    workflow_id: null,
    workflow_execution_id: null,
    node_id: null,
    created_at: "2025-02-12T15:10:33Z",
    chat_deep_link: "/chats/chat-11?message=message-101",
    message_trace: [
      {
        kind: "request",
        role: "user",
        parts: [{ part_kind: "text", content: "Show me top 10 customers" }],
      },
      {
        kind: "response",
        role: "assistant",
        parts: [
          { part_kind: "text", content: "I will look up top customers by revenue." },
        ],
      },
      {
        kind: "response",
        role: "assistant",
        parts: [
          {
            part_kind: "tool-call",
            tool_name: "sql_execution_tool",
            content: "SELECT customer_name, SUM(total) FROM orders GROUP BY customer_name LIMIT 10",
          },
        ],
      },
      {
        kind: "request",
        role: "tool",
        parts: [
          {
            part_kind: "tool-return",
            tool_name: "sql_execution_tool",
            content: '{"rows":[{"customer_name":"Acme Corp","total":90000}]}',
          },
        ],
      },
      {
        kind: "response",
        role: "assistant",
        parts: [{ part_kind: "text", content: "Here are your top 10 customers." }],
      },
    ],
  },
  {
    id: "log-1003",
    agent_config_id: "1",
    execution_source: "mcp",
    status: "error",
    auth_type: "bearer",
    user_id: "d5f4be8b-2068-4f19-bcef-b4af6bbf8db0",
    tenant_user_id: 42,
    oauth_client_id: "d5f4be8b-2068-4f19-bcef-b4af6bbf8db0",
    duration_ms: 760,
    input_payload: {
      question: "List failed jobs from yesterday",
    },
    output_payload: null,
    error_message: "Data product credentials are missing for this workspace.",
    tool_calls_count: 0,
    tools_used: [],
    chat_id: null,
    message_id: null,
    workflow_id: null,
    workflow_execution_id: null,
    node_id: null,
    created_at: "2025-02-12T16:48:10Z",
    chat_deep_link: null,
    message_trace: [
      {
        kind: "request",
        role: "user",
        parts: [{ part_kind: "text", content: "List failed jobs from yesterday" }],
      },
      {
        kind: "response",
        role: "assistant",
        parts: [
          {
            part_kind: "text",
            content:
              "I cannot access the requested data source because credentials are missing.",
          },
        ],
      },
    ],
  },
  {
    id: "log-1004",
    agent_config_id: "1",
    execution_source: "flow_scheduled",
    status: "success",
    auth_type: "bearer",
    user_id: "9f3173b2-40a8-4ad9-95af-58dffbf2cb42",
    tenant_user_id: 42,
    oauth_client_id: null,
    duration_ms: 3980,
    input_payload: {
      question: "Generate weekly regional trend summary",
    },
    output_payload: "Weekly trend summary generated successfully.",
    error_message: null,
    tool_calls_count: 2,
    tools_used: ["sql_execution_tool", "report_builder"],
    chat_id: null,
    message_id: null,
    workflow_id: "workflow-2",
    workflow_execution_id: "workflow-exec-2",
    node_id: "weekly_summary_agent",
    created_at: "2025-02-11T09:15:00Z",
    chat_deep_link: null,
    message_trace: [
      {
        kind: "request",
        role: "user",
        parts: [{ part_kind: "text", content: "Generate weekly regional trend summary" }],
      },
      {
        kind: "response",
        role: "assistant",
        parts: [{ part_kind: "text", content: "Preparing weekly report now." }],
      },
    ],
  },
];

export const DEFAULT_LOGS_FILTERS: LogsFiltersValue = {
  executionSource: "all",
  status: "all",
  createdAfter: "",
  createdBefore: "",
};

export function getMockAgentLogs(agentId: string): AgentExecutionLogDetail[] {
  return MOCK_LOGS.filter((log) => log.agent_config_id === agentId).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
