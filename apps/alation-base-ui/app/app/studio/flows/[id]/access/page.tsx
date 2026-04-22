"use client";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useFlowEditStore } from "../../store";

export default function AccessPage() {
  const params = useParams();
  const theme = useTheme();
  const { currentFlow, draftFlow } = useFlowEditStore();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const flowId = params.id as string;
  const flowName = currentFlow?.name || "Untitled Flow";
  const inputParameters =
    draftFlow?.startNodeInputs || currentFlow?.startNodeInputs || [];

  // Generate API endpoint URL
  const apiBaseUrl = "https://api.example.com/v1";
  const apiEndpoint = `${apiBaseUrl}/workflows/${flowId}/run`;

  // Generate API token (demo - in real app this would come from auth)
  const apiToken = "wf_live_1234567890abcdefghijklmnopqrstuvwxyz";

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Generate request body example
  const generateRequestBody = () => {
    if (inputParameters.length === 0) {
      return "{}";
    }
    const body: Record<string, unknown> = {};
    inputParameters.forEach((param) => {
      switch (param.type.toLowerCase()) {
        case "string":
          body[param.name] = "example_value";
          break;
        case "number":
        case "int":
        case "integer":
          body[param.name] = 123;
          break;
        case "bool":
        case "boolean":
          body[param.name] = true;
          break;
        case "array":
          body[param.name] = ["item1", "item2"];
          break;
        case "object":
          body[param.name] = { key: "value" };
          break;
        default:
          body[param.name] = "example_value";
      }
    });
    return JSON.stringify(body, null, 2);
  };

  const requestBody = generateRequestBody();

  // cURL example
  const curlExample = `curl -X POST ${apiEndpoint} \\
  -H "Authorization: Bearer ${apiToken}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody}'`;

  // JavaScript example
  const jsExample = `const response = await fetch('${apiEndpoint}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiToken}',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${requestBody}),
});

const data = await response.json();
console.log(data);`;

  // Python example
  const pythonPayload = requestBody
    .replace(/true/g, "True")
    .replace(/false/g, "False");
  const pythonExample = `import requests

url = "${apiEndpoint}"
headers = {
    "Authorization": f"Bearer ${apiToken}",
    "Content-Type": "application/json",
}
payload = ${pythonPayload}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print(data)`;

  // Response example
  const responseExample = {
    run_id: "run_abc123def456",
    status: "queued",
    workflow_id: flowId,
    workflow_name: flowName,
    created_at: "2025-01-15T10:30:00Z",
    estimated_completion: "2025-01-15T10:35:00Z",
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          p: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Header */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: "8px",
            }}
          >
            API Documentation
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            Learn how to call this workflow via API
          </Typography>
        </Box>

        {/* API Endpoint */}
        <Paper
          elevation={0}
          sx={{
            p: "24px",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              mb: "16px",
            }}
          >
            Endpoint
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              p: "12px",
              backgroundColor: theme.palette.neutral[50],
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            <Typography
              sx={{
                flex: 1,
                color: theme.palette.text.primary,
                wordBreak: "break-all",
              }}
            >
              <span style={{ color: theme.palette.text.secondary }}>
                POST
              </span>{" "}
              {apiEndpoint}
            </Typography>
            <Tooltip title={copiedText === "endpoint" ? "Copied!" : "Copy"}>
              <IconButton
                size="small"
                onClick={() => handleCopy(apiEndpoint, "endpoint")}
                sx={{ width: "32px", height: "32px" }}
              >
                {copiedText === "endpoint" ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Authentication */}
        <Paper
          elevation={0}
          sx={{
            p: "24px",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              mb: "16px",
            }}
          >
            Authentication
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: "16px",
            }}
          >
            All API requests require authentication using a Bearer token in the
            Authorization header.
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              p: "12px",
              backgroundColor: theme.palette.neutral[50],
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            <Typography
              sx={{
                flex: 1,
                color: theme.palette.text.primary,
                wordBreak: "break-all",
              }}
            >
              Authorization: Bearer {apiToken}
            </Typography>
            <Tooltip title={copiedText === "token" ? "Copied!" : "Copy"}>
              <IconButton
                size="small"
                onClick={() => handleCopy(apiToken, "token")}
                sx={{ width: "32px", height: "32px" }}
              >
                {copiedText === "token" ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.warning.dark,
              mt: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <AlertCircle size={16} />
            Keep your API token secure and never commit it to version control.
          </Typography>
        </Paper>

        {/* Input Parameters */}
        {inputParameters.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: "24px",
              border: `1px solid ${theme.palette.neutral[300]}`,
              borderRadius: "6px",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
                mb: "16px",
              }}
            >
              Input Parameters
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                      }}
                    >
                      Required
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inputParameters.map((param) => (
                    <TableRow key={param.name}>
                      <TableCell
                        sx={{
                          fontFamily: "monospace",
                          color: theme.palette.text.primary,
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        {param.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        <Chip
                          label={param.type}
                          size="small"
                          sx={{
                            height: "20px",
                            fontSize: "11px",
                            backgroundColor:
                              theme.palette.neutral[50],
                            color: theme.palette.text.secondary,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        {param.description || "—"}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        Yes
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Request Example */}
        <Paper
          elevation={0}
          sx={{
            p: "24px",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: "16px",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
            >
              Request Body
            </Typography>
            <Tooltip title={copiedText === "request" ? "Copied!" : "Copy"}>
              <IconButton
                size="small"
                onClick={() => handleCopy(requestBody, "request")}
                sx={{ width: "32px", height: "32px" }}
              >
                {copiedText === "request" ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              p: "16px",
              backgroundColor: theme.palette.neutral[50],
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "13px",
              overflowX: "auto",
              color: theme.palette.text.primary,
            }}
          >
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {requestBody}
            </pre>
          </Box>
        </Paper>

        {/* Code Examples */}
        <Paper
          elevation={0}
          sx={{
            p: "24px",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              mb: "16px",
            }}
          >
            Code Examples
          </Typography>

          {/* cURL */}
          <Box sx={{ mb: "24px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: "8px",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                cURL
              </Typography>
              <Tooltip title={copiedText === "curl" ? "Copied!" : "Copy"}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(curlExample, "curl")}
                  sx={{ width: "32px", height: "32px" }}
                >
                  {copiedText === "curl" ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              sx={{
                p: "16px",
                backgroundColor:
                  theme.palette.neutral[50],
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "13px",
                overflowX: "auto",
                color: theme.palette.text.primary,
              }}
            >
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {curlExample}
              </pre>
            </Box>
          </Box>

          {/* JavaScript */}
          <Box sx={{ mb: "24px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: "8px",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                JavaScript
              </Typography>
              <Tooltip title={copiedText === "js" ? "Copied!" : "Copy"}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(jsExample, "js")}
                  sx={{ width: "32px", height: "32px" }}
                >
                  {copiedText === "js" ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              sx={{
                p: "16px",
                backgroundColor:
                  theme.palette.neutral[50],
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "13px",
                overflowX: "auto",
                color: theme.palette.text.primary,
              }}
            >
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {jsExample}
              </pre>
            </Box>
          </Box>

          {/* Python */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: "8px",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Python
              </Typography>
              <Tooltip title={copiedText === "python" ? "Copied!" : "Copy"}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(pythonExample, "python")}
                  sx={{ width: "32px", height: "32px" }}
                >
                  {copiedText === "python" ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              sx={{
                p: "16px",
                backgroundColor:
                  theme.palette.neutral[50],
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "13px",
                overflowX: "auto",
                color: theme.palette.text.primary,
              }}
            >
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {pythonExample}
              </pre>
            </Box>
          </Box>
        </Paper>

        {/* Response Example */}
        <Paper
          elevation={0}
          sx={{
            p: "24px",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: "16px",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
            >
              Response
            </Typography>
            <Tooltip title={copiedText === "response" ? "Copied!" : "Copy"}>
              <IconButton
                size="small"
                onClick={() =>
                  handleCopy(JSON.stringify(responseExample, null, 2), "response")
                }
                sx={{ width: "32px", height: "32px" }}
              >
                {copiedText === "response" ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              p: "16px",
              backgroundColor: theme.palette.neutral[50],
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "13px",
              overflowX: "auto",
              color: theme.palette.text.primary,
            }}
          >
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(responseExample, null, 2)}
            </pre>
          </Box>
        </Paper>

        {/* Status Codes */}
        <Paper
          elevation={0}
          sx={{
            p: "24px",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              mb: "16px",
            }}
          >
            Status Codes
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Chip
                label="200"
                size="small"
                sx={{
                  width: "60px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                Success - Workflow run has been queued successfully
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Chip
                label="400"
                size="small"
                sx={{
                  width: "60px",
                  backgroundColor: "#FF9800",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                Bad Request - Invalid request parameters
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Chip
                label="401"
                size="small"
                sx={{
                  width: "60px",
                  backgroundColor: "#F44336",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                Unauthorized - Invalid or missing API token
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Chip
                label="404"
                size="small"
                sx={{
                  width: "60px",
                  backgroundColor: "#F44336",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                Not Found - Workflow does not exist
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Chip
                label="429"
                size="small"
                sx={{
                  width: "60px",
                  backgroundColor: "#FF9800",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                Too Many Requests - Rate limit exceeded
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Chip
                label="500"
                size="small"
                sx={{
                  width: "60px",
                  backgroundColor: "#F44336",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                Internal Server Error - Server error occurred
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
