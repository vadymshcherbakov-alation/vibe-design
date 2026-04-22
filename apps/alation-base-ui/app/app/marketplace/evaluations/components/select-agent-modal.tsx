"use client";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import { X, CheckCircle } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { ItemTypeIcon } from "../../../studio/flows/components/item-type-icon";
import { CreateEvalRunStepper } from "./create-eval-run-stepper";

interface Agent {
  id: string;
  name: string;
  type: "Agent";
  description: string;
}

interface SelectAgentModalProps {
  open: boolean;
  onClose: () => void;
  agents: Agent[];
  selectedAgent: string | null;
  focusedAgentId: string | null;
  onAgentSelect: (agentId: string) => void;
  onAgentFocus: (agentId: string) => void;
  isValidatingEval: boolean;
  dataProductsToValidate: string[];
  validatedDataProducts: Set<string>;
  getDataProductName: (id: string) => string;
  /** When true, render as a Box (no Dialog) for design canvas / embedded use */
  embedded?: boolean;
}

export function SelectAgentModal({
  open,
  onClose,
  agents,
  selectedAgent,
  focusedAgentId,
  onAgentSelect,
  onAgentFocus,
  isValidatingEval,
  dataProductsToValidate,
  validatedDataProducts,
  getDataProductName,
  embedded = false,
}: SelectAgentModalProps) {
  const theme = useTheme();
  const focusedAgent = agents.find((agent) => agent.id === focusedAgentId);

  const paperSx = {
    width: "90%",
    maxWidth: "960px",
    height: "600px",
    borderRadius: "12px",
    boxShadow:
      "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const inner = (
    <>
      {isValidatingEval ? (
        /* Validating Screen */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            py: "32px",
            px: "24px",
          }}
        >
          {/* Header */}
          <Typography
            variant="h2"
            sx={{
              mb: "24px",
              textAlign: "center",
            }}
          >
            Checking your authorization for data products
          </Typography>

          {/* Data Products List */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {dataProductsToValidate.map((dpId) => (
              <Box
                key={dpId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  py: "8px",
                  px: "12px",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                }}
              >
                {/* Status Icon */}
                {validatedDataProducts.has(dpId) ? (
                  <CheckCircle
                    size={20}
                    color={theme.palette.success.main}
                  />
                ) : (
                  <CircularProgress size={20} />
                )}
                {/* Data Product Name */}
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                >
                  {getDataProductName(dpId)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <>
          {/* Dialog Header */}
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: "20px",
              pb: "12px",
              px: "20px",
            }}
          >
            <Typography variant="h2" component="span">
              Create eval run
            </Typography>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ marginRight: "-8px" }}
            >
              <X size={16} />
            </IconButton>
          </DialogTitle>

          {/* Stepper */}
          <CreateEvalRunStepper activeStep={0} />

          {/* Dialog Content */}
          <DialogContent
            sx={{
              p: 0,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flex: 1,
                overflow: "hidden",
              }}
            >
              {/* Left Side: Agent List */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Select an agent label */}
                <Box
                  sx={{
                    pl: "20px",
                    pr: "20px",
                    pt: "12px",
                    pb: "8px",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "13px",
                    }}
                  >
                    Select an agent
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                  }}
                >
                  <Box
                    sx={{
                      pl: "12px",
                      pr: "12px",
                      pb: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                    }}
                  >
                    {agents.map((agent) => (
                      <Box
                        key={agent.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          onAgentFocus(agent.id);
                          onAgentSelect(agent.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onAgentFocus(agent.id);
                            onAgentSelect(agent.id);
                          }
                        }}
                        onMouseEnter={() => {
                          onAgentFocus(agent.id);
                        }}
                        onMouseMove={() => {
                          onAgentFocus(agent.id);
                        }}
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          px: "12px",
                          py: "8px",
                          minHeight: "40px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor:
                            focusedAgentId === agent.id
                              ? theme.palette.neutral[100]
                              : "transparent",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: `background-color ${"150ms"}`,
                          position: "relative",
                          "&:focus-visible": {
                            outline: `2px solid ${theme.palette.primary.main}`,
                            outlineOffset: "2px",
                          },
                        }}
                      >
                        {/* Agent Info */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flex: 1,
                          }}
                        >
                          {/* Icon */}
                          <ItemTypeIcon type={agent.type} />
                          {/* Name */}
                          <Typography
                            sx={{
                              color: theme.palette.text.primary,
                            }}
                          >
                            {agent.name}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            opacity: focusedAgentId === agent.id ? 1 : 0,
                            transition: `opacity ${"150ms"}`,
                            pr: "8px",
                          }}
                        >
                          Select
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Right Side: Detail Panel */}
              <Box
                sx={{
                  width: "320px",
                  flexShrink: 0,
                  backgroundColor: theme.palette.neutral[50],
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {focusedAgent ? (
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      p: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* Agent Name */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.text.primary,
                      }}
                    >
                      {focusedAgent.name}
                    </Typography>

                    {/* Agent Type */}
                    <Chip
                      label={focusedAgent.type || "Agent"}
                      size="small"
                      sx={{
                        alignSelf: "flex-start",
                        backgroundColor: theme.palette.purple[200],
                        color: theme.palette.purple[600],
                      }}
                    />

                    {/* Agent Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {focusedAgent.description || "No description available."}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: "24px",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Select an agent to see details
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
        </>
      )}
    </>
  );

  if (embedded) {
    return <Box sx={paperSx}>{inner}</Box>;
  }
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: paperSx }}>
      {inner}
    </Dialog>
  );
}
