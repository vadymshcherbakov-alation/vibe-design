"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Plus } from "lucide-react";
import { Allotment, LayoutPriority } from "allotment";
import "allotment/dist/style.css";
import { ConnectorLine } from "./connector-line";
import { FlowStepNode } from "./flow-step-node";
import { AddStepModal, SelectableItem } from "./add-step-modal";
import { KeyboardShortcut } from "./keyboard-shortcut";
import { DeleteConfirmationDialog } from "./delete-flow-dialog";
import { FlowDetailPanel } from "./flow-detail-panel";
import { useFlowEditStore } from "../store/useFlowEditStore";
import toolsAgentsData from "../tools-agents-data.json";

interface FlowStep {
  id: string;
  name: string;
  type: "Tool" | "Agent";
  inputCount?: number;
  outputCount?: number;
  inputParameters?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  outputParameters?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
}

export function FlowEditingCanvas() {
  const theme = useTheme();
  const { updateFlowSteps, setSavingState, updateStartNodeInputs, ui } =
    useFlowEditStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replaceWarningDialogOpen, setReplaceWarningDialogOpen] =
    useState(false);
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  // Track parameter values for each node to detect unsaved edits
  const [nodeParameterValues, setNodeParameterValues] = useState<
    Record<string, Record<string, string>>
  >({});
  // Track custom parameters for each node (for start node and potentially others)
  const [nodeCustomParameters, setNodeCustomParameters] = useState<
    Record<
      string,
      Array<{
        id: string;
        name: string;
        type: string;
      }>
    >
  >({});
  // Track right panel size (default 448px)
  const rightPanelSize = 448;
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync steps to store whenever they change
  useEffect(() => {
    const workflowSteps = steps.map((step) => ({
      id: step.id,
      label: step.name,
      type: step.type,
      inputParameters: step.inputParameters,
      outputParameters: step.outputParameters,
    }));
    updateFlowSteps(workflowSteps);
  }, [steps, updateFlowSteps]);

  // Get start node step details (for syncing inputs to store)
  const startNodeStepDetailsForSync = useMemo<{
    inputParameters?: Array<{
      name: string;
      type: string;
      description: string;
    }>;
  } | null>(() => {
    // This could be extended to get from toolsAgentsData or passed as prop
    // For now, return null as start node typically doesn't have predefined parameters
    return null;
  }, []);

  // Sync start node inputs to store whenever they change
  useEffect(() => {
    // Get start node inputs from stepDetails and customParameters
    const predefinedInputs = startNodeStepDetailsForSync?.inputParameters || [];
    const customInputs = nodeCustomParameters["start"] || [];

    // Combine predefined and custom inputs
    const allStartNodeInputs = [
      ...predefinedInputs.map((param) => ({
        name: param.name,
        type: param.type,
        description: param.description || "",
      })),
      ...customInputs
        .filter((param) => param.name) // Only include parameters with names
        .map((param) => ({
          name: param.name,
          type: param.type,
          description: "",
        })),
    ];

    updateStartNodeInputs(allStartNodeInputs);
  }, [
    nodeCustomParameters,
    startNodeStepDetailsForSync,
    updateStartNodeInputs,
  ]);

  const isNodeSelected = (nodeId: string) => selectedNode === nodeId;

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNode(nodeId);
  };

  const handleCanvasClick = () => {
    setSelectedNode(null);
  };

  const handleOpenAddModal = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setInsertIndex(null); // null means append to end
    setIsReplaceMode(false); // Always add, never replace
    setIsModalOpen(true);
  }, []);

  const handleOpenInsertModal = (index: number) => {
    setInsertIndex(index);
    setIsModalOpen(true);
  };

  // Check if a node has unsaved edits (non-empty parameter values)
  const hasUnsavedEdits = (nodeId: string | null): boolean => {
    if (!nodeId || nodeId === "start") return false;
    const paramValues = nodeParameterValues[nodeId];
    if (!paramValues) return false;
    // Check if any parameter has a non-empty value
    return Object.values(paramValues).some((value) => value.trim() !== "");
  };

  const handleOpenChangeModal = () => {
    // Check if there are unsaved edits before opening the replace modal
    if (hasUnsavedEdits(selectedNode)) {
      setReplaceWarningDialogOpen(true);
      return;
    }
    // Open the modal to change the current step
    setIsReplaceMode(true); // Set replace mode
    setIsModalOpen(true);
    setInsertIndex(null);
  };

  const handleReplaceConfirm = () => {
    // Clear parameter values for the current node
    if (selectedNode) {
      setNodeParameterValues((prev) => {
        const newValues = { ...prev };
        delete newValues[selectedNode];
        return newValues;
      });
    }
    // Open the modal to change the current step
    setIsReplaceMode(true); // Set replace mode
    setIsModalOpen(true);
    setInsertIndex(null);
    setReplaceWarningDialogOpen(false);
  };

  const handleReplaceCancel = () => {
    setReplaceWarningDialogOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInsertIndex(null);
    setIsReplaceMode(false);
  };

  const handleSelectItem = (item: SelectableItem) => {
    // Find the item in tools-agents-data.json to get input/output counts and parameters
    const itemData = toolsAgentsData.find(
      (data) => data.id === item.id || data.name === item.name
    );

    // Check if we're replacing an existing step
    // Only replace if explicitly in replace mode (triggered via replace button)
    const isReplacing =
      isReplaceMode && selectedNode && selectedNode !== "start";

    // If replacing an existing step, clear its parameter values
    if (isReplacing && selectedNode) {
      setNodeParameterValues((prev) => {
        const newValues = { ...prev };
        delete newValues[selectedNode];
        return newValues;
      });
    }

    const newStep: FlowStep = {
      id: isReplacing && selectedNode ? selectedNode : `step-${Date.now()}`,
      name: item.name,
      type: item.type,
      inputCount: itemData?.inputParameters?.length ?? 0,
      outputCount: itemData?.outputParameters?.length ?? 0,
      inputParameters: itemData?.inputParameters,
      outputParameters: itemData?.outputParameters,
    };

    // Trigger saving state
    setSavingState("saving");

    if (isReplacing) {
      // Replace existing step at its current position
      const newSteps = steps.map((step) =>
        step.id === selectedNode ? newStep : step
      );
      setSteps(newSteps);
      // Keep the same node selected (with new step data)
      setSelectedNode(selectedNode);
    } else if (insertIndex !== null) {
      // Insert at specific index
      const newSteps = [...steps];
      newSteps.splice(insertIndex, 0, newStep);
      setSteps(newSteps);
      // Select the newly inserted step
      setSelectedNode(newStep.id);
    } else {
      // Append to end
      setSteps([...steps, newStep]);
      // Select the newly added step
      setSelectedNode(newStep.id);

      // Scroll to bottom after the new step is rendered
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 0);
    }

    // Simulate save operation
    setTimeout(() => {
      setSavingState("saved");
      // Keep "Saved" visible permanently
    }, 800);
  };

  // Get the step number for the panel header
  const getSelectedStepNumber = () => {
    if (selectedNode === "start") return 1;
    const stepIndex = steps.findIndex((s) => s.id === selectedNode);
    return stepIndex >= 0 ? stepIndex + 2 : null;
  };

  // Get the selected step data
  const getSelectedStep = (): FlowStep | null => {
    if (selectedNode === "start") return null;
    return steps.find((s) => s.id === selectedNode) || null;
  };

  // Get the detailed step data from toolsAgentsData
  const selectedStepDetails = useMemo(() => {
    if (selectedNode === "start") return null;
    const step = steps.find((s) => s.id === selectedNode);
    if (!step) return null;
    return (
      toolsAgentsData.find(
        (data) => data.name === step.name || data.id === step.id
      ) || null
    );
  }, [selectedNode, steps]);

  // Get start node step details (if it exists in toolsAgentsData or elsewhere)
  // For now, start node might not have predefined stepDetails, so we calculate from customParameters
  const startNodeStepDetails = useMemo<{
    inputParameters?: Array<{
      name: string;
      type: string;
      description: string;
    }>;
    outputParameters?: Array<{
      name: string;
      type: string;
      description: string;
    }>;
  } | null>(() => {
    // Could look up in toolsAgentsData if start node is defined there
    // For now, return null as start node typically doesn't have predefined parameters
    return null;
  }, []);

  // Calculate input/output counts for start node
  // Count includes both predefined inputParameters from stepDetails and customParameters
  const startNodeInputCount = useMemo(() => {
    const predefinedCount =
      (startNodeStepDetails?.inputParameters?.length ?? 0) || 0;
    const customCount = nodeCustomParameters["start"]?.length || 0;
    const total = predefinedCount + customCount;
    return total > 0 ? total : undefined;
  }, [startNodeStepDetails, nodeCustomParameters]);

  const startNodeOutputCount = useMemo(() => {
    const count = (startNodeStepDetails?.outputParameters?.length ?? 0) || 0;
    return count > 0 ? count : undefined;
  }, [startNodeStepDetails]);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedNode && selectedNode !== "start") {
      // Trigger saving state
      setSavingState("saving");

      // Clear parameter values for the deleted node
      setNodeParameterValues((prev) => {
        const newValues = { ...prev };
        delete newValues[selectedNode];
        return newValues;
      });

      // Remove the step from the array
      const newSteps = steps.filter((step) => step.id !== selectedNode);
      setSteps(newSteps);

      // Close the panel
      setSelectedNode(null);

      // Simulate save operation
      setTimeout(() => {
        setSavingState("saved");
      }, 800);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Keyboard shortcut: Cmd+/ or Ctrl+/ to open add step dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+/ (Mac) or Ctrl+/ (Windows/Linux)
      const isModifierPressed = e.metaKey || e.ctrlKey;
      const isSlash = e.key === "/" || e.keyCode === 191;

      if (isModifierPressed && isSlash && !isModalOpen) {
        e.preventDefault();
        handleOpenAddModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleOpenAddModal]);

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Allotment proportionalLayout={false}>
        {/* Main Content Area */}
        <Allotment.Pane minSize={300} priority={LayoutPriority.High}>
          <Box
            onClick={handleCanvasClick}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: theme.palette.neutral[50],
              overflowY: "auto",
              scrollbarGutter: "stable",
            }}
          >
            <Box
              sx={{
                margin: "auto",
                padding: "40px",
                paddingBottom: "80px",
                paddingTop: "80px",
              }}
            >
              {/* Start Node */}
              <FlowStepNode
                stepNumber={1}
                name="Start"
                type="Start"
                isSelected={isNodeSelected("start")}
                onClick={(e) => handleNodeClick(e, "start")}
                inputCount={startNodeInputCount ?? undefined}
                outputCount={startNodeOutputCount ?? undefined}
              />

              {/* Dynamic Steps */}
              {steps.map((step, index) => {
                const healthCheckResult = ui.healthCheckResult;
                let hasIssue = false;
                if (healthCheckResult) {
                  const nodeErrors = healthCheckResult.errorsByNode[step.id];
                  const nodeIssues = healthCheckResult.issuesByNode[step.id];
                  hasIssue =
                    (nodeErrors?.length ?? 0) > 0 ||
                    (nodeIssues?.length ?? 0) > 0;
                }

                return (
                  <Box key={step.id}>
                    {/* Connector Line with Insert Button */}
                    <ConnectorLine
                      onInsert={() => handleOpenInsertModal(index)}
                    />

                    {/* Step Node */}
                    <FlowStepNode
                      stepNumber={index + 2}
                      name={step.name}
                      type={step.type}
                      isSelected={isNodeSelected(step.id)}
                      onClick={(e) => handleNodeClick(e, step.id)}
                      inputCount={step.inputCount}
                      outputCount={step.outputCount}
                      hasIssue={hasIssue}
                    />
                  </Box>
                );
              })}

              {/* Connector Line before Add Step */}
              <ConnectorLine showInsertButton={false} />

              {/* Add Step Button */}
              <Box
                ref={bottomRef}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pl: "40px",
                }}
              >
                <Box
                  sx={{
                    width: "480px",
                    minWidth: "280px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Plus size={16} />}
                    onClick={handleOpenAddModal}
                    sx={{
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      Add step
                      <KeyboardShortcut variant="dark" />
                    </Box>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Allotment.Pane>

        {/* Right Panel */}
        <Allotment.Pane preferredSize={rightPanelSize} minSize={320}>
          <FlowDetailPanel
            selectedNode={selectedNode}
            selectedStep={getSelectedStep()}
            stepNumber={getSelectedStepNumber()}
            stepDetails={
              selectedNode === "start"
                ? null // Start node stepDetails - can be extended if needed
                : selectedStepDetails
            }
            onDelete={handleDeleteClick}
            onReplace={handleOpenChangeModal}
            onBack={() => setSelectedNode(null)}
            parameterValues={
              selectedNode ? nodeParameterValues[selectedNode] || {} : {}
            }
            allParameterValues={nodeParameterValues}
            onParameterChange={(paramName, value) => {
              if (selectedNode) {
                setNodeParameterValues((prev) => ({
                  ...prev,
                  [selectedNode]: {
                    ...(prev[selectedNode] || {}),
                    [paramName]: value,
                  },
                }));
              }
            }}
            customParameters={
              selectedNode ? nodeCustomParameters[selectedNode] || [] : []
            }
            onAddCustomParameter={() => {
              if (selectedNode) {
                const newParam = {
                  id: `param-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  name: "",
                  type: "string",
                };
                setNodeCustomParameters((prev) => ({
                  ...prev,
                  [selectedNode]: [...(prev[selectedNode] || []), newParam],
                }));
              }
            }}
            onUpdateCustomParameter={(paramId, updates) => {
              if (selectedNode) {
                setNodeCustomParameters((prev) => ({
                  ...prev,
                  [selectedNode]: (prev[selectedNode] || []).map((param) =>
                    param.id === paramId ? { ...param, ...updates } : param
                  ),
                }));
              }
            }}
            onDeleteCustomParameter={(paramId) => {
              if (selectedNode) {
                setNodeCustomParameters((prev) => ({
                  ...prev,
                  [selectedNode]: (prev[selectedNode] || []).filter(
                    (param) => param.id !== paramId
                  ),
                }));
                // Also remove the parameter value
                setNodeParameterValues((prev) => {
                  const newValues = { ...prev };
                  if (newValues[selectedNode]) {
                    delete newValues[selectedNode][paramId];
                  }
                  return newValues;
                });
              }
            }}
          />
        </Allotment.Pane>
      </Allotment>

      {/* Add Step Modal */}
      <AddStepModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleSelectItem}
      />

      {/* Delete Step Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete step?"
        description={
          <>
            This will permanently delete{" "}
            {getSelectedStepNumber() !== null
              ? `step ${getSelectedStepNumber()}`
              : "this step"}
            {getSelectedStep()?.name ? ` "${getSelectedStep()?.name}"` : ""}{" "}
            from the flow.
          </>
        }
        confirmButtonText="Delete step"
        showWarning={false}
      />

      {/* Replace Warning Dialog */}
      <DeleteConfirmationDialog
        open={replaceWarningDialogOpen}
        onClose={handleReplaceCancel}
        onConfirm={handleReplaceConfirm}
        title="Unsaved edits will be lost"
        description={
          <>
            You have unsaved parameter values for{" "}
            {getSelectedStepNumber() !== null
              ? `step ${getSelectedStepNumber()}`
              : "this step"}
            {getSelectedStep()?.name ? ` "${getSelectedStep()?.name}"` : ""}.
            Replacing this step will discard all current edits.
          </>
        }
        confirmButtonText="Replace anyway"
        showWarning={true}
      />
    </Box>
  );
}
