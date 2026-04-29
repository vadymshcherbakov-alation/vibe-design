import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { X } from 'lucide-react';

// In a real Alation workspace, the page mounts inside <AlationLayout> from
// @repo/ui (or the workspace's equivalent). The chrome — App Top Header,
// App Side Bar, optional Sub Navigation — is provided by that layout. This
// Example.tsx returns just the wizard contents that go inside the white
// main area; the surrounding chrome is rendered by the workspace.

const STEPS = ['Choose connector', 'Authenticate', 'Map schema', 'Review'] as const;
const FLOW_NAME = 'Connect a source';
const COMMIT_VERB = 'Connect';
const BODY_MAX_WIDTH = 720; // standard-form body shape

type StepData = {
  connector: string;
  username: string;
  password: string;
  schema: string;
};

const EMPTY_DATA: StepData = { connector: '', username: '', password: '', schema: '' };

interface WizardPageExampleProps {
  onClose?: () => void;
}

export default function WizardPageExample({ onClose }: WizardPageExampleProps = {}) {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<StepData>(EMPTY_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  const isLastStep = activeStep === STEPS.length - 1;
  const isFirstStep = activeStep === 0;
  const hasDraftableData = data.connector !== '' || data.username !== '';
  const hasUnsavedChanges = hasDraftableData;

  const onBack = () => setActiveStep((s) => Math.max(0, s - 1));
  const onConfirmContinue = () => {
    if (!isLastStep) {
      setActiveStep((s) => s + 1);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 800);
  };
  const onCompleteLater = () => {
    // Persist a draft and route back to the parent. No-op in the demo.
  };
  const onCloseClick = () => {
    if (hasUnsavedChanges) {
      setDiscardOpen(true);
    } else {
      onClose?.();
    }
  };
  const onDiscard = () => {
    setDiscardOpen(false);
    setData(EMPTY_DATA);
    setActiveStep(0);
    onClose?.();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 600, bgcolor: 'background.paper' }}>
      {/* Wizard header — inline anatomy: h2 title left, close cross right */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Typography variant="h2">Connect a data source</Typography>
        <IconButton aria-label="Close wizard" onClick={onCloseClick}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* Stepper region — horizontal, linear */}
      <Box sx={{ px: 3, pt: 3, pb: 4, flexShrink: 0 }}>
        <Stepper activeStep={activeStep} aria-label="Source connection flow">
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Body region — active step only, inside the chosen body shape (standard-form: 720px) */}
      <Box component="main" sx={{ flex: 1, overflowY: 'auto', px: 3 }}>
        <Box sx={{ maxWidth: BODY_MAX_WIDTH, mx: 'auto', pb: 3 }}>
          {activeStep === 0 && (
            <Stack spacing={2}>
              <Typography variant="h3">Choose a connector</Typography>
              <Typography variant="body1" color="text.secondary">
                Pick the data source you'd like to register with Alation.
              </Typography>
              <TextField
                select
                label="Connector"
                value={data.connector}
                onChange={(e) => setData({ ...data, connector: e.target.value })}
              >
                <MenuItem value="snowflake">Snowflake</MenuItem>
                <MenuItem value="bigquery">BigQuery</MenuItem>
                <MenuItem value="postgres">Postgres</MenuItem>
              </TextField>
            </Stack>
          )}
          {activeStep === 1 && (
            <Stack spacing={2}>
              <Typography variant="h3">Authenticate</Typography>
              <Typography variant="body1" color="text.secondary">
                Enter the credentials Alation will use to connect.
              </Typography>
              <TextField
                label="Username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
              <TextField
                label="Password"
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </Stack>
          )}
          {activeStep === 2 && (
            <Stack spacing={2}>
              <Typography variant="h3">Map schema</Typography>
              <Typography variant="body1" color="text.secondary">
                Choose which schemas to register.
              </Typography>
              <TextField
                label="Schema name"
                value={data.schema}
                onChange={(e) => setData({ ...data, schema: e.target.value })}
              />
            </Stack>
          )}
          {activeStep === 3 && (
            <Stack spacing={1}>
              <Typography variant="h3">Review</Typography>
              <Typography variant="body1" color="text.secondary">
                Confirm the details before connecting.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">Connector: {data.connector || '—'}</Typography>
                <Typography variant="body2" color="text.secondary">Username: {data.username || '—'}</Typography>
                <Typography variant="body2" color="text.secondary">Schema: {data.schema || '—'}</Typography>
              </Box>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Footer — sticky, three buttons in fixed positions */}
      <Box
        component="footer"
        aria-label={`Wizard actions: ${FLOW_NAME}`}
        sx={{
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Button variant="outlined" color="inherit" disabled={isFirstStep} onClick={onBack}>
          Back
        </Button>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onCompleteLater}
            disabled={!hasDraftableData}
          >
            Complete Later
          </Button>
          <Button variant="contained" onClick={onConfirmContinue} disabled={isSubmitting}>
            {isLastStep ? COMMIT_VERB : 'Confirm & Continue'}
          </Button>
        </Stack>
      </Box>

      {/* Exit-confirmation Dialog — surfaced when the close cross is pressed
          with unsaved changes. */}
      <Dialog open={discardOpen} onClose={() => setDiscardOpen(false)} aria-labelledby="discard-title">
        <DialogTitle id="discard-title">Discard your progress?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Leaving now will discard the work you've done in this wizard. Use Complete Later to save a draft instead.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiscardOpen(false)}>Keep editing</Button>
          <Button color="error" variant="contained" onClick={onDiscard}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
