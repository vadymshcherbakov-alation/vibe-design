import { Alert, AlertTitle, Button, Stack } from '@mui/material';

export default function AlertExample() {
  return (
    <Stack spacing={2} sx={{ maxWidth: 640 }}>
      <Alert severity="success">Settings saved.</Alert>

      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        The catalog object was updated successfully.
      </Alert>

      <Alert severity="info">
        <AlertTitle>Heads up</AlertTitle>
        This connection is in read-only mode for the next 30 minutes while the migration runs.
      </Alert>

      <Alert
        severity="warning"
        action={<Button color="inherit" size="small">View details</Button>}
      >
        <AlertTitle>Credentials expiring</AlertTitle>
        These credentials expire in 3 days.
      </Alert>

      <Alert severity="error">Sync failed — check connection settings.</Alert>
    </Stack>
  );
}
