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
import {
  atomOneLight,
  github,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MOCK_USER_MESSAGE =
  "Analyze the Superstore dataset to identify key sales and profit trends, evaluate regional and product performance, and determine how discounts impact overall profitability.";

const MOCK_THINKING =
  "Completed. I reviewed regional and category performance, validated margin behavior across discount bands, and prepared a concise recommendation set.";

const MOCK_ASSISTANT_RESPONSE = `Here is a quick summary from the analysis:

- Revenue is strongest in West and East, with West maintaining the healthiest margin.
- Technology contributes the largest absolute profit, while Office Supplies stays more margin-stable.
- Discounts above 20% are the primary driver of low-margin and negative-margin orders.

Recommended next steps:
1. Apply discount guardrails above 20% by sub-category.
2. Run pricing tests in lower-performing regions.
3. Track weekly margin lift by discount band.`;

export function SimpleResponseChat() {
  const theme = useTheme();
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [inputModalLabel, setInputModalLabel] = useState("Input");
  const [isJsonSectionHovered, setIsJsonSectionHovered] = useState(false);
  const [isJsonCopied, setIsJsonCopied] = useState(false);
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(true);

  const inputPreviewJson = JSON.stringify(
    {
      sample_request: "superstore_analysis",
      filters: {
        date_range: "last_12_months",
        include_regions: ["West", "East", "Central", "South"],
      },
      metrics: ["sales", "profit", "discount_impact"],
    },
    null,
    2,
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(inputPreviewJson);
    setIsJsonCopied(true);
    setTimeout(() => setIsJsonCopied(false), 2000);
  };

  const handleOpenInputModal = (label: string) => {
    setInputModalLabel(label);
    setIsInputModalOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
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
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              whiteSpace: "pre-wrap",
            }}
          >
            {MOCK_USER_MESSAGE}
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

      {/* Assistant response */}
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Button
          size="small"
          color="inherit"
          variant="text"
          endIcon={
            isThinkingExpanded ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )
          }
          onClick={() => setIsThinkingExpanded((prev) => !prev)}
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

      <Collapse in={isThinkingExpanded}>
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
              justifyContent: "flex-start",
            }}
          >
            <Typography variant="subtitle1">
              Interpreting product count request
            </Typography>
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
              <p>
                I think the user is asking about the number of unique products
                in the dataset with their question, "how many product do we
                have". To find the answer, I'll use the execute_query tool to
                count distinct "Product ID" since they asked for the product
                count.
              </p>
              <p>
                I could also consider including the distinct count of "Product
                Name". The goal is to run a single query effectively while
                keeping things concise. Now, I'll proceed to execute the query.
              </p>
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.primary }}
            >
              Calling execute_query
            </Typography>
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
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.primary }}
            >
              Processing execute_query
            </Typography>
            <Button
              size="small"
              color="inherit"
              variant="text"
              startIcon={<Code size={14} />}
              onClick={() => handleOpenInputModal("Tool Output")}
              sx={{ alignSelf: "flex-start", justifyContent: "flex-start" }}
            >
              Tool Output
            </Button>
          </Box>
        </Box>
      </Collapse>

      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Box
          sx={{
            maxWidth: "80%",
            px: "12px",
            py: "10px",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              whiteSpace: "pre-wrap",
            }}
          >
            {MOCK_ASSISTANT_RESPONSE}
          </Typography>
        </Box>
      </Box>

      {/* Input JSON modal */}
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
              //style={github}
              wrapLongLines
              customStyle={{
                margin: 0,
                background: "transparent",
                color: theme.palette.text.primary,
                textShadow: "none",
                fontSize: "12px",
              }}
              codeTagProps={{
                style: { fontFamily: "inherit", textShadow: "none" },
              }}
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
