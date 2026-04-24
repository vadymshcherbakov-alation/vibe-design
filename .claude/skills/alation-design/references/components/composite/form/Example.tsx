import { useState } from 'react';
import { Autocomplete, Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
import type { ReactNode } from 'react';

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'block' }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default function FormExample() {
  const [name, setName] = useState('PII completeness');
  const [description, setDescription] = useState('');
  const [dataType, setDataType] = useState('all');

  return (
    <Stack spacing={3} sx={{ maxWidth: 680 }}>
      <FormField label="Standard Name">
        <TextField
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { height: 40 } }}
        />
      </FormField>

      <FormField label="Description">
        <TextField
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the purpose and scope of this standard"
        />
      </FormField>

      <FormField label="Column Data Type">
        <TextField
          fullWidth
          select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { height: 40 } }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="string">String</MenuItem>
          <MenuItem value="integer">Integer</MenuItem>
          <MenuItem value="boolean">Boolean</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </TextField>
      </FormField>

      <FormField label="Edit Access">
        <Autocomplete
          multiple
          options={['Alice Johnson', 'Bob Smith', 'Carol White', 'David Lee']}
          componentsProps={{
            paper: { sx: { border: 1, borderColor: 'divider', boxShadow: 1, borderRadius: 1 } },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search users to grant edit access"
            />
          )}
        />
      </FormField>
    </Stack>
  );
}
