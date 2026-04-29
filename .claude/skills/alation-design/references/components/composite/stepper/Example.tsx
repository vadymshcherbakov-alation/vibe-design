import {
  Stack,
  Step,
  StepButton,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';

// Stepper renders the *progress trail* only — it has no navigation controls.
// "Back" / "Next" / "Submit" buttons live outside the Stepper, in a wizard
// pattern (TBD reference). All `activeStep` values below are fixed for the
// demo; the user does not advance the flow inside this Example.
//
// FIXED-SIZE CONTRACT — do not bend it when you copy this file:
//   - Step icon is always 24×24. The morpheus MuiStepIcon theme override
//     owns this; never set
//     `sx={{ '& .MuiStepIcon-root': { fontSize: … } }}` or pass
//     `slotProps={{ stepIcon: { sx: { width, height } } }}` at the call site.
//   - Label is always `body2` (MUI default for <StepLabel>). Never wrap label
//     text in a <Typography variant="…"> to upsize it.
//   - If the icon renders smaller than 24×24, the THEME is broken (the
//     MuiStepIcon override is missing) — fix the theme, not the call site.
//   - If the layout looks "spread out" in a wide Dialog or page, constrain
//     the WRAPPER (max-width on the parent). The outer <Stack maxWidth={720}>
//     below is the contract for ≤ 4 steps; bump to ~960 for 5–6 steps.

const horizontalSteps = ['Connect source', 'Map schema', 'Review', 'Publish'];
const altLabelSteps = ['Profile', 'Workspace', 'Invite team'];
const verticalSteps = [
  { label: 'Pick target' },
  { label: 'Set conditions' },
  { label: 'Schedule' },
  { label: 'Notify' },
];
const reviewSteps = ['Identity', 'Workspace', 'Permissions', 'Confirm'];

export default function StepperExample() {
  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      {/* Orientation — Horizontal · default (label end-placed) · linear */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Horizontal · linear · default label placement (label to the right of the icon)
        </Typography>
        <Stepper activeStep={1} aria-label="Source connection flow">
          {horizontalSteps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
      </Stack>

      {/* Orientation — Horizontal · alternativeLabel · linear */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Horizontal · <code>alternativeLabel</code> (label below the icon · banner-style)
        </Typography>
        <Stepper activeStep={0} alternativeLabel aria-label="Onboarding flow">
          {altLabelSteps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
      </Stack>

      {/* Orientation — Vertical with inline StepContent */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Vertical · inline <code>StepContent</code> per step (form-wizard shape)
        </Typography>
        <Stepper activeStep={1} orientation="vertical" aria-label="Create monitor flow">
          {verticalSteps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === verticalSteps.length - 1 ? (
                    <Typography variant="caption">Optional</Typography>
                  ) : undefined
                }
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>

      {/* Interaction model — Non-linear with StepButton */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Non-linear · review-style · every step reachable via <code>StepButton</code>
        </Typography>
        <Stepper activeStep={2} nonLinear aria-label="Invite review">
          {reviewSteps.map((label, index) => (
            <Step key={label} completed={index < 2}>
              <StepButton>{label}</StepButton>
            </Step>
          ))}
        </Stepper>
      </Stack>

    </Stack>
  );
}
