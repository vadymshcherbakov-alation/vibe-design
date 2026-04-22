"use client";
import { Box, Typography, IconButton, Chip, Button } from "@mui/material";
import { X, ExternalLink } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { EvalQuestion } from "./types";

interface QuestionDetailPanelProps {
  question: EvalQuestion;
  onClose: () => void;
}

// Simple SQL syntax highlighter
function highlightSQL(sql: string) {
  const keywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "AS",
    "AND",
    "OR",
    "JOIN",
    "LEFT",
    "RIGHT",
    "INNER",
    "OUTER",
    "ON",
    "GROUP",
    "BY",
    "ORDER",
    "HAVING",
    "LIMIT",
    "OFFSET",
    "INSERT",
    "UPDATE",
    "DELETE",
    "CREATE",
    "DROP",
    "ALTER",
    "TABLE",
    "INDEX",
    "VIEW",
    "INTO",
    "VALUES",
    "SET",
    "NULL",
    "NOT",
    "IN",
    "LIKE",
    "ILIKE",
    "BETWEEN",
    "EXISTS",
    "CASE",
    "WHEN",
    "THEN",
    "ELSE",
    "END",
    "DISTINCT",
    "COUNT",
    "SUM",
    "AVG",
    "MIN",
    "MAX",
    "CAST",
    "COALESCE",
    "UNION",
    "ALL",
    "ASC",
    "DESC",
  ];

  const lines = sql.split("\n");

  return lines.map((line, lineIndex) => {
    // Tokenize the line
    const tokens: { type: string; value: string }[] = [];
    let remaining = line;

    while (remaining.length > 0) {
      // Check for string literals (single quotes)
      const stringMatch = remaining.match(/^'[^']*'/);
      if (stringMatch) {
        tokens.push({ type: "string", value: stringMatch[0] });
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }

      // Check for keywords
      const keywordMatch = remaining.match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (keywordMatch) {
        const word = keywordMatch[0];
        if (keywords.includes(word.toUpperCase())) {
          tokens.push({ type: "keyword", value: word });
        } else {
          tokens.push({ type: "identifier", value: word });
        }
        remaining = remaining.slice(word.length);
        continue;
      }

      // Check for numbers
      const numberMatch = remaining.match(/^\d+(\.\d+)?/);
      if (numberMatch) {
        tokens.push({ type: "number", value: numberMatch[0] });
        remaining = remaining.slice(numberMatch[0].length);
        continue;
      }

      // Everything else (operators, punctuation, whitespace)
      if (remaining[0]) {
        tokens.push({ type: "other", value: remaining[0] });
        remaining = remaining.slice(1);
      } else {
        break;
      }
    }

    return {
      lineNumber: lineIndex + 1,
      tokens,
    };
  });
}

export function QuestionDetailPanel({
  question,
  onClose,
}: QuestionDetailPanelProps) {
  const theme = useTheme();

  // Generate a slightly different "actual" SQL for demo purposes
  const expectedSQL = question.sql;
  const actualSQL = question.sql
    .replace("ILIKE", "=")
    .replace(/'%[^%]*%'/g, (match) => {
      const inner = match.slice(2, -2);
      return `'${inner.charAt(0).toUpperCase()}${inner.slice(1)}'`;
    });

  const expectedLines = highlightSQL(expectedSQL);
  const actualLines = highlightSQL(actualSQL);

  const getTokenColor = (type: string) => {
    switch (type) {
      case "keyword":
        return "#9C27B0"; // Purple for keywords
      case "string":
        return "#E91E63"; // Pink for strings
      case "number":
        return "#2196F3"; // Blue for numbers
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        borderLeft: `1px solid ${theme.palette.neutral[300]}`,
        overflow: "hidden",
      }}
    >
      {/* Panel Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          p: "20px",
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            flex: 1,
            pr: "12px",
            lineHeight: 1.4,
          }}
        >
          {question.question}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ flexShrink: 0 }}>
          <X size={16} />
        </IconButton>
      </Box>

      {/* Panel Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Assessment */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              Assessment
            </Typography>
            <Chip
              label={question.passed ? "Pass" : "Fail"}
              size="small"
              sx={{
                height: "20px",
                fontSize: "11px",
                fontWeight: "500",
                backgroundColor: question.passed
                  ? theme.palette.green[200]
                  : theme.palette.red[200],
                color: question.passed
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                width: "fit-content",
                border: "none",
              }}
            />
          </Box>

          {/* Reasoning */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: "8px",
                color: theme.palette.text.secondary,
              }}
            >
              Reasoning
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: theme.palette.text.primary,
                lineHeight: 1.5,
              }}
            >
              {question.passed
                ? "The generated SQL table matches the reference SQL table."
                : "The generated SQL does not match the expected output. There are differences in the query structure or results."}
            </Typography>
          </Box>

          {/* SQL Comparison Section */}
          <Box>
            {/* SQL Header Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: "12px",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  Expected SQL
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  Actual SQL
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ExternalLink size={14} />}
                  sx={{
                    textTransform: "none",
                    fontSize: "12px",
                    height: "28px",
                    "& .MuiButton-endIcon": {
                      marginLeft: "4px",
                    },
                  }}
                >
                  View Chat
                </Button>
              </Box>
            </Box>

            {/* SQL Code Blocks */}
            <Box
              sx={{
                display: "flex",
                gap: "16px",
              }}
            >
              {/* Expected SQL */}
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: theme.palette.neutral[50],
                  borderRadius: "8px",
                  border: `1px solid ${theme.palette.neutral[300]}`,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    p: "12px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  {expectedLines.map((line) => (
                    <Box key={line.lineNumber}>
                      {line.tokens.map((token, idx) => (
                        <span
                          key={idx}
                          style={{
                            color: getTokenColor(token.type),
                          }}
                        >
                          {token.value}
                        </span>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Actual SQL */}
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: theme.palette.neutral[50],
                  borderRadius: "8px",
                  border: `1px solid ${theme.palette.neutral[300]}`,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    p: "12px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  {actualLines.map((line) => (
                    <Box key={line.lineNumber}>
                      {line.tokens.map((token, idx) => (
                        <span
                          key={idx}
                          style={{
                            color: getTokenColor(token.type),
                          }}
                        >
                          {token.value}
                        </span>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
