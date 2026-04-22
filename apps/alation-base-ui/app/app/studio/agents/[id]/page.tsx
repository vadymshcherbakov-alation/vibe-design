"use client";

import { Box } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Allotment, LayoutPriority } from "allotment";
import "allotment/dist/style.css";
import { getAgentById } from "../agent-data";
import { AgentDetailPane } from "./components/agent-detail-pane";
import { AgentChatPane } from "./components/agent-chat-pane";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const agent = getAgentById(agentId);

  useEffect(() => {
    if (!agent) {
      router.push("/app/studio/agents");
    }
  }, [agent, router]);

  if (!agent) {
    return null;
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      <Allotment proportionalLayout={false}>
        <Allotment.Pane minSize={576}>
          <AgentDetailPane />
        </Allotment.Pane>
        <Allotment.Pane
          minSize={384}
          preferredSize={384}
          priority={LayoutPriority.Low}
          snap
        >
          <AgentChatPane />
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
}
