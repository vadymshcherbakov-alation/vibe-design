"use client";

import { CreateEvalRunModal, type CreateEvalRunModalProps } from "./create-eval-run-modal";

/** Props for the canvas: same as modal but without open/onClose (canvas is always “open”). */
export type CreateEvalRunCanvasProps = Omit<
  CreateEvalRunModalProps,
  "open" | "onClose" | "variant"
>;

/**
 * Design canvas that lays out all four create-eval-run steps on the page.
 * No modals – each step is shown in its own section for design review and debugging.
 */
export function CreateEvalRunCanvas(props: CreateEvalRunCanvasProps) {
  return (
    <CreateEvalRunModal
      {...props}
      open
      variant="canvas"
      onClose={() => {}}
    />
  );
}
