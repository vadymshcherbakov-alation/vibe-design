"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface EmptyStateProps {
  icon: React.ComponentType<{
    size?: number;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
  }>;
  title: string;
  description: string;
  button?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  button,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        py: "64px",
        px: "24px",
        height: "100%",
        maxHeight: "384px",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <Icon
          width={32}
          height={32}
          style={{
            color: theme.palette.text.secondary,
            fill: theme.palette.text.secondary,
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.primary,
            mt: "8px",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          {description}
        </Typography>
      </Box>
      {button}
    </Box>
  );
}
