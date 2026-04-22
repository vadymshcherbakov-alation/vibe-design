"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function SectionCard({
  title,
  footer,
  children,
}: {
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: "24px", py: "20px" }}>
        {title && (
          <Typography variant="h3" sx={{ mb: 2, color: theme.palette.text.primary }}>
            {title}
          </Typography>
        )}
        {children}
      </Box>
      {footer && (
        <Box
          sx={{
            px: "24px",
            py: "12px",
            borderTop: `1px solid ${theme.palette.neutral[300]}`,
            backgroundColor: theme.palette.neutral[50],
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
}

export function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 2, alignItems: "flex-start", mb: "24px" }}>
      <Typography
        variant="body2"
        sx={{ textAlign: "right", pt: "9px", color: "text.primary", fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Box>{children}</Box>
    </Box>
  );
}
