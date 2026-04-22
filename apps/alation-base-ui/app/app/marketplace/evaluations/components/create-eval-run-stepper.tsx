"use client";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Check } from "lucide-react";

interface CreateEvalRunStepperProps {
  activeStep: number;
  onStepClick?: (step: number) => void;
  disabledSteps?: number[];
  showValidationIcon?: boolean;
}

export function CreateEvalRunStepper({
  activeStep,
  onStepClick,
  disabledSteps = [],
  showValidationIcon = false,
}: CreateEvalRunStepperProps) {
  const theme = useTheme();

  const steps = [
    { label: "Select agent", index: 0 },
    { label: "Select questions", index: 1 },
    { label: "Eval details", index: 2 },
    { label: "Validate and confirm", index: 3 },
  ];

  return (
    <Box sx={{ px: "20px", pb: "12px" }}>
      <Stepper
        activeStep={activeStep}
        sx={{
          alignSelf: "flex-start",
          width: "fit-content",
          "& .MuiStepLabel-label": {
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: "14px",
            whiteSpace: "nowrap",
          },
        }}
      >
        {steps.map((step) => {
          const isDisabled = disabledSteps.includes(step.index);
          const isClickable = onStepClick && !isDisabled;

          return (
            <Step key={step.index}>
              <StepLabel
                onClick={
                  isClickable
                    ? () => onStepClick(step.index)
                    : undefined
                }
                icon={
                  step.index === 3 && showValidationIcon ? (
                    <Box
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "999px",
                        backgroundColor: theme.palette.green[200],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.palette.success.main,
                      }}
                    >
                      <Check size={14} />
                    </Box>
                  ) : undefined
                }
                sx={{
                  cursor: isClickable ? "pointer" : "default",
                  "& .MuiStepLabel-label": {
                    cursor: isClickable ? "pointer" : "default",
                  },
                  "& .MuiStepLabel-iconContainer": {
                    paddingRight: step.index === 3 && showValidationIcon ? "0px" : undefined,
                    marginRight: step.index === 3 && showValidationIcon ? "6px" : undefined,
                    minWidth: step.index === 3 && showValidationIcon ? "auto" : undefined,
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
