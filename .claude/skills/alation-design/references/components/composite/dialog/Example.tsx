import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

export default function DialogExample() {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Create field group
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Create Field Group
        </DialogTitle>

        <DialogContent>
          <Box>
            <Typography
              component="label"
              variant="subtitle2"
              sx={{ mb: 1, display: 'block' }}
            >
              Group Name
            </Typography>
            <TextField
              autoFocus
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Classification Information"
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { height: 40 } }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            disabled={!groupName.trim()}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
