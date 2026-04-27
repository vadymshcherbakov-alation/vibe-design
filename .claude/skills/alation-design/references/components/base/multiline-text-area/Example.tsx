import { useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';

export default function MultilineTextAreaExample() {
  const [fixedComment, setFixedComment] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      {/* Resize behaviour axis */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Resize · fixed rows (minRows === maxRows)
        </Typography>
        <TextField
          label="Comment"
          multiline
          minRows={3}
          maxRows={3}
          placeholder="Exactly 3 rows — overflow scrolls"
          value={fixedComment}
          onChange={(e) => setFixedComment(e.target.value)}
          fullWidth
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Resize · auto-grow bounded (default) · minRows {'<'} maxRows
        </Typography>
        <TextField
          label="Description"
          multiline
          minRows={3}
          maxRows={6}
          helperText="Short description of what this source contains"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
      </Stack>

      {/* Row-bound presets — same axis, different defaults */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Row-bound preset · long-form (5 / 12)
        </Typography>
        <TextField
          label="Release notes"
          multiline
          minRows={5}
          maxRows={12}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
        />
      </Stack>

      {/* States */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Error / Disabled</Typography>
        <Stack spacing={2}>
          <TextField
            label="Summary"
            multiline
            minRows={2}
            maxRows={4}
            error
            helperText="Summary is required"
            defaultValue=""
            fullWidth
          />
          <TextField
            label="Locked"
            multiline
            minRows={2}
            maxRows={4}
            disabled
            value="This description was imported from an upstream source and cannot be edited here."
            fullWidth
          />
        </Stack>
      </Stack>

      {/* Padding size — density via the size prop */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Padding size · small (compact)</Typography>
        <TextField
          label="Compact comment"
          size="small"
          multiline
          minRows={2}
          maxRows={4}
          fullWidth
        />
      </Stack>
    </Stack>
  );
}
