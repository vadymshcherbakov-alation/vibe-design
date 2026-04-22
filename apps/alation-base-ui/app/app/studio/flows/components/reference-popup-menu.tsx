"use client";
import { Box, Typography, MenuItem, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isParagraphNode,
} from "lexical";
import { $createReferenceDecoratorNode } from "./lexical-string-editor";
import { ItemTypeIcon } from "./item-type-icon";
import { TypeBadge } from "./type-badge";
import { Variable } from "lucide-react";

// Re-export the function for use in this component
export { $createReferenceDecoratorNode };

export interface UpstreamOutput {
  nodeId: string;
  nodeLabel: string;
  nodeType?: "Tool" | "Agent" | "Start";
  outputName: string;
  outputType: string;
  outputDescription: string;
}

interface ReferencePopupMenuProps {
  upstreamOutputs: UpstreamOutput[];
  onClose: () => void;
  editor: any;
  openedFromButton?: boolean;
}

export function ReferencePopupMenu({
  upstreamOutputs,
  onClose,
  editor,
  openedFromButton = false,
}: ReferencePopupMenuProps) {
  const theme = useTheme();

  const handleSelect = (output: {
    nodeId: string;
    nodeLabel: string;
    outputName: string;
  }) => {
    const reference = `{{${output.nodeLabel}.${output.outputName}}}`;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (openedFromButton) {
          // If opened from button, move cursor to end and append
          const root = $getRoot();
          const paragraph = root.getFirstChild();
          if (paragraph && $isParagraphNode(paragraph)) {
            const lastChild = paragraph.getLastChild();
            if (lastChild) {
              lastChild.selectEnd();
            } else {
              paragraph.selectEnd();
            }
            // Insert the reference as a decorator node at the end
            const referenceNode = $createReferenceDecoratorNode(reference);
            selection.insertNodes([referenceNode]);
          }
        } else {
          // If opened from typing {, remove the { character and insert reference
          selection.deleteCharacter(true);
          // Insert the reference as a decorator node
          const referenceNode = $createReferenceDecoratorNode(reference);
          selection.insertNodes([referenceNode]);
        }
      }
    });
    onClose();
  };

  if (upstreamOutputs.length === 0) {
    return (
      <Box
        sx={{
          padding: "16px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          No reference available
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {upstreamOutputs.reduce((acc, output, index) => {
        const nodeId = output.nodeId;
        const lastNodeId =
          index > 0 ? upstreamOutputs[index - 1]?.nodeId : null;

        if (lastNodeId !== nodeId) {
          // New node group - add divider and header
          if (index > 0) {
            acc.push(<Box key={`divider-${nodeId}`} sx={{ height: "16px" }} />);
          }
          acc.push(
            <Box
              key={`header-${nodeId}`}
              sx={{
                px: "12px",
                py: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {output.nodeType && (
                <ItemTypeIcon type={output.nodeType} size={16} />
              )}
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                {output.nodeLabel}
              </Typography>
            </Box>
          );
        }

        // Add output option
        acc.push(
          <MenuItem
            key={`${nodeId}-${output.outputName}`}
            onClick={() => handleSelect(output)}
            sx={{
              py: "8px",
              px: "12px",
              pl: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "2px",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Variable
                  size={16}
                  style={{ color: theme.palette.text.disabled }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                >
                  {output.outputName}
                </Typography>
              </Box>
              <TypeBadge type={output.outputType} />
            </Box>
          </MenuItem>
        );

        return acc;
      }, [] as React.ReactNode[])}
    </>
  );
}
