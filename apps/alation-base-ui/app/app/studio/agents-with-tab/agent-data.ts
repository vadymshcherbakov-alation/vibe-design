// Agent interface and mock data shared between agent detail layout and pages

export interface AgentParameter {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string | number;
}

export interface AgentToolInput {
  name: string;
  toolName: string;
  parameters: AgentParameter[];
}

export interface AgentTool {
  id: string;
  name: string;
  type: "Tool" | "Agent";
}

export interface AgentModel {
  provider: string;
  name: string;
}

export interface Agent {
  id: string;
  name: string;
  type: "conversational" | "task" | "workflow";
  category: "native" | "custom";
  creator: string;
  access: ("mcp" | "rest")[];
  description: string;
  createdAt: string;
  status: "active" | "inactive" | "draft";
  // Extended fields for agent details
  model?: AgentModel;
  inputs?: AgentParameter[];
  toolInputs?: AgentToolInput[];
  outputs?: AgentParameter[];
  systemPrompt?: string;
  tools?: AgentTool[];
}

const generateMockAgents = (): Agent[] => {
  const baseDate = new Date();
  const agents: Agent[] = [
    {
      id: "1",
      name: "Data Analyst Agent",
      type: "conversational",
      category: "native",
      creator: "Alation",
      access: ["mcp", "rest"],
      description: "An agent for querying SQL databases.",
      createdAt: new Date(
        baseDate.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      model: {
        provider: "OpenAI",
        name: "GPT-5",
      },
      inputs: [{ name: "message", type: "string", required: true }],
      toolInputs: [
        {
          name: "Data Product Search",
          toolName: "data_product_search",
          parameters: [{ name: "marketplace_id", type: "string" }],
        },
        {
          name: "Chat Generation",
          toolName: "chat_generation",
          parameters: [
            { name: "sql", type: "string" },
            { name: "data_product_id", type: "string" },
          ],
        },
        {
          name: "Report Search",
          toolName: "report_search",
          parameters: [{ name: "limit", type: "Integer", defaultValue: 20 }],
        },
      ],
      outputs: [{ name: "response", type: "string" }],
      systemPrompt: `You are a natural language question-to-SQL evaluation set management agent.
Your primary responsibilities include:
1. Creating new evaluation questions: Generates relevant questions and SQL answers that can be used to evaluate a text-to-SQL generating model
2. Auditing existing questions: Review and validate existing evaluation questions for quality, correctness, and coverage. Determine if any questions need to be updated or removed.

Each question must be a question a data admin or analyst would ask. E.g. don't have a question like "how many rows in my data". Each question needs to be asking about some business information.
You have tools available to:
• Look at existing eval questions (get_sql_evaluations)
• Get details of a specific evaluation case by ID (get_sql_evaluation_case)
• Update an evaluation case by ID (update_sql_evaluation_case)
• Delete an evaluation case by ID (delete_sql_evaluation_case)
• Look at the data schema (get_data_schema)
• Query the data (sql_execution)

Always remind the user to check the eval set using the get_sql_evaluations tool first.`,
      tools: [
        { id: "tool-1", name: "analyze_catalog_question", type: "Tool" },
        { id: "tool-2", name: "Get Data Schema", type: "Tool" },
        { id: "tool-3", name: "Get SQL Evaluation Case", type: "Tool" },
        { id: "tool-4", name: "List Assets", type: "Tool" },
        { id: "tool-5", name: "Retrieve Asset", type: "Tool" },
      ],
    },
    {
      id: "2",
      name: "Query Assistant",
      type: "task",
      category: "native",
      creator: "Alation",
      access: ["mcp"],
      description:
        "Helps users write and optimize SQL queries based on catalog metadata.",
      createdAt: new Date(
        baseDate.getTime() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      model: { provider: "OpenAI", name: "GPT-4o" },
      inputs: [{ name: "query", type: "string", required: true }],
      outputs: [{ name: "optimized_query", type: "string" }],
      tools: [
        { id: "tool-1", name: "Query Optimizer", type: "Tool" },
        { id: "tool-2", name: "Schema Analyzer", type: "Tool" },
      ],
    },
    {
      id: "3",
      name: "Documentation Bot",
      type: "conversational",
      category: "native",
      creator: "Alation",
      access: ["rest"],
      description:
        "Automatically generates documentation for data assets and maintains metadata.",
      createdAt: new Date(
        baseDate.getTime() - 20 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      model: { provider: "Anthropic", name: "Claude 3.5" },
      inputs: [{ name: "asset_id", type: "string", required: true }],
      outputs: [{ name: "documentation", type: "string" }],
      tools: [{ id: "tool-1", name: "Doc Generator", type: "Tool" }],
    },
    {
      id: "4",
      name: "Data Quality Monitor",
      type: "workflow",
      category: "native",
      creator: "Alation",
      access: ["mcp", "rest"],
      description:
        "Monitors data quality metrics and alerts users about anomalies.",
      createdAt: new Date(
        baseDate.getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "inactive",
      model: { provider: "OpenAI", name: "GPT-4o" },
      inputs: [{ name: "dataset_id", type: "string", required: true }],
      outputs: [{ name: "quality_report", type: "object" }],
      tools: [
        { id: "tool-1", name: "Quality Checker", type: "Tool" },
        { id: "tool-2", name: "Alert Sender", type: "Tool" },
      ],
    },
    {
      id: "5",
      name: "Governance Assistant",
      type: "task",
      category: "custom",
      creator: "John Smith",
      access: ["mcp"],
      description:
        "Assists with data governance tasks like access requests and policy enforcement.",
      createdAt: new Date(
        baseDate.getTime() - 12 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      model: { provider: "Google", name: "Gemini Pro" },
      inputs: [{ name: "request", type: "string", required: true }],
      outputs: [{ name: "decision", type: "string" }],
      tools: [{ id: "tool-1", name: "Policy Engine", type: "Tool" }],
    },
    {
      id: "6",
      name: "Lineage Explorer",
      type: "conversational",
      category: "custom",
      creator: "Sarah Johnson",
      access: ["rest"],
      description:
        "Helps users understand data lineage and trace data flows across systems.",
      createdAt: new Date(
        baseDate.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "draft",
      model: { provider: "OpenAI", name: "GPT-5" },
      inputs: [{ name: "table_name", type: "string", required: true }],
      outputs: [{ name: "lineage_graph", type: "object" }],
      tools: [{ id: "tool-1", name: "Lineage Tracer", type: "Tool" }],
    },
    {
      id: "7",
      name: "Report Generator",
      type: "workflow",
      category: "custom",
      creator: "Michael Chen",
      access: ["mcp", "rest"],
      description:
        "Generates automated reports based on data catalog information.",
      createdAt: new Date(
        baseDate.getTime() - 8 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      model: { provider: "Anthropic", name: "Claude 3.5" },
      inputs: [{ name: "report_type", type: "string", required: true }],
      outputs: [{ name: "report", type: "string" }],
      tools: [
        { id: "tool-1", name: "Report Builder", type: "Tool" },
        { id: "tool-2", name: "Chart Generator", type: "Tool" },
      ],
    },
    {
      id: "8",
      name: "Metadata Enricher",
      type: "task",
      category: "custom",
      creator: "Emily Davis",
      access: ["mcp"],
      description: "Enriches catalog metadata using AI-powered suggestions.",
      createdAt: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      model: { provider: "OpenAI", name: "GPT-4o" },
      inputs: [{ name: "asset_id", type: "string", required: true }],
      outputs: [{ name: "enriched_metadata", type: "object" }],
      tools: [{ id: "tool-1", name: "Metadata Analyzer", type: "Tool" }],
    },
    {
      id: "9",
      name: "Search Optimizer",
      type: "workflow",
      category: "custom",
      creator: "John Smith",
      access: ["rest"],
      description:
        "Optimizes catalog search results based on user behavior and relevance.",
      createdAt: new Date(
        baseDate.getTime() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "inactive",
      model: { provider: "Google", name: "Gemini Pro" },
      inputs: [{ name: "search_query", type: "string", required: true }],
      outputs: [{ name: "ranked_results", type: "array" }],
      tools: [{ id: "tool-1", name: "Relevance Scorer", type: "Tool" }],
    },
    {
      id: "10",
      name: "Compliance Checker",
      type: "task",
      category: "custom",
      creator: "Sarah Johnson",
      access: ["mcp", "rest"],
      description:
        "Validates data assets against compliance requirements and policies.",
      createdAt: new Date(
        baseDate.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "draft",
      model: { provider: "OpenAI", name: "GPT-5" },
      inputs: [{ name: "asset_id", type: "string", required: true }],
      outputs: [{ name: "compliance_status", type: "boolean" }],
      tools: [
        { id: "tool-1", name: "Compliance Validator", type: "Tool" },
        { id: "tool-2", name: "Policy Checker", type: "Tool" },
      ],
    },
  ];
  return agents;
};

export const getAgentById = (id: string): Agent | null => {
  const agents = generateMockAgents();
  return agents.find((agent) => agent.id === id) || null;
};
