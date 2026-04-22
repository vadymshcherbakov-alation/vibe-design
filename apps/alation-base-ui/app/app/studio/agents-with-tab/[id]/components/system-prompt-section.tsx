"use client";

import { Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { SAMPLE_SYSTEM_PROMPT } from "../../../constants";

export function SystemPromptSection() {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_SYSTEM_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        p: "16px",
        backgroundColor: theme.palette.neutral[50],
        borderRadius: "6px",
      }}
    >
      {/* Copy button - appears on hover */}
      <IconButton
        size="small"
        onClick={handleCopy}
        sx={{
          position: "absolute",
          top: "8px",
          right: "8px",
          opacity: isHovered || copied ? 1 : 0,
          transition: `opacity ${"150ms"}`,
          width: "28px",
          height: "28px",
          color: copied
            ? theme.palette.success.main
            : theme.palette.text.secondary,
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </IconButton>

      {/* Prompt content */}
      <Box
        sx={{
          color: theme.palette.text.primary,
          fontFamily: "inherit",
          fontSize: "13px",
          lineHeight: 1.7,
          "& p": { margin: 0, marginBottom: "0.75em" },
          "& p:last-child": { marginBottom: 0 },
          "& ul, & ol": { paddingLeft: "1.5em", margin: "0.5em 0" },
          "& li": { marginBottom: "0.25em" },
          "& code": {
            backgroundColor: "#ffffff",
            borderRadius: "3px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "0.9em",
            padding: "0.1em 0.35em",
          },
          "& pre": {
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "0.9em",
            margin: "0.75em 0",
            overflow: "auto",
            padding: "0.75em 1em",
          },
          "& pre code": {
            backgroundColor: "transparent",
            padding: 0,
          },
          "& h1, & h2, & h3, & h4": {
            fontWeight: 600,
            lineHeight: 1.4,
            margin: "0.75em 0 0.25em",
          },
          "& strong": { fontWeight: 600 },
          "& blockquote": {
            borderLeft: `3px solid ${theme.palette.neutral[300]}`,
            color: theme.palette.text.secondary,
            margin: "0.5em 0",
            paddingLeft: "1em",
          },
        }}
      >
        <ReactMarkdown>{SAMPLE_SYSTEM_PROMPT}</ReactMarkdown>
      </Box>
    </Box>
  );
}
