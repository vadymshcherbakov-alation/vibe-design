"use client";
import { useState } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import { SectionCard } from "../_components";

const OPTIONS = [
  { value: "generic", label: "Generic" },
  { value: "excel", label: "Excel" },
  { value: "numbers", label: "Numbers" },
];

export default function OtherPage() {
  const [csvOption, setCsvOption] = useState("generic");
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <SectionCard title="CSV download options">
        <Typography variant="body2" color="text.primary" sx={{ mb: 2, fontWeight: 500 }}>
          Optimize CSV downloads for
        </Typography>
        <RadioGroup value={csvOption} onChange={(e) => setCsvOption(e.target.value)} sx={{ gap: "12px" }}>
          {OPTIONS.map(({ value, label }) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio />}
              label={label}
              slotProps={{ typography: { sx: { fontSize: "14px" } } }}
            />
          ))}
        </RadioGroup>
      </SectionCard>
      <SectionCard title="Compose tooltip tutorials">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          On some pages, a tooltip would show up to briefly describe a key feature you might not be familiar with.
          Once you try it out, the tooltip will be permanently suppressed. If you&apos;d like to, you may re-enable all tooltips.
        </Typography>
        <Button variant="outlined">Re-enable all tooltips</Button>
      </SectionCard>
    </Box>
  );
}
