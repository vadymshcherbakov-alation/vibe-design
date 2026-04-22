"use client";
import { Box, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState, useEffect } from "react";
import {
  Run,
  Question,
  DataProduct,
  Agent,
  EvalQuestion,
  formatDate,
  formatDuration,
} from "./components";
import { RunDetailHeader } from "./components/run-detail-header";
import { MetricCards } from "./components/metric-cards";
import { QuestionsTable } from "./components/questions-table";
import { QuestionDetailPanel } from "./components/question-detail-panel";
import { RenameDialog } from "./components/rename-dialog";
import runsData from "../../runs-data.json";
import questionsData from "../../questions-data.json";
import dataProducts from "../../data-products.json";
import agentsData from "../../agents-data.json";

export default function RunDetailPage() {
  const params = useParams();
  const theme = useTheme();
  const runId = params.id as string;

  // State
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // Find the run data
  const run = useMemo(() => {
    return (runsData as Run[]).find((r) => r.evalId === runId);
  }, [runId]);

  // Initialize edited name when run is loaded
  useEffect(() => {
    if (run) {
      setEditedName(run.evalName);
    }
  }, [run]);

  // Create data products map
  const dataProductsMap = useMemo(() => {
    const map = new Map<string, string>();
    (dataProducts as DataProduct[]).forEach((dp) => {
      map.set(dp.id, dp.name);
    });
    return map;
  }, []);

  const getDataProductName = (id: string) => {
    return dataProductsMap.get(id) || id;
  };

  // Create agents map
  const agentsMap = useMemo(() => {
    const map = new Map<string, Agent>();
    (agentsData as Agent[]).forEach((agent) => {
      map.set(agent.id, agent);
    });
    return map;
  }, []);

  const getAgentName = (id: string) => {
    return agentsMap.get(id)?.name || id;
  };

  // Calculate pass rate
  const passRate = useMemo(() => {
    if (!run) return null;
    return run.passedQuestions !== null && run.numberOfQuestions > 0
      ? ((run.passedQuestions / run.numberOfQuestions) * 100).toFixed(0)
      : null;
  }, [run]);

  // Filter questions by agentId and simulate pass/fail status
  const evalQuestions: EvalQuestion[] = useMemo(() => {
    if (!run) return [];
    
    const allQuestions = questionsData as Question[];
    const filtered = allQuestions
      .filter((q) => q.agentId === run.agentId)
      .slice(0, 30);

    // Simulate pass/fail status based on pass rate
    const passedCount =
      run.passedQuestions ??
      Math.floor((run.numberOfQuestions * (parseFloat(passRate || "0") / 100)) || 0);
    const totalQuestions = Math.min(filtered.length, run.numberOfQuestions);
    const failedCount = totalQuestions - passedCount;

    // Create array of pass/fail statuses
    const statuses: boolean[] = [];
    for (let i = 0; i < passedCount; i++) {
      statuses.push(true);
    }
    for (let i = 0; i < failedCount; i++) {
      statuses.push(false);
    }

    // Shuffle the statuses to randomize which questions pass/fail
    for (let i = statuses.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = statuses[i]!;
      statuses[i] = statuses[j]!;
      statuses[j] = temp;
    }

    return filtered.map((q, index) => {
      const passedStatus = index < statuses.length ? statuses[index] : false;
      return {
        ...q,
        passed: passedStatus ?? false,
      };
    });
  }, [run, passRate]);

  // Get selected question
  const selectedQuestion = useMemo(() => {
    if (!selectedQuestionId) return null;
    return evalQuestions.find((q) => q.id === selectedQuestionId) || null;
  }, [selectedQuestionId, evalQuestions]);

  // Build metrics array
  const metrics = useMemo(() => {
    if (!run) return [];
    return [
      {
        label: "Agent",
        value: getAgentName(run.agentId),
      },
      {
        label: "Pass Rate",
        value:
          passRate !== null
            ? `${passRate}% (${run.passedQuestions} / ${run.numberOfQuestions})`
            : "-",
      },
      {
        label: "Evaluation Set",
        value: `${run.numberOfQuestions} Questions`,
      },
      {
        label: "Run at",
        value: formatDate(run.runAt),
      },
      {
        label: "Avg Duration per case",
        value: formatDuration(run.averageDuration) || "-",
      },
    ];
  }, [run, passRate, getAgentName]);

  // Handlers
  const handleRenameClick = () => {
    if (run) {
      setEditedName(run.evalName);
      setRenameDialogOpen(true);
    }
  };

  const handleRenameClose = () => {
    setRenameDialogOpen(false);
    if (run) {
      setEditedName(run.evalName);
    }
  };

  const handleRenameSave = () => {
    if (editedName.trim() && run) {
      // TODO: Implement actual rename API call
      console.log("Renaming run:", run.evalId, "to:", editedName.trim());
      setRenameDialogOpen(false);
    }
  };

  // Loading/Not found state
  if (!run) {
    return (
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: theme.palette.neutral[50],
          p: "24px",
        }}
      >
        <Typography>Run not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: theme.palette.neutral[50],
      }}
    >
      {/* Header Section */}
      <RunDetailHeader run={run} onRenameClick={handleRenameClick} />

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {/* Metric Cards */}
        <MetricCards metrics={metrics} />

        {/* Questions List and Detail Panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Questions Table - Left Side */}
          <QuestionsTable
            questions={evalQuestions}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={setSelectedQuestionId}
            getDataProductName={getDataProductName}
          />

          {/* Detail Panel - Right Side */}
          {selectedQuestion && (
            <QuestionDetailPanel
              question={selectedQuestion}
              onClose={() => setSelectedQuestionId(null)}
            />
          )}
        </Box>
      </Box>

      {/* Rename Dialog */}
      <RenameDialog
        open={renameDialogOpen}
        onClose={handleRenameClose}
        onSave={handleRenameSave}
        editedName={editedName}
        onNameChange={setEditedName}
      />
    </Box>
  );
}
