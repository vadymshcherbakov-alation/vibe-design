"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Chip,
  IconButton,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChevronDown, X } from "lucide-react";
import { PropsWithChildren, ReactNode } from "react";

export interface SearchFilterAccordionProps extends PropsWithChildren {
  readonly title: string;
  readonly uniqueId: string;
  readonly selectedCount?: number;
  readonly onRemoveItem?: () => void;
  readonly defaultExpanded?: boolean;
  readonly titleIcon?: ReactNode;
}

export function SearchFilterAccordion({
  children,
  title,
  uniqueId,
  selectedCount = 0,
  onRemoveItem,
  defaultExpanded = false,
  titleIcon,
}: SearchFilterAccordionProps) {
  const theme = useTheme();

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      variant="outlined"
      sx={{
        borderTopRightRadius: "6px",
        borderTopLeftRadius: "6px",
        "&:before": {
          display: "none",
        },
        "&:not(:last-child)": {
          mb: 0,
        },
        boxShadow: "none",
        "& .MuiButtonBase-root.MuiAccordionSummary-root": {
          minHeight: "44px",
          height: "44px",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={20} />}
        aria-controls={`${uniqueId}-content`}
        id={`${uniqueId}-header`}
        sx={{
          "& .MuiAccordionSummary-content": {
            margin: "0",
            alignItems: "center",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: 1,
          }}
        >
          {titleIcon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: theme.palette.text.secondary,
              }}
            >
              {titleIcon}
            </Box>
          )}
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
          {selectedCount > 0 && (
            <Chip
              label={selectedCount}
              size="small"
              onDelete={onRemoveItem}
              deleteIcon={
                <X
                  size={14}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem?.();
                  }}
                />
              }
              sx={{
                height: "20px",
                fontSize: "11px",
                fontWeight: 500,
                backgroundColor: theme.palette.neutral[100],
                color: theme.palette.text.primary,
                "& .MuiChip-deleteIcon": {
                  color: theme.palette.text.secondary,
                  fontSize: "14px",
                  "&:hover": {
                    color: theme.palette.text.primary,
                  },
                },
              }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: "#ffffff",
          padding: "12px 16px",
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
