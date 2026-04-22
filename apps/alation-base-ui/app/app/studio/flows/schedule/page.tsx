"use client";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Workflow } from "./components/workflow";
import { WorkflowStep } from "./components/types";
import { AddStepModal, SelectableItem } from "./components/add-step-modal";

const initialSteps: WorkflowStep[] = [
  {
    id: "1",
    label: "Start",
    secondaryText: "Add inputs",
  },
];

export default function SchedulePage() {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDuplicate = (id: string) => {
    const stepIndex = steps.findIndex((s) => s.id === id);
    if (stepIndex !== -1 && steps[stepIndex]) {
      const originalStep = steps[stepIndex];
      const newStep: WorkflowStep = {
        id: `${Date.now()}`,
        icon: originalStep.icon,
        label: originalStep.label,
        secondaryText: originalStep.secondaryText,
      };
      const newSteps = [...steps];
      newSteps.splice(stepIndex + 1, 0, newStep);
      setSteps(newSteps);
    }
  };

  const handleDelete = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleAddStep = () => {
    setIsModalOpen(true);
  };

  const handleSelectItem = (item: SelectableItem) => {
    const newStep: WorkflowStep = {
      id: `${Date.now()}`,
      label: item.name,
      secondaryText: item.type,
    };
    setSteps([...steps, newStep]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <IconButton color="inherit" size="small">
          <ChevronLeft />
        </IconButton>
        <Typography variant="subtitle1">Schedule Name</Typography>
      </Box>
      <Workflow
        steps={steps}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onAddStep={handleAddStep}
      />
      <AddStepModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectItem}
      />
    </Box>
  );
}
