"use client";

import { type ReactNode, useState } from "react";
import {
  Box,
  Button,
  Link,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

function PageHeaderSection({
  children,
  hideBorder,
  sx,
}: {
  children: ReactNode;
  hideBorder?: boolean;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        px: 3,
        py: 2.5,
        borderBottom: hideBorder ? "none" : 1,
        borderColor: "divider",
        ...(sx ?? {}),
      }}
    >
      {children}
    </Box>
  );
}

export default function NewDataQualityRulePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const isLastStep = activeStep === steps.length - 1;
  const isFirstStep = activeStep === 0;

  const handleBack = () => setActiveStep((current) => Math.max(0, current - 1));
  const handleNext = () =>
    setActiveStep((current) => Math.min(steps.length - 1, current + 1));
  const handleDone = () => router.push("/app/data_quality");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
        backgroundColor: "background.paper",
      }}
    >
      <PageHeaderSection>
        <Box component="nav" aria-label="Back to data quality" sx={{ mb: 1 }}>
          <Link
            href="/app/data_quality"
            underline="hover"
            color="text.secondary"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Data quality
          </Link>
        </Box>
        <Typography variant="h1">New rule</Typography>
      </PageHeaderSection>

      <Box sx={{ px: 3, py: 3 }}>
        <Stack spacing={4} sx={{ maxWidth: 720 }}>
          <Stepper activeStep={activeStep} aria-label="New rule flow">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 240 }}>
            <Typography variant="body1">
              {`${steps[activeStep]} content goes here`}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
              disabled={isFirstStep}
            >
              Back
            </Button>
            {isLastStep ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleDone}
              >
                Done
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
