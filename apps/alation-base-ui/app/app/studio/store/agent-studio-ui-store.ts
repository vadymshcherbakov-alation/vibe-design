import { create } from "zustand";

interface AgentStudioUIState {
  isSubNavOpen: boolean;
  setIsSubNavOpen: (open: boolean) => void;
}

export const useAgentStudioUIStore = create<AgentStudioUIState>((set) => ({
  isSubNavOpen: true,
  setIsSubNavOpen: (open) => set({ isSubNavOpen: open }),
}));


