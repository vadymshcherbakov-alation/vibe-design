"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Input,
  CircularProgress,
  Chip,
  Alert,
} from "@mui/material";
import { X, ArrowUp, Check, AlertTriangle } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { CreateEvalRunStepper } from "./create-eval-run-stepper";

interface DataProduct {
  id: string;
  name: string;
}

interface Question {
  id: string;
  dataProductId: string;
}

interface EvalDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  evalName: string;
  onEvalNameChange: (name: string) => void;
  dataProductsList: DataProduct[];
  preExecSqlMap: Map<string, string>;
  onPreExecSqlChange: (dataProductId: string, sql: string) => void;
  isValidatingInModal: boolean;
  isValidationComplete: boolean;
  validatedDataProducts: Set<string>;
  failedDataProducts: Set<string>;
  forceShowStep4?: boolean;
  selectedQuestions?: Question[];
  onRemoveQuestions?: () => void;
  onValidate: () => void;
  onConfirmAndRun: () => void;
  /** When true, render as a Box (no Dialog) for design canvas */
  embedded?: boolean;
  /** When embedded, which step to show: 3 = Eval details (name + pre-exec SQL), 4 = Validate and confirm */
  canvasStep?: 3 | 4;
  /** Agent input parameter values (message, data_product_id, pre_exec_sql, auth_id, marketplace_id, custom) */
  agentInputs?: Record<string, string>;
  /** Called when an agent input value changes */
  onAgentInputChange?: (key: string, value: string) => void;
}

const AGENT_INPUT_PARAMS = [
  { key: "message" },
  { key: "data_product_id" },
  { key: "pre_exec_sql" },
  { key: "auth_id" },
  { key: "marketplace_id" },
  { key: "custom" },
] as const;

export function EvalDetailsModal({
  open,
  onClose,
  onBack,
  evalName,
  onEvalNameChange,
  dataProductsList,
  preExecSqlMap,
  onPreExecSqlChange,
  isValidatingInModal,
  isValidationComplete,
  validatedDataProducts,
  failedDataProducts,
  forceShowStep4 = false,
  selectedQuestions = [],
  onRemoveQuestions,
  onValidate,
  onConfirmAndRun,
  embedded = false,
  canvasStep,
  agentInputs = {},
  onAgentInputChange,
}: EvalDetailsModalProps) {
  const theme = useTheme();

  const paperSx = {
    width: "900px",
    maxWidth: "900px",
    borderRadius: "12px",
    boxShadow:
      "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const showStep3 = !embedded || canvasStep === 3;
  const showStep4 = !embedded || canvasStep === 4;

  const inner = (
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
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!isValidatingInModal && (
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                marginLeft: "-8px",
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.neutral[100],
                },
              }}
            >
              <ArrowUp size={16} style={{ transform: "rotate(-90deg)" }} />
            </IconButton>
          )}
          <Typography variant="h2" component="span">
            Create eval run
          </Typography>
        </Box>
        {!isValidatingInModal && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ marginRight: "-8px" }}
          >
            <X size={16} />
          </IconButton>
        )}
      </DialogTitle>

      {/* Stepper */}
      <CreateEvalRunStepper
        activeStep={isValidatingInModal ? 3 : 2}
        disabledSteps={
          isValidatingInModal || isValidationComplete ? [0, 1] : []
        }
        onStepClick={(step) => {
          if (step === 0) {
            // Navigate to step 1
          } else if (step === 1) {
            onBack();
          }
        }}
      />

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
        {showStep3 &&
        !isValidatingInModal &&
        !isValidationComplete &&
        !forceShowStep4 ? (
          /* Step 3: Eval details – Eval name + Agent inputs (Figma pill-style: label left, input right) */
          <Box
            sx={{
              px: "20px",
              pt: "12px",
              pb: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "100%",
              minWidth: 0,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: "8px",
                  color: theme.palette.text.primary,
                }}
              >
                Eval name
              </Typography>
              <TextField
                fullWidth
                value={evalName}
                onChange={(e) => onEvalNameChange(e.target.value)}
                placeholder="Enter eval name"
                size="small"
              />
            </Box>
            <Box sx={{ width: "100%", minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: "12px",
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                }}
              >
                Agent inputs
              </Typography>
              {/* Figma Agent Builder spec: pill chip on the left, input on the right, same horizontal row */}
              <Stack spacing={8} sx={{ width: "100%", minWidth: 0 }}>
                {AGENT_INPUT_PARAMS.map(({ key }) => {
                  const inputId = `agent-input-${key}`;
                  return (
                    <Stack
                      key={key}
                      direction="row"
                      alignItems="center"
                      spacing={8}
                      sx={{ width: "100%", minWidth: 0 }}
                    >
                      <Chip
                        component="label"
                        htmlFor={inputId}
                        size="small"
                        variant="filled"
                        clickable
                        label={key}
                        sx={{
                          backgroundColor:
                            theme.palette.blue[200],
                          color: theme.palette.blue[600],
                          "& .MuiChip-label": { px: "10px" },
                        }}
                      />
                      <Input
                        id={inputId}
                        fullWidth
                        size="small"
                        disabled={key === "message"}
                        value={agentInputs[key] ?? ""}
                        onChange={(e) =>
                          onAgentInputChange?.(key, e.target.value)
                        }
                        placeholder={
                          key === "message" ? "from question" : "Enter value..."
                        }
                        disableUnderline
                        sx={{
                          flex: "1 1 0",
                          minWidth: 0,
                          fontSize: "13px",
                          backgroundColor: "transparent",
                          "& .MuiInputBase-input": { textAlign: "left" },
                        }}
                      />
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        ) : showStep4 &&
          (embedded ||
            forceShowStep4 ||
            isValidatingInModal ||
            isValidationComplete) ? (
          /* Step 4: Validate and confirm Screen */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              py: "20px",
              px: "24px",
            }}
          >
            {/* Header */}
            <Typography
              variant="body1"
              sx={{
                mb: "24px",
                textAlign: "left",
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              {isValidatingInModal
                ? "Checking your authorization for data products"
                : "Validation complete"}
            </Typography>

            {/* Warning Alert for Failed Products */}
            {!isValidatingInModal && failedDataProducts.size > 0 && (
              <Alert
                severity="warning"
                sx={{
                  mb: "24px",
                  "& .MuiAlert-icon": {
                    color: theme.palette.warning.dark,
                  },
                }}
              >
                Some data products are missing authorization required to run the
                evaluation. Please remove those questions from your current
                selection.
              </Alert>
            )}

            {/* Data Products List - Show 8 data products */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {dataProductsList.slice(0, 8).map((dataProduct) => {
                const isValidated = validatedDataProducts.has(dataProduct.id);
                const isFailed = failedDataProducts.has(dataProduct.id);
                const isQueued = !isValidated && !isFailed;
                return (
                  <Box
                    key={dataProduct.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      borderRadius: "6px",
                      backgroundColor:
                        "#ffffff",
                    }}
                  >
                    {/* Status Icon */}
                    {isValidated ? (
                      <Box
                        sx={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "999px",
                          backgroundColor:
                            theme.palette.green[200],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: theme.palette.success.main,
                        }}
                      >
                        <Check size={14} />
                      </Box>
                    ) : isFailed ? (
                      <Box
                        sx={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "999px",
                          backgroundColor:
                            theme.palette.amber[200],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: theme.palette.warning.dark,
                        }}
                      >
                        <AlertTriangle size={14} />
                      </Box>
                    ) : isQueued ? (
                      <CircularProgress size={16} />
                    ) : null}
                    {/* Data Product Name */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.primary,
                        flex: 1,
                      }}
                    >
                      {dataProduct.name}
                    </Typography>
                    {/* Failed Badge */}
                    {isFailed && (
                      <Chip
                        label="No auth provided"
                        size="small"
                        sx={{
                          height: "20px",
                          fontSize: "11px",
                          fontWeight: 500,
                          backgroundColor:
                            theme.palette.amber[200],
                          color: theme.palette.warning.dark,
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          px: "20px",
          pb: "20px",
          pt: "12px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          borderTop: `1px solid ${theme.palette.neutral[300]}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="text"
          color="inherit"
          disabled={isValidatingInModal}
        >
          Cancel
        </Button>
        {!isValidatingInModal && !isValidationComplete ? (
          <Button variant="contained" onClick={onValidate}>
            Run eval
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onConfirmAndRun}
            disabled={!isValidationComplete || failedDataProducts.size > 0}
          >
            Run eval
          </Button>
        )}
      </Box>
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
