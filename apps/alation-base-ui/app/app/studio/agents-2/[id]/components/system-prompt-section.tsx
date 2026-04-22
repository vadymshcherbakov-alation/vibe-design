"use client";

import { Box, Typography, IconButton, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SAMPLE_SYSTEM_PROMPT } from "../../../constants";
import { useEditMode } from "../edit-mode-context";

export function SystemPromptSection() {
  const theme = useTheme();
  const { isEditMode } = useEditMode();
  const promptInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null,
  );
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promptContent, setPromptContent] = useState(SAMPLE_SYSTEM_PROMPT);

  useEffect(() => {
    if (isEditMode) {
      promptInputRef.current?.focus();
    }
  }, [isEditMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEditMode) {
    return (
      <TextField
        fullWidth
        multiline
        minRows={10}
        inputRef={promptInputRef}
        value={promptContent}
        onChange={(e) => setPromptContent(e.target.value)}
        placeholder="Enter system prompt..."
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            fontFamily: "inherit",
            fontSize: "13px",
            lineHeight: 1.7,
          },
          "& .MuiInputBase-input": {
            fontFamily: "inherit",
          },
        }}
      />
    );
  }

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        p: "12px",
        //backgroundColor: theme.palette.neutral[50],
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
            fontFamily: "monospace",
          },
          "& pre": {
            fontFamily: "monospace",
            fontSize: "12px",
            overflow: "auto",
            mt: "12px",
            mb: "12px",
            padding: "8px 12px",
            backgroundColor: theme.palette.neutral[50],
            borderRadius: "6px",
            border: `1px solid ${theme.palette.neutral[100]}`,
          },
          "& pre code": {
            padding: 0,
            backgroundColor: "transparent",
            border: "none",
            margin: 0,
          },
          code: {
            fontFamily: "monospace",
            fontSize: "12px",
            padding: "2px 6px",
            backgroundColor: theme.palette.neutral[50],
            borderRadius: "6px",
            border: `1px solid ${theme.palette.neutral[100]}`,
          },
          "& h1, & h2, & h3, & h4": {
            fontWeight: 600,
            fontSize: "13px",
            m: "0.75em 0",
          },
          h1: {
            fontSize: "16px",
          },
          h2: {
            fontSize: "14px",
          },
          h3: {
            fontSize: "13px",
          },
          h4: {
            fontSize: "12px",
          },

          strong: {
            fontWeight: 500,
          },
        }}
      >
        <ReactMarkdown disallowedElements={["hr"]}>
          {promptContent}
        </ReactMarkdown>
      </Box>
    </Box>
  );
}
