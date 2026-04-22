"use client";
import { Box, Popover } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState, useMemo } from "react";
import { useFlowEditStore } from "../store/useFlowEditStore";
import {
  $getRoot,
  EditorState,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  TextNode,
  DecoratorNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ReferencePopupMenu } from "./reference-popup-menu";
import { ReferenceBadge } from "./reference-badge";
import {
  ReferenceDecoratorNode,
  $createReferenceDecoratorNode,
  $isReferenceDecoratorNode,
} from "./lexical-string-editor";

interface LexicalStringEditorModalProps {
  value: string;
  onChange: (value: string) => void;
  currentNodeId?: string;
  placeholder?: string;
}

// React component to render the reference badge
function ReferenceBadgeWrapper({ referenceText }: { referenceText: string }) {
  return <ReferenceBadge referenceText={referenceText} />;
}

// Plugin to expose editor to parent
function EditorExposerPlugin({
  onEditorReady,
}: {
  onEditorReady: (editor: any) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    onEditorReady(editor);
  }, [editor, onEditorReady]);

  return null;
}

// Plugin to handle brace popup
function BracePopupPlugin({
  onOpenChange,
  containerRef,
  isOpen,
}: {
  onOpenChange: (open: boolean, el: HTMLElement | null) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor || !containerRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "{") {
        const selection = editor.getEditorState().read(() => {
          return $getSelection();
        });

        if ($isRangeSelection(selection)) {
          // Get cursor position from DOM selection
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const range = domSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = containerRef.current?.getBoundingClientRect();

            if (containerRect && containerRef.current) {
              // Create anchor element at cursor position
              const anchor = document.createElement("span");
              anchor.style.position = "absolute";
              anchor.style.left = `${rect.left - containerRect.left}px`;
              anchor.style.top = `${rect.top - containerRect.top}px`;
              anchor.style.width = "1px";
              anchor.style.height = "1px";
              containerRef.current.appendChild(anchor);
              onOpenChange(true, anchor);
            }
          }
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isOpen && event.key !== "{") {
        // Allow typing to continue
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [editor, containerRef, onOpenChange, isOpen]);

  return null;
}

// Helper function to parse text and create nodes with reference decorators
function parseTextWithReferences(text: string) {
  const paragraph = $createParagraphNode();
  const referenceRegex = /\{\{([^}]+)\}\}/g;
  let lastIndex = 0;
  let match;

  while ((match = referenceRegex.exec(text)) !== null) {
    // Add text before the reference
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore) {
        paragraph.append($createTextNode(textBefore));
      }
    }

    // Add reference decorator node
    const referenceText = match[0];
    const referenceNode = $createReferenceDecoratorNode(referenceText);
    paragraph.append(referenceNode);

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      paragraph.append($createTextNode(remainingText));
    }
  }

  // If paragraph is empty, add empty text node
  if (paragraph.getChildrenSize() === 0) {
    paragraph.append($createTextNode(""));
  }

  return paragraph;
}

// Helper function to extract text content with references
function getTextContentWithReferences(root: any): string {
  let text = "";
  const children = root.getChildren();

  for (const child of children) {
    if ($isReferenceDecoratorNode(child)) {
      text += child.getReferenceText();
    } else if (child instanceof TextNode) {
      text += child.getTextContent();
    } else {
      text += getTextContentWithReferences(child);
    }
  }

  return text;
}

export function LexicalStringEditorModal({
  value,
  onChange,
  currentNodeId,
  placeholder = "Enter value or use { to reference data",
}: LexicalStringEditorModalProps) {
  const theme = useTheme();
  const [popupOpen, setPopupOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openedFromButton, setOpenedFromButton] = useState(false);
  const [isDynamicAnchor, setIsDynamicAnchor] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const { draftFlow, currentFlow } = useFlowEditStore();

  // Get all nodes from store
  const allNodes = useMemo(() => {
    return draftFlow?.steps || currentFlow?.steps || [];
  }, [draftFlow?.steps, currentFlow?.steps]);

  // Calculate upstream nodes and their outputs
  const upstreamOutputs = useMemo(() => {
    if (!currentNodeId) {
      return [];
    }

    // If current node is start, no upstream nodes
    if (currentNodeId === "start") {
      return [];
    }

    // Extract outputs from upstream nodes
    const outputs: Array<{
      nodeId: string;
      nodeLabel: string;
      nodeType?: "Tool" | "Agent" | "Start";
      outputName: string;
      outputType: string;
      outputDescription: string;
    }> = [];

    // Add start node inputs FIRST as available outputs
    // (start node inputs are available to all downstream nodes)
    const startNodeInputs =
      draftFlow?.startNodeInputs || currentFlow?.startNodeInputs || [];
    if (startNodeInputs.length > 0) {
      startNodeInputs.forEach((input) => {
        outputs.push({
          nodeId: "start",
          nodeLabel: "Start",
          nodeType: "Start" as const,
          outputName: input.name,
          outputType: input.type,
          outputDescription: input.description || "",
        });
      });
    }

    // Find current node index to determine upstream nodes
    const currentNodeIndex = allNodes.findIndex(
      (node) => node.id === currentNodeId
    );

    // Only add upstream node outputs if current node was found in the flow
    if (currentNodeIndex > 0) {
      // Get all nodes before the current node (upstream)
      const upstreamNodes = allNodes.slice(0, currentNodeIndex);

      // Add outputs from upstream nodes
      upstreamNodes.forEach((node) => {
        if (node.outputParameters && node.outputParameters.length > 0) {
          node.outputParameters.forEach((output) => {
            outputs.push({
              nodeId: node.id,
              nodeLabel: node.label,
              nodeType: (node as any).type as
                | "Tool"
                | "Agent"
                | "Start"
                | undefined,
              outputName: output.name,
              outputType: output.type,
              outputDescription: output.description,
            });
          });
        }
      });
    }

    return outputs;
  }, [allNodes, currentNodeId, draftFlow, currentFlow]);

  const initialConfig = {
    namespace: "ParameterInputFieldModal",
    theme: {},
    nodes: [ReferenceDecoratorNode],
    onError: (error: Error) => {
      console.error(error);
    },
    editorState: value
      ? () => {
          const root = $getRoot();
          root.clear();
          const paragraph = parseTextWithReferences(value);
          root.append(paragraph);
        }
      : undefined,
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const text = getTextContentWithReferences(root);
      onChange(text);
    });
  };

  const handlePopupOpenChange = (open: boolean, el: HTMLElement | null) => {
    setPopupOpen(open);
    setAnchorEl(el);
    // When opened from typing {, it's not from button and anchor is dynamic
    if (open) {
      setOpenedFromButton(false);
      setIsDynamicAnchor(true); // Anchor from typing { is always dynamic
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setOpenedFromButton(false);
    // Clean up anchor element only if it was dynamically created (not the button)
    if (anchorEl && anchorEl.parentNode && isDynamicAnchor) {
      anchorEl.parentNode.removeChild(anchorEl);
    }
    setAnchorEl(null);
    setIsDynamicAnchor(false);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Box
        ref={editorContainerRef}
        className="lexical-editor-modal-container"
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${theme.palette.neutral[300]}`,
          borderRadius: "4px",
          backgroundColor: "#ffffff",
          padding: "12px",
          fontSize: `${13}px`,
          fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: theme.palette.text.primary,
          "&:hover": {
            borderColor: theme.palette.neutral[400],
          },
          "&:focus-within": {
            borderColor: theme.palette.primary.main,
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: "-2px",
          },
          "& p": {
            margin: 0,
            fontSize: `${13}px`,
            fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            color: theme.palette.text.primary,
            lineHeight: "20px",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          },
        }}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              style={{
                outline: "none",
                height: "100%",
                flex: 1,
                minHeight: "400px",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                overflowY: "auto",
              }}
            />
          }
          placeholder={
            <Box
              component="div"
              sx={{
                position: "absolute",
                top: "12px",
                left: "12px",
                pointerEvents: "none",
                color: theme.palette.text.disabled,
                fontSize: `${13}px`,
                fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}
            >
              {placeholder}
            </Box>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <BracePopupPlugin
          onOpenChange={handlePopupOpenChange}
          containerRef={editorContainerRef}
          isOpen={popupOpen}
        />
        <EditorExposerPlugin onEditorReady={setEditor} />
      </Box>
      <Popover
        open={popupOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopup}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disablePortal={false}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        sx={{
          mt: "4px",
        }}
      >
        <Box
          sx={{
            minWidth: "280px",
            maxWidth: "400px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {editor && (
            <ReferencePopupMenu
              upstreamOutputs={upstreamOutputs}
              onClose={handleClosePopup}
              editor={editor}
              openedFromButton={openedFromButton}
            />
          )}
        </Box>
      </Popover>
    </LexicalComposer>
  );
}
