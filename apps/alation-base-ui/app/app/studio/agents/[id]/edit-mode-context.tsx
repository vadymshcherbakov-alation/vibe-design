"use client";

import { createContext, useContext } from "react";

interface EditModeContextType {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

export const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  setIsEditMode: () => {},
});

export function useEditMode() {
  return useContext(EditModeContext);
}
