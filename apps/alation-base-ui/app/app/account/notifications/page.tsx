"use client";
import { useState } from "react";
import { Box, Typography, Checkbox, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { SectionCard } from "../_components";

const NOTIFICATION_GROUPS = [
  {
    title: "System & Administration",
    items: [
      "Alation license is or about to expire.",
      "A new user account requires activation.",
      "Bulk domain membership changes are made.",
    ],
  },
  {
    title: "Stewardship & Governance",
    items: [
      "Someone changes metadata on a data source, schema, table, or column I'm a steward of.",
      "Someone edits an article I'm a steward of.",
      "Someone adds me to (or removes me from) a custom field on an article, data source, schema, table or column.",
    ],
  },
  {
    title: "Content & Collaboration",
    items: [
      "Someone writes about a subject I'm an author or editor of.",
      "Someone answers my question.",
      "Someone also comments in a thread I commented in.",
      "Someone mentions me in an article or conversation.",
      "Someone assigns me to a conversation.",
    ],
  },
  {
    title: "Queries & Data Jobs",
    items: [
      "A scheduled query run has started, and when it has failed to start.",
      "A scheduled query run has finished.",
      "Changes are made to my scheduled query by server admin.",
      "A scheduled metadata extraction/query log ingestion/profiling job fails on a data source.",
    ],
  },
  {
    title: "Integrations & Agents",
    items: [
      "Alation fails to sync certified workbooks with Tableau Server.",
      "Alation detects that one of your Alation Agents is disconnected.",
      "Alation detects that one of your Alation Agents' certificates is about to expire.",
    ],
  },
];

const ALL_ITEMS = NOTIFICATION_GROUPS.flatMap((g) => g.items);

export default function NotificationsPage() {
  const [optOut, setOptOut] = useState("opt_out");
  const [enabled, setEnabled] = useState<boolean[]>(ALL_ITEMS.map(() => true));

  const toggle = (i: number) => setEnabled((prev) => prev.map((v, idx) => idx === i ? !v : v));

  let itemIndex = 0;

  return (
    <SectionCard title="Notifications">
      <RadioGroup value={optOut} onChange={(e) => setOptOut(e.target.value)} sx={{ mb: "24px", gap: "24px" }}>
        <FormControlLabel
          value="opt_out"
          control={<Radio />}
          label={
            <Box>
              <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>Opt out of all notifications</Typography>
              <Typography variant="body2" color="text.secondary">You won't receive any email notifications from Alation.</Typography>
            </Box>
          }
        />
        <FormControlLabel
          value="allow"
          control={<Radio />}
          label={
            <Box>
              <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>Allow Alation to notify me by email when</Typography>
              <Typography variant="body2" color="text.secondary">Get notified by email when activity happens that's relevant to you.</Typography>
            </Box>
          }
        />
      </RadioGroup>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pl: "24px" }}>
        {NOTIFICATION_GROUPS.map((group) => (
          <Box key={group.title}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}
              color="text.secondary"
            >
              {group.title}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {group.items.map((text) => {
                const i = itemIndex++;
                return (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Checkbox
                      checked={enabled[i]}
                      onChange={() => toggle(i)}
                      disabled={optOut === "opt_out"}
                    />
                    <Typography variant="body1" color={optOut === "opt_out" ? "text.disabled" : "text.primary"}>
                      {text}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </SectionCard>
  );
}
