"use client";
import {
  Box,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  Popover,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRef, useState, useEffect, useMemo } from "react";
import { Variable, Maximize, X } from "lucide-react";
import { TypeBadge } from "./type-badge";
import { LexicalStringEditor } from "./lexical-string-editor";
import { LexicalStringEditorModal } from "./lexical-string-editor-modal";
import { ReferenceBadge } from "./reference-badge";
import { ItemTypeIcon } from "./item-type-icon";
import { useFlowEditStore } from "../store/useFlowEditStore";
import type { UpstreamOutput } from "./reference-popup-menu";

interface ParameterInputFieldProps {
  name: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  currentNodeId?: string;
}

export function ParameterInputField({
  name,
  type,
  value,
  onChange,
  placeholder,
  description,
  currentNodeId,
}: ParameterInputFieldProps) {
  const theme = useTheme();
  const { draftFlow, currentFlow } = useFlowEditStore();
  const openPopupRef = useRef<((anchorEl?: HTMLElement | null) => void) | null>(
    null
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalValue, setModalValue] = useState(value);
  const [referenceMenuOpen, setReferenceMenuOpen] = useState(false);
  const [referenceMenuAnchor, setReferenceMenuAnchor] =
    useState<HTMLElement | null>(null);

  // Check if value is a reference (starts with {{ and ends with }})
  const isReference = useMemo(() => {
    if (!value || typeof value !== "string") return false;
    return value.startsWith("{{") && value.endsWith("}}");
  }, [value]);

  // Get all nodes from store
  const allNodes = useMemo(() => {
    return draftFlow?.steps || currentFlow?.steps || [];
  }, [draftFlow?.steps, currentFlow?.steps]);

  // Calculate upstream nodes and their outputs
  const upstreamOutputs = useMemo(() => {
    if (!currentNodeId) {
      return [];
    }

    // If current node is start, no upstream nodes
    if (currentNodeId === "start") {
      return [];
    }

    // Extract outputs from upstream nodes
    const outputs: UpstreamOutput[] = [];

    // Add start node inputs FIRST as available outputs
    // (start node inputs are available to all downstream nodes)
    const startNodeInputs =
      draftFlow?.startNodeInputs || currentFlow?.startNodeInputs || [];
    if (startNodeInputs.length > 0) {
      startNodeInputs.forEach((input) => {
        outputs.push({
          nodeId: "start",
          nodeLabel: "Start",
          nodeType: "Start" as const,
          outputName: input.name,
          outputType: input.type,
          outputDescription: input.description || "",
        });
      });
    }

    // Find current node index to determine upstream nodes
    const currentNodeIndex = allNodes.findIndex(
      (node) => node.id === currentNodeId
    );

    // Only add upstream node outputs if current node was found in the flow
    if (currentNodeIndex > 0) {
      // Get all nodes before the current node (upstream)
      const upstreamNodes = allNodes.slice(0, currentNodeIndex);

      // Add outputs from upstream nodes
      upstreamNodes.forEach((node) => {
        if (node.outputParameters && node.outputParameters.length > 0) {
          node.outputParameters.forEach((output) => {
            outputs.push({
              nodeId: node.id,
              nodeLabel: node.label,
              nodeType: (node as any).type as
                | "Tool"
                | "Agent"
                | "Start"
                | undefined,
              outputName: output.name,
              outputType: output.type,
              outputDescription: output.description,
            });
          });
        }
      });
    }

    return outputs;
  }, [allNodes, currentNodeId, draftFlow, currentFlow]);

  const handleOpenPopup = () => {
    if (openPopupRef.current) {
      // Pass the button element as anchor
      openPopupRef.current(buttonRef.current);
    }
  };

  const handleOpenModal = () => {
    setModalValue(value);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveModal = () => {
    onChange(modalValue);
    setModalOpen(false);
  };

  const handleOpenReferenceMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setReferenceMenuAnchor(event.currentTarget);
    setReferenceMenuOpen(true);
  };

  const handleCloseReferenceMenu = () => {
    setReferenceMenuOpen(false);
    setReferenceMenuAnchor(null);
  };

  const handleSelectReference = (output: UpstreamOutput) => {
    const reference = `{{${output.nodeLabel}.${output.outputName}}}`;
    onChange(reference);
    handleCloseReferenceMenu();
  };

  const handleClearReference = () => {
    onChange("");
  };

  // Sync modal value when external value changes (but not when modal is open)
  useEffect(() => {
    if (!modalOpen) {
      setModalValue(value);
    }
  }, [value, modalOpen]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Top - Parameter Name + Type + Buttons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side - Parameter Name + Type */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Parameter Name */}
          {description ? (
            <Tooltip title={description} placement="top" enterDelay={300}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.palette.text.primary,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    height: "1px",
                    backgroundImage: `repeating-linear-gradient(to right, ${theme.palette.text.disabled} 0, ${theme.palette.text.disabled} 1px, transparent 1px, transparent 3px, ${theme.palette.text.disabled} 3px, ${theme.palette.text.disabled} 4px)`,
                    backgroundPosition: "center center",
                    backgroundSize: "4px 1px",
                  },
                }}
              >
                {name}
              </Typography>
            </Tooltip>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              {name}
            </Typography>
          )}
          {/* Type Badge */}
          <TypeBadge type={type} />
        </Box>

        {/* Right side - Action Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {type === "string" ? (
            <>
              <Tooltip
                title="Insert upstream output"
                arrow
                placement="top"
                disableInteractive
              >
                <IconButton
                  ref={buttonRef}
                  size="small"
                  onClick={handleOpenPopup}
                >
                  <Variable size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open in full screen editor" arrow placement="top">
                <IconButton size="small" onClick={handleOpenModal}>
                  <Maximize size={16} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip
              title="Insert upstream output"
              arrow
              placement="top"
              disableInteractive
            >
              <IconButton size="small" onClick={handleOpenReferenceMenu}>
                <Variable size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      {/* Bottom - Input Field */}
      {type === "string" ? (
        <LexicalStringEditor
          value={value}
          onChange={onChange}
          currentNodeId={currentNodeId}
          onOpenPopupRef={openPopupRef}
        />
      ) : isReference ? (
        // Show reference badge when value is a reference
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            p: "8px 12px",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            minHeight: "40px",
          }}
        >
          <ReferenceBadge referenceText={value} />
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Remove binding" arrow placement="top">
            <IconButton
              size="small"
              onClick={handleClearReference}
              sx={{
                width: "24px",
                height: "24px",
              }}
            >
              <X size={14} />
            </IconButton>
          </Tooltip>
        </Box>
      ) : type === "bool" || type === "boolean" || type === "Boolean" ? (
        <FormControl fullWidth size="small">
          <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            displayEmpty
            disabled={isReference}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.disabled }}
                  >
                    Select
                  </Typography>
                );
              }
              return selected;
            }}
          >
            <MenuItem value="true">true</MenuItem>
            <MenuItem value="false">false</MenuItem>
          </Select>
        </FormControl>
      ) : (
        <TextField
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            // For number type, only allow numeric input (including decimals and negative)
            if (type === "number" || type === "Number") {
              // Allow empty string, numbers, decimal point, and negative sign
              // Regex: optional negative sign, followed by digits and optional decimal part
              if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
                onChange(newValue);
              }
            } else {
              onChange(newValue);
            }
          }}
          placeholder={"Enter value"}
          size="small"
          fullWidth
          type={type === "number" || type === "Number" ? "number" : "text"}
          disabled={isReference}
        />
      )}

      {/* Reference Selection Popover for non-string types */}
      {type !== "string" && (
        <Popover
          open={referenceMenuOpen}
          anchorEl={referenceMenuAnchor}
          onClose={handleCloseReferenceMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              mt: "4px",
              minWidth: "280px",
              maxWidth: "400px",
              maxHeight: "400px",
              overflow: "auto",
              borderRadius: "6px",
              border: `1px solid ${theme.palette.neutral[300]}`,
            },
          }}
        >
          {upstreamOutputs.length === 0 ? (
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
                  fontSize: `${13}px`,
                }}
              >
                No reference available
              </Typography>
            </Box>
          ) : (
            <>
              {upstreamOutputs.reduce((acc, output, index) => {
                const nodeId = output.nodeId;
                const lastNodeId =
                  index > 0 ? upstreamOutputs[index - 1]?.nodeId : null;

                if (lastNodeId !== nodeId) {
                  // New node group - add divider and header
                  if (index > 0) {
                    acc.push(
                      <Box key={`divider-${nodeId}`} sx={{ height: "16px" }} />
                    );
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
                      {output.nodeType && output.nodeType !== "Start" && (
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
                    onClick={() => handleSelectReference(output)}
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
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
          )}
        </Popover>
      )}

      {/* Full Screen Edit Modal - only for string type */}
      {type === "string" && (
        <Dialog
          open={modalOpen}
          onClose={handleCloseModal}
          maxWidth={false}
          fullWidth
          PaperProps={{
            sx: {
              width: "90%",
              maxWidth: "1200px",
              height: "80vh",
              maxHeight: "800px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: "20px",
              pb: "12px",
              px: "20px",
              borderBottom: `1px solid ${theme.palette.neutral[300]}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Typography variant="h2" component="span">
                Edit {name}
              </Typography>
              <TypeBadge type={type} />
            </Box>
            <IconButton
              onClick={handleCloseModal}
              size="small"
              sx={{ marginRight: "-8px" }}
            >
              <X size={16} />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              p: "20px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              {description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: "12px",
                  }}
                >
                  {description}
                </Typography>
              )}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                <LexicalStringEditorModal
                  value={modalValue}
                  onChange={setModalValue}
                  currentNodeId={currentNodeId}
                  placeholder={placeholder}
                />
              </Box>
            </Box>
          </DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              p: "20px",
              borderTop: `1px solid ${theme.palette.neutral[300]}`,
            }}
          >
            <Button variant="text" color="inherit" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveModal}>
              Save
            </Button>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}
