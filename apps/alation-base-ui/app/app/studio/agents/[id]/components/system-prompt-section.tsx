"use client";

import { Box, Typography, IconButton, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { SAMPLE_SYSTEM_PROMPT } from "../../../constants";
import { useEditMode } from "../edit-mode-context";

const headingComponent = ({ children }: { children?: React.ReactNode }) => (
  <Typography variant="subtitle2" component="p" sx={{ mt: "0.75em", mb: "0.25em" }}>
    {children}
  </Typography>
);

const markdownComponents: Components = {
  h1: () => null,
  h2: headingComponent,
  h3: headingComponent,
  h4: headingComponent,
  h5: headingComponent,
  h6: headingComponent,
};

export function SystemPromptSection() {
  const theme = useTheme();
  const { isEditMode } = useEditMode();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promptContent, setPromptContent] = useState(SAMPLE_SYSTEM_PROMPT);

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
        }}
      >
        <ReactMarkdown components={markdownComponents} skipHtml>
          {promptContent}
        </ReactMarkdown>
      </Box>
    </Box>
  );
}
