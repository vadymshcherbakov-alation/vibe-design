"use client";
import { Box, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { EvalQuestion } from "./types";

interface QuestionsTableProps {
  questions: EvalQuestion[];
  selectedQuestionId: string | null;
  onSelectQuestion: (questionId: string) => void;
  getDataProductName: (id: string) => string;
}

export function QuestionsTable({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  getDataProductName,
}: QuestionsTableProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: selectedQuestionId ? "0 0 40%" : 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRight: selectedQuestionId
          ? `1px solid ${theme.palette.neutral[300]}`
          : "none",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: "24px",
          pt: "0",
        }}
      >
        {/* Questions Table */}
        <Box
          sx={{
            borderRadius: "8px",
            "& table tbody tr": {
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgb(252, 252, 252)",
              },
            },
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            {/* Table Header */}
            <Box
              component="thead"
              sx={{
                backgroundColor: "#ffffff",
              }}
            >
              <tr>
                <th
                  style={{
                    padding: "12px",
                    borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    textAlign: "left",
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Status
                  </div>
                </th>
                <th
                  style={{
                    padding: "12px",
                    borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    textAlign: "left",
                    cursor: "pointer",
                    userSelect: "none",
                    width: "auto",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Question
                  </div>
                </th>
                {/* Data Product Header - Hidden when panel is open */}
                {!selectedQuestionId && (
                  <th
                    style={{
                      padding: "12px",
                      borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                      textAlign: "left",
                      width: "250px",
                      minWidth: "250px",
                      maxWidth: "250px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Data Product
                    </div>
                  </th>
                )}
              </tr>
            </Box>

            {/* Table Body */}
            <tbody>
              {questions.map((question) => (
                <tr
                  key={question.id}
                  onClick={() => onSelectQuestion(question.id)}
                  style={{
                    backgroundColor:
                      selectedQuestionId === question.id
                        ? theme.palette.neutral[50]
                        : "transparent",
                  }}
                >
                  {/* Status Cell */}
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                      fontSize: "13px",
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                    }}
                  >
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
                        "&:hover": {
                          backgroundColor: question.passed
                            ? theme.palette.green[200]
                            : theme.palette.red[200],
                        },
                      }}
                    />
                  </td>

                  {/* Question Cell */}
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                      fontSize: "13px",
                      color: theme.palette.text.primary,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        color: theme.palette.text.primary,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        minWidth: 0,
                      }}
                    >
                      {question.question}
                    </div>
                  </td>

                  {/* Data Product Cell - Hidden when panel is open */}
                  {!selectedQuestionId && (
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        fontSize: "13px",
                        color: theme.palette.text.secondary,
                        width: "250px",
                        minWidth: "250px",
                        maxWidth: "250px",
                      }}
                    >
                      <Chip
                        label={getDataProductName(question.dataProductId)}
                        size="small"
                        sx={{
                          height: "20px",
                          fontSize: "11px",
                          fontWeight: "500",
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                          color: theme.palette.text.secondary,
                        }}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
}
