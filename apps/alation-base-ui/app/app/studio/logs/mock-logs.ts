"use client";

export type LogEffortStep =
  | {
      id: string;
      type: "reasoning";
      label: string;
      content: string;
    }
  | {
      id: string;
      type: "tool_call";
      label: string;
      toolName: string;
      input: string;
    }
  | {
      id: string;
      type: "tool_result";
      label: string;
      toolName: string;
      output: string;
      status: "success" | "error";
    }
  | {
      id: string;
      type: "assistant_result";
      label: string;
      content: string;
    };

export interface LogTableRow {
  id: string;
  agent: string;
  userName: string;
  input: string;
  output: string;
  message: string;
  efforts: LogEffortStep[];
  metadata: string;
  toolCallCount: number;
  callerIdentity: string;
  llm: string;
  timestamp: string;
  responseId: string;
  tokens: number;
  functions: string;
  configuration: string;
  responseType: string;
  reasoningEffort: string;
  reasoningSummary: string;
  verbosity: string;
}

type BaseLogTemplate = Omit<LogTableRow, "id" | "timestamp" | "responseId" | "message">;

function buildLegacyMessage(efforts: LogEffortStep[]): string {
  return efforts
    .map((effort) => {
      if (effort.type === "reasoning") {
        return "assistant_reasoning";
      }
      if (effort.type === "tool_call") {
        return `tool_call(${effort.toolName})`;
      }
      if (effort.type === "tool_result") {
        return "tool_return";
      }
      return "assistant_response";
    })
    .join(" -> ");
}

const BASE_ROWS: BaseLogTemplate[] = [
  {
    agent: "Data Analyst Agent",
    userName: "Chao Li",
    input:
      '{"query":"q4_revenue_by_region","params":{"fiscalQuarter":"Q4","groupBy":"region","currency":"USD"}}',
    output: "Q4 revenue by region: West $1,234,567, East $987,654",
    efforts: [
      {
        id: "reasoning-1",
        type: "reasoning",
        label: "Plan query strategy",
        content:
          "User wants a grouped revenue breakdown by region in Q4. I should run one aggregate SQL query and return currency-formatted values in the final response.",
      },
      {
        id: "tool-call-1",
        type: "tool_call",
        label: "Run SQL query",
        toolName: "sql_execution_tool",
        input:
          '{"sql":"SELECT region, SUM(revenue_usd) AS revenue FROM finance.revenue WHERE fiscal_quarter = \'Q4\' GROUP BY region ORDER BY revenue DESC"}',
      },
      {
        id: "tool-result-1",
        type: "tool_result",
        label: "SQL result",
        toolName: "sql_execution_tool",
        output:
          '{"rows":[{"region":"West","revenue":1234567},{"region":"East","revenue":987654}],"rowCount":2}',
        status: "success",
      },
      {
        id: "assistant-result-1",
        type: "assistant_result",
        label: "User-facing response",
        content: "Q4 revenue by region: West $1,234,567, East $987,654",
      },
    ],
    metadata: "FLOW",
    toolCallCount: 1,
    callerIdentity: "bearer | client: 3fa85f64-...",
    llm: "gpt-5",
    tokens: 663,
    functions: "sql_execution_tool()",
    configuration: "default",
    responseType: "text",
    reasoningEffort: "medium",
    reasoningSummary: "detailed",
    verbosity: "medium",
  },
  {
    agent: "Data Analyst Agent",
    userName: "Avery Chen",
    input: "Show me top 10 customers",
    output: "Top 10 customers: Acme Corp, Oscorp, Stark Industries",
    efforts: [
      {
        id: "reasoning-1",
        type: "reasoning",
        label: "Interpret ranking request",
        content:
          "Top customers should be ranked by total revenue. I will query the top 10 and return the first few names in plain language.",
      },
      {
        id: "tool-call-1",
        type: "tool_call",
        label: "Fetch ranked customers",
        toolName: "sql_execution_tool",
        input:
          '{"sql":"SELECT customer_name, SUM(total_revenue) AS revenue FROM sales.orders GROUP BY customer_name ORDER BY revenue DESC LIMIT 10"}',
      },
      {
        id: "tool-result-1",
        type: "tool_result",
        label: "Ranking result",
        toolName: "sql_execution_tool",
        output:
          '{"rows":[{"customer_name":"Acme Corp"},{"customer_name":"Oscorp"},{"customer_name":"Stark Industries"}],"rowCount":10}',
        status: "success",
      },
      {
        id: "assistant-result-1",
        type: "assistant_result",
        label: "User-facing response",
        content: "Top 10 customers: Acme Corp, Oscorp, Stark Industries",
      },
    ],
    metadata: "AGENT_STUDIO",
    toolCallCount: 1,
    callerIdentity: "session | user_id: 42",
    llm: "gpt-4o",
    tokens: 512,
    functions: "sql_execution_tool()",
    configuration: "balanced",
    responseType: "text",
    reasoningEffort: "medium",
    reasoningSummary: "concise",
    verbosity: "medium",
  },
  {
    agent: "Operations Agent",
    userName: "Jordan Park",
    input:
      '{"query":"failed_jobs","filters":{"dateRange":{"from":"2025-02-11","to":"2025-02-11"},"status":["failed"]},"include":["jobId","workflow","error"]}',
    output: "Execution failed. Missing credentials for workspace connector.",
    efforts: [
      {
        id: "reasoning-1",
        type: "reasoning",
        label: "Validate connector availability",
        content:
          "Before querying failed jobs, credentials for the workspace connector must be present. The connector validation failed, so I cannot execute the tool call.",
      },
      {
        id: "assistant-result-1",
        type: "assistant_result",
        label: "User-facing response",
        content: "Execution failed. Missing credentials for workspace connector.",
      },
    ],
    metadata: "MCP",
    toolCallCount: 0,
    callerIdentity: "bearer | client: d5f4be8b-...",
    llm: "claude-3.5",
    tokens: 132,
    functions: "-",
    configuration: "safe",
    responseType: "text",
    reasoningEffort: "low",
    reasoningSummary: "short",
    verbosity: "low",
  },
  {
    agent: "Revenue Agent",
    userName: "Morgan Lee",
    input:
      '{"query":"weekly_revenue_trend","params":{"weeks":8,"comparePreviousPeriod":true,"metric":"net_revenue"}}',
    output: "Revenue trend generated with 8 weekly points.",
    efforts: [
      {
        id: "reasoning-1",
        type: "reasoning",
        label: "Plan data + report flow",
        content:
          "I need weekly revenue values and then a rendered trend summary. I will fetch raw data first and then pass it to the report builder.",
      },
      {
        id: "tool-call-1",
        type: "tool_call",
        label: "Query weekly revenue",
        toolName: "sql_execution_tool",
        input:
          '{"sql":"SELECT week_start, SUM(net_revenue) AS revenue FROM finance.weekly_metrics WHERE week_start >= CURRENT_DATE - INTERVAL \'8 week\' GROUP BY week_start ORDER BY week_start"}',
      },
      {
        id: "tool-result-1",
        type: "tool_result",
        label: "Weekly metrics",
        toolName: "sql_execution_tool",
        output:
          '{"rows":[{"week_start":"2025-01-01","revenue":153000},{"week_start":"2025-01-08","revenue":162000}],"rowCount":8}',
        status: "success",
      },
      {
        id: "tool-call-2",
        type: "tool_call",
        label: "Build trend report",
        toolName: "report_builder",
        input:
          '{"template":"weekly_revenue_trend","dataRef":"sql_execution_tool.result.rows","comparePreviousPeriod":true}',
      },
      {
        id: "tool-result-2",
        type: "tool_result",
        label: "Report builder output",
        toolName: "report_builder",
        output: '{"reportId":"rpt_78429","points":8,"status":"complete"}',
        status: "success",
      },
      {
        id: "assistant-result-1",
        type: "assistant_result",
        label: "User-facing response",
        content: "Revenue trend generated with 8 weekly points.",
      },
    ],
    metadata: "REST_API",
    toolCallCount: 2,
    callerIdentity: "bearer | client: 9f3173b2-...",
    llm: "gpt-4o",
    tokens: 741,
    functions: "report_builder(), sql_execution_tool()",
    configuration: "default",
    responseType: "text",
    reasoningEffort: "medium",
    reasoningSummary: "detailed",
    verbosity: "medium",
  },
  {
    agent: "Catalog Agent",
    userName: "Riley Kim",
    input:
      '{"query":"stale_datasets","filters":{"lastUpdatedDaysAgo":{"gte":90}},"sort":[{"field":"last_updated_at","direction":"asc"}]}',
    output: "Found 12 stale datasets and generated recommendations.",
    efforts: [
      {
        id: "reasoning-1",
        type: "reasoning",
        label: "Identify staleness criteria",
        content:
          "User asks for stale datasets using a >=90 day freshness threshold. I will query metadata sorted by oldest update first and summarize findings.",
      },
      {
        id: "tool-call-1",
        type: "tool_call",
        label: "Search catalog",
        toolName: "catalog_search_tool",
        input:
          '{"filters":{"lastUpdatedDaysAgo":{"gte":90}},"sort":[{"field":"last_updated_at","direction":"asc"}],"limit":50}',
      },
      {
        id: "tool-result-1",
        type: "tool_result",
        label: "Catalog results",
        toolName: "catalog_search_tool",
        output: '{"count":12,"topDatasets":["customer_churn_monthly","orders_2019_archive"]}',
        status: "success",
      },
      {
        id: "assistant-result-1",
        type: "assistant_result",
        label: "User-facing response",
        content: "Found 12 stale datasets and generated recommendations.",
      },
    ],
    metadata: "EVALUATION",
    toolCallCount: 1,
    callerIdentity: "session | user_id: 108",
    llm: "gpt-5",
    tokens: 804,
    functions: "catalog_search_tool()",
    configuration: "default",
    responseType: "text",
    reasoningEffort: "medium",
    reasoningSummary: "detailed",
    verbosity: "high",
  },
];

export const MOCK_ROWS: LogTableRow[] = Array.from({ length: 100 }, (_, index) => {
  const base = BASE_ROWS[index % BASE_ROWS.length]!;
  const createdAt = new Date("2025-02-12T20:00:00Z");
  createdAt.setMinutes(createdAt.getMinutes() - index * 37);

  return {
    ...base,
    message: buildLegacyMessage(base.efforts),
    id: `log-${index + 1}`,
    responseId: `resp_${String(index + 1).padStart(6, "0")}`,
    timestamp: createdAt.toISOString(),
  };
});

export function getLogById(logId: string) {
  return MOCK_ROWS.find((row) => row.id === logId) ?? null;
}
