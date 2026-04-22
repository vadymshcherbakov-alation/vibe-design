"use client";
import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Plus } from "lucide-react";

const CONNECTOR_HEIGHT = 52;

interface ConnectorLineProps {
  onInsert?: () => void;
  showInsertButton?: boolean;
}

export function ConnectorLine({
  onInsert,
  showInsertButton = true,
}: ConnectorLineProps) {
  const theme = useTheme();
  const connectorColor = theme.palette.neutral[300];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        pl: "40px",
        pt: "4px",
        pb: "4px",
      }}
    >
      <Box
        sx={{
          width: "480px",
          minWidth: "280px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* SVG Connector Line */}
        <svg
          width="20"
          height={CONNECTOR_HEIGHT}
          style={{ overflow: "visible" }}
        >
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="connector-arrow"
              markerWidth="20"
              markerHeight="20"
              viewBox="-10 -10 20 20"
              markerUnits="strokeWidth"
              orient="auto-start-reverse"
              refX="0"
              refY="0"
            >
              <polyline
                stroke={connectorColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                fill="none"
                points="-6,-6 0,0 -6,6"
              />
            </marker>
          </defs>
          {/* Connector path */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={`M10 0L10 ${CONNECTOR_HEIGHT / 2}L10 ${CONNECTOR_HEIGHT}`}
            markerEnd="url(#connector-arrow)"
            style={{
              stroke: connectorColor,
              strokeWidth: 1,
              fill: "none",
            }}
          />
        </svg>

        {/* Insert Node Button - appears on hover */}
        {showInsertButton && (
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onInsert?.();
            }}
            variant="outlined"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "100%",
              opacity: isHovered ? 1 : 0,
            }}
          >
            <Plus size={16} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
