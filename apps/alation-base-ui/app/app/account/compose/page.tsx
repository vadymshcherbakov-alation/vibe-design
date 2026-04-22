"use client";
import { Button, Typography } from "@mui/material";
import { SectionCard } from "../_components";

export default function ComposePage() {
  return (
    <SectionCard title="Tooltip tutorials">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        On some pages, a tooltip would show up to briefly describe a key feature you might not be familiar with.
        Once you try it out, the tooltip will be permanently suppressed. If you&apos;d like to, you may re-enable all tooltips.
      </Typography>
      <Button variant="outlined">Re-enable all tooltips</Button>
    </SectionCard>
  );
}
