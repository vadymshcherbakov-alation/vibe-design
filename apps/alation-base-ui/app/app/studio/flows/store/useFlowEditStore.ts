import { create } from "zustand";
import { WorkflowStep } from "../schedule/components/types";

type TabId = "flow" | "runs" | "schedule" | "access";

interface FlowData {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  startNodeInputs?: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
}

interface UIState {
  // Dialog states
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  runDialogOpen: boolean;

  // Menu state
  menuAnchorEl: HTMLElement | null;

  // Active tab
  activeTab: TabId;

  // Saving state
  savingState: "idle" | "saving" | "saved";

  // Health check state
  healthCheckLoading: boolean;
  healthCheckResult: {
    checkedAt: Date;
    hasError: boolean;
    hasIssues: boolean;
    errorsByNode: Record<string, string[]>;
    issuesByNode: Record<string, string[]>;
    snapshot: {
      steps: Array<{ id: string; label: string }>;
      startNodeInputs: Array<{ name: string; type: string }>;
    };
  } | null;
  healthCheckExpanded: boolean;
}

interface FlowEditState {
  // Current flow data
  currentFlow: FlowData | null;

  // Draft changes (unsaved edits)
  draftFlow: Partial<FlowData> | null;

  // UI state
  ui: UIState;

  // Schedule authorization
  scheduleAuthorized: boolean;

  // Actions
  setCurrentFlow: (flow: FlowData | null) => void;
  updateDraftFlow: (updates: Partial<FlowData>) => void;
  clearDraftFlow: () => void;
  commitDraftToCurrent: () => void;

  // UI actions
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setRunDialogOpen: (open: boolean) => void;
  setMenuAnchorEl: (el: HTMLElement | null) => void;
  setActiveTab: (tab: TabId) => void;
  setSavingState: (state: "idle" | "saving" | "saved") => void;
  setHealthCheckLoading: (loading: boolean) => void;
  setHealthCheckResult: (
    result: {
      checkedAt: Date;
      hasError: boolean;
      hasIssues: boolean;
      errorsByNode: Record<string, string[]>;
      issuesByNode: Record<string, string[]>;
      snapshot: {
        steps: Array<{ id: string; label: string }>;
        startNodeInputs: Array<{ name: string; type: string }>;
      };
    } | null
  ) => void;
  setHealthCheckExpanded: (expanded: boolean) => void;

  // Flow data actions
  updateFlowName: (name: string) => void;
  updateFlowDescription: (description: string) => void;
  updateFlowSteps: (steps: WorkflowStep[]) => void;
  addFlowStep: (step: WorkflowStep) => void;
  removeFlowStep: (stepId: string) => void;
  duplicateFlowStep: (stepId: string) => void;
  updateStartNodeInputs: (
    inputs: Array<{
      name: string;
      type: string;
      description?: string;
    }>
  ) => void;

  // Schedule authorization
  setScheduleAuthorized: (authorized: boolean) => void;

  // Reset store
  reset: () => void;
}

const initialState: {
  currentFlow: FlowData | null;
  draftFlow: Partial<FlowData> | null;
  ui: UIState;
  scheduleAuthorized: boolean;
} = {
  currentFlow: null,
  draftFlow: null,
  ui: {
    editDialogOpen: false,
    deleteDialogOpen: false,
    runDialogOpen: false,
    menuAnchorEl: null,
    activeTab: "flow",
    savingState: "idle",
    healthCheckLoading: false,
    healthCheckResult: null,
    healthCheckExpanded: false,
  },
  scheduleAuthorized: false,
};

export const useFlowEditStore = create<FlowEditState>((set) => ({
  ...initialState,

  setCurrentFlow: (flow) =>
    set({
      currentFlow: flow,
      draftFlow: flow
        ? {
            name: flow.name,
            description: flow.description,
            steps: flow.steps,
          }
        : null,
    }),

  updateDraftFlow: (updates) =>
    set((state) => ({
      draftFlow: {
        ...state.draftFlow,
        ...updates,
      },
    })),

  clearDraftFlow: () =>
    set({
      draftFlow: null,
    }),

  commitDraftToCurrent: () =>
    set((state) => {
      if (!state.currentFlow || !state.draftFlow) {
        return state;
      }
      return {
        currentFlow: {
          ...state.currentFlow,
          ...state.draftFlow,
        },
        draftFlow: {
          name: state.draftFlow.name ?? state.currentFlow.name,
          description:
            state.draftFlow.description ?? state.currentFlow.description,
          steps: state.draftFlow.steps ?? state.currentFlow.steps,
        },
      };
    }),

  setEditDialogOpen: (open) =>
    set((state) => ({
      ui: {
        ...state.ui,
        editDialogOpen: open,
      },
    })),

  setDeleteDialogOpen: (open) =>
    set((state) => ({
      ui: {
        ...state.ui,
        deleteDialogOpen: open,
      },
    })),

  setRunDialogOpen: (open) =>
    set((state) => ({
      ui: {
        ...state.ui,
        runDialogOpen: open,
      },
    })),

  setMenuAnchorEl: (el) =>
    set((state) => ({
      ui: {
        ...state.ui,
        menuAnchorEl: el,
      },
    })),

  setActiveTab: (tab) =>
    set((state) => ({
      ui: {
        ...state.ui,
        activeTab: tab,
      },
    })),

  setSavingState: (state) =>
    set((currentState) => ({
      ui: {
        ...currentState.ui,
        savingState: state,
      },
    })),

  setHealthCheckLoading: (loading) =>
    set((currentState) => ({
      ui: {
        ...currentState.ui,
        healthCheckLoading: loading,
      },
    })),

  setHealthCheckResult: (result) =>
    set((currentState) => ({
      ui: {
        ...currentState.ui,
        healthCheckResult: result,
      },
    })),

  setHealthCheckExpanded: (expanded) =>
    set((currentState) => ({
      ui: {
        ...currentState.ui,
        healthCheckExpanded: expanded,
      },
    })),

  updateFlowName: (name) =>
    set((state) => ({
      draftFlow: {
        ...state.draftFlow,
        name,
      },
    })),

  updateFlowDescription: (description) =>
    set((state) => ({
      draftFlow: {
        ...state.draftFlow,
        description,
      },
    })),

  updateFlowSteps: (steps) =>
    set((state) => {
      const currentNodes =
        state.draftFlow?.steps || state.currentFlow?.steps || [];
      console.log("Current nodes in store:", currentNodes);
      console.log("Updating to new steps:", steps);
      return {
        draftFlow: {
          ...state.draftFlow,
          steps,
        },
      };
    }),

  addFlowStep: (step) =>
    set((state) => {
      const currentSteps =
        state.draftFlow?.steps || state.currentFlow?.steps || [];
      return {
        draftFlow: {
          ...state.draftFlow,
          steps: [...currentSteps, step],
        },
      };
    }),

  removeFlowStep: (stepId) =>
    set((state) => {
      const currentSteps =
        state.draftFlow?.steps || state.currentFlow?.steps || [];
      return {
        draftFlow: {
          ...state.draftFlow,
          steps: currentSteps.filter((s) => s.id !== stepId),
        },
      };
    }),

  duplicateFlowStep: (stepId) =>
    set((state) => {
      const currentSteps =
        state.draftFlow?.steps || state.currentFlow?.steps || [];
      const stepIndex = currentSteps.findIndex((s) => s.id === stepId);

      if (stepIndex === -1 || !currentSteps[stepIndex]) {
        return state;
      }

      const originalStep = currentSteps[stepIndex];
      const newStep: WorkflowStep = {
        id: `${Date.now()}`,
        icon: originalStep.icon,
        label: originalStep.label,
        secondaryText: originalStep.secondaryText,
      };

      const newSteps = [...currentSteps];
      newSteps.splice(stepIndex + 1, 0, newStep);

      return {
        draftFlow: {
          ...state.draftFlow,
          steps: newSteps,
        },
      };
    }),

  updateStartNodeInputs: (inputs) =>
    set((state) => ({
      draftFlow: {
        ...state.draftFlow,
        startNodeInputs: inputs,
      },
    })),

  setScheduleAuthorized: (authorized) =>
    set({
      scheduleAuthorized: authorized,
    }),

  reset: () => set(initialState),
}));
