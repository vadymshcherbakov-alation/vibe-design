"use client";

import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import { CreateEvalRunModal } from "../components/create-eval-run-modal";
import questionsData from "../questions-data.json";
import dataProducts from "../data-products.json";
import runsData from "../runs-data.json";
import agentsData from "../agents-data.json";

const questions = questionsData as Array<{
  id: string;
  question: string;
  dataProductId: string;
  sql: string;
  createdDate: string;
  agentId: string;
  creator: string;
}>;
const dataProductsList = dataProducts as Array<{ id: string; name: string }>;
const runsList = runsData as Array<{ evalId: string; evalName: string; runAt: string; status: string; [k: string]: unknown }>;
const agentsList = (agentsData as Array<{ id: string; name: string; type: string; description: string }>).map((a) => ({
  ...a,
  type: "Agent" as const,
}));

export default function DebugCreateEvalRunPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box
      sx={{
        p: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        gap: "16px",
      }}
    >
      <Typography variant="h1">Create Eval Run Modal – Debug</Typography>
      <Typography variant="body2" color="text.secondary">
        Use this route to open and test the create eval run modal flow (Select agent → Select questions → Eval details → Validate and confirm) without going through the main evaluations page.
      </Typography>
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Open Create Eval Run
      </Button>
      <CreateEvalRunModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        agents={agentsList}
        questions={questions}
        dataProducts={dataProductsList}
        runs={runsList}
        onSuccess={() => {
          setModalOpen(false);
        }}
      />
    </Box>
  );
}
