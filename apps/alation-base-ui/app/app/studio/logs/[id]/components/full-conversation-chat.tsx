"use client";

import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Check, ChevronDown, ChevronUp, Code, Copy, X } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface ConversationTurn {
  id: string;
  userMessage: string;
  thinkingTitle: string;
  thinkingBody: string[];
  statusLine: string;
  response: string;
}

const MOCK_TURNS: ConversationTurn[] = [
  {
    id: "turn-1",
    userMessage:
      "Analyze Superstore sales and profit trends by region for the last 12 months.",
    thinkingTitle: "Planning regional trend analysis",
    thinkingBody: [
      "I should group sales and profit by region and month to identify trend direction and margin quality.",
      "After that, I can summarize strongest and weakest regions with a short recommendation list.",
    ],
    statusLine: "Calling execute_query",
    response:
      "West and East lead total revenue, while West maintains the strongest profit margin consistency over the period.",
  },
  {
    id: "turn-2",
    userMessage:
      "Now compare category-level performance and call out discount-related risk.",
    thinkingTitle: "Comparing category performance",
    thinkingBody: [
      "I need category-level sales, profit, and discount distribution to check if margin erosion aligns with high discount ranges.",
      "I will keep the answer short and highlight categories with unstable margins.",
    ],
    statusLine: "Processing execute_query",
    response:
      "Technology contributes the highest absolute profit; Furniture is more discount-sensitive and shows margin pressure above 20% discount levels.",
  },
  {
    id: "turn-3",
    userMessage:
      "Give me concise next steps for pricing and weekly monitoring.",
    thinkingTitle: "Drafting action plan",
    thinkingBody: [
      "The response should focus on practical guardrails, experimentation, and recurring KPI tracking.",
      "I will provide a short list prioritized by expected impact.",
    ],
    statusLine: "Generating final response",
    response:
      "Set discount guardrails above 20% by sub-category, run pricing tests in weaker regions, and track weekly margin lift by discount band.",
  },
];

export function FullConversationChat() {
  const theme = useTheme();
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [inputModalLabel, setInputModalLabel] = useState("Input");
  const [isJsonSectionHovered, setIsJsonSectionHovered] = useState(false);
  const [isJsonCopied, setIsJsonCopied] = useState(false);
  const [expandedTurns, setExpandedTurns] = useState<Record<string, boolean>>({
    "turn-1": true,
    "turn-2": false,
    "turn-3": false,
  });

  const inputPreviewJson = JSON.stringify(
    {
      sample_request: "superstore_full_conversation",
      filters: {
        date_range: "last_12_months",
        include_regions: ["West", "East", "Central", "South"],
      },
      metrics: ["sales", "profit", "discount_impact", "category_performance"],
    },
    null,
    2,
  );

  const handleOpenInputModal = (label: string) => {
    setInputModalLabel(label);
    setIsInputModalOpen(true);
  };

  const handleToggleTurn = (turnId: string) => {
    setExpandedTurns((prev) => ({ ...prev, [turnId]: !prev[turnId] }));
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(inputPreviewJson);
    setIsJsonCopied(true);
    setTimeout(() => setIsJsonCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {MOCK_TURNS.map((turn) => (
        <Box
          key={turn.id}
          sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* User message */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Box
              sx={{
                maxWidth: "80%",
                px: "16px",
                py: "8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                backgroundColor: theme.palette.neutral[100],
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {turn.userMessage}
              </Typography>
            </Box>
            <Button
              size="small"
              color="inherit"
              variant="text"
              startIcon={<Code size={14} />}
              onClick={() => handleOpenInputModal("Input")}
            >
              Input
            </Button>
          </Box>

          {/* Assistant reasoning and response */}
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              size="small"
              color="inherit"
              variant="text"
              endIcon={
                expandedTurns[turn.id] ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )
              }
              onClick={() => handleToggleTurn(turn.id)}
              sx={{
                textTransform: "none",
                color: theme.palette.text.secondary,
                px: "4px",
                minWidth: "auto",
              }}
            >
              Completed
            </Button>
          </Box>

          <Collapse in={expandedTurns[turn.id]}>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Box
                sx={{
                  maxWidth: "80%",
                  pl: "12px",
                  py: "4px",
                  borderLeft: `2px solid ${"rgb(240, 240, 240)"}`,
                  gap: "16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle1">{turn.thinkingTitle}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    whiteSpace: "pre-wrap",
                    flexDirection: "column",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <p>{turn.thinkingBody[0]}</p>
                  <p>{turn.thinkingBody[1]}</p>
                </Typography>
                <Typography variant="body2">{turn.statusLine}</Typography>
                <Button
                  size="small"
                  color="inherit"
                  variant="text"
                  sx={{ alignSelf: "flex-start", justifyContent: "flex-start" }}
                  startIcon={<Code size={14} />}
                  onClick={() => handleOpenInputModal("Tool Input")}
                >
                  Tool Input
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  variant="text"
                  sx={{ alignSelf: "flex-start", justifyContent: "flex-start" }}
                  startIcon={<Code size={14} />}
                  onClick={() => handleOpenInputModal("Tool Output")}
                >
                  Tool Output
                </Button>
              </Box>
            </Box>
          </Collapse>

          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Box sx={{ maxWidth: "80%", px: "12px", py: "10px", borderRadius: "8px" }}>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {turn.response}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Input details dialog */}
      <Dialog
        open={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2" component="span">
            {inputModalLabel === "Input" ? "Input" : `Input ${inputModalLabel}`}
          </Typography>
          <IconButton onClick={() => setIsInputModalOpen(false)} size="small">
            <X size={16} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            onMouseEnter={() => setIsJsonSectionHovered(true)}
            onMouseLeave={() => setIsJsonSectionHovered(false)}
            sx={{
              position: "relative",
              p: "12px",
              borderRadius: "8px",
              backgroundColor: theme.palette.neutral[50],
            }}
          >
            <IconButton
              size="small"
              onClick={handleCopyJson}
              sx={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "28px",
                height: "28px",
                opacity: isJsonSectionHovered || isJsonCopied ? 1 : 0,
                transition: `opacity ${"150ms"}`,
                color: isJsonCopied
                  ? theme.palette.success.main
                  : theme.palette.text.secondary,
              }}
            >
              {isJsonCopied ? <Check size={16} /> : <Copy size={16} />}
            </IconButton>
            <SyntaxHighlighter
              language="json"
              wrapLongLines
              customStyle={{
                margin: 0,
                background: "transparent",
                color: theme.palette.text.primary,
                textShadow: "none",
                fontSize: "12px",
              }}
              codeTagProps={{ style: { fontFamily: "inherit", textShadow: "none" } }}
            >
              {inputPreviewJson}
            </SyntaxHighlighter>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsInputModalOpen(false)}
            color="inherit"
            variant="text"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
