"use client";
import React from "react";
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
  $isParagraphNode,
  TextNode,
  DecoratorNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  ElementNode,
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

interface LexicalStringEditorProps {
  value: string;
  onChange: (value: string) => void;
  currentNodeId?: string;
  onOpenPopupRef?: React.MutableRefObject<
    ((anchorEl?: HTMLElement | null) => void) | null
  >;
}

// Custom decorator node for reference badges
type SerializedReferenceNode = Spread<
  {
    referenceText: string;
  },
  SerializedLexicalNode
>;

export class ReferenceDecoratorNode extends DecoratorNode<React.ReactNode> {
  __referenceText: string;

  static getType(): string {
    return "reference-decorator";
  }

  static clone(node: ReferenceDecoratorNode): ReferenceDecoratorNode {
    return new ReferenceDecoratorNode(node.__referenceText, node.__key);
  }

  constructor(referenceText: string, key?: NodeKey) {
    super(key);
    this.__referenceText = referenceText;
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.style.display = "inline-flex";
    span.style.alignItems = "center";
    span.setAttribute("contenteditable", "false");
    return span;
  }

  updateDOM(): boolean {
    return false;
  }

  static importJSON(
    serializedNode: SerializedReferenceNode
  ): ReferenceDecoratorNode {
    const { referenceText } = serializedNode;
    return $createReferenceDecoratorNode(referenceText);
  }

  exportJSON(): SerializedReferenceNode {
    return {
      referenceText: this.__referenceText,
      type: "reference-decorator",
      version: 1,
    };
  }

  getReferenceText(): string {
    return this.__referenceText;
  }

  decorate(): React.ReactNode {
    return <ReferenceBadgeWrapper referenceText={this.__referenceText} />;
  }
}

export function $createReferenceDecoratorNode(
  referenceText: string
): ReferenceDecoratorNode {
  return new ReferenceDecoratorNode(referenceText);
}

export function $isReferenceDecoratorNode(
  node: any
): node is ReferenceDecoratorNode {
  return node instanceof ReferenceDecoratorNode;
}

// React component to render the reference badge
function ReferenceBadgeWrapper({ referenceText }: { referenceText: string }) {
  return <ReferenceBadge referenceText={referenceText} />;
}

// Helper function to parse text and create nodes with reference decorators
// Only creates decorator nodes for complete, valid references (must have both {{ and }})
function parseTextWithReferences(text: string) {
  const paragraph = $createParagraphNode();
  if (!text) {
    return paragraph;
  }

  // Regex to match complete {{...}} patterns only
  const referencePattern = /\{\{[^}]+\}\}/g;
  const matches: Array<{ index: number; length: number; text: string }> = [];
  let match;

  // Collect all matches first
  while ((match = referencePattern.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      text: match[0],
    });
  }

  // If no matches, add all text as normal
  if (matches.length === 0) {
    paragraph.append($createTextNode(text));
    return paragraph;
  }

  // Build nodes from matches
  let lastIndex = 0;
  matches.forEach((refMatch) => {
    // Add text before the reference
    if (refMatch.index > lastIndex) {
      const beforeText = text.substring(lastIndex, refMatch.index);
      if (beforeText) {
        paragraph.append($createTextNode(beforeText));
      }
    }

    // Add the reference as a decorator node
    const referenceNode = $createReferenceDecoratorNode(refMatch.text);
    paragraph.append(referenceNode);

    lastIndex = refMatch.index + refMatch.length;
  });

  // Add remaining text after last reference
  if (lastIndex < text.length) {
    const afterText = text.substring(lastIndex);
    if (afterText) {
      paragraph.append($createTextNode(afterText));
    }
  }

  return paragraph;
}

// Plugin to handle initial value and external updates
function InitialValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const previousValueRef = useRef<string | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount since editorState handles it
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousValueRef.current = value;
      return;
    }

    // Only update if value changed externally (not from our own onChange)
    if (previousValueRef.current !== value) {
      editor.update(() => {
        const root = $getRoot();
        const currentText = getTextContentWithReferences(root);
        // Only update if the value is different from current editor content
        // This prevents updates when user is typing
        if (currentText !== value) {
          root.clear();
          const paragraph = parseTextWithReferences(value);
          root.append(paragraph);
        }
      });
      previousValueRef.current = value;
    }
  }, [editor, value]);

  return null;
}

// Helper to extract text content including references from decorator nodes
function getTextContentWithReferences(root: any): string {
  let text = "";
  const children = root.getChildren();
  for (const child of children) {
    if ($isReferenceDecoratorNode(child)) {
      text += child.getReferenceText();
    } else if (child instanceof TextNode) {
      text += child.getTextContent();
    } else if (child.getChildren) {
      text += getTextContentWithReferences(child);
    }
  }
  return text;
}

// Plugin to show popup when user types {
function BracePopupPlugin({
  onOpenChange,
  containerRef,
  isOpen,
}: {
  onOpenChange: (open: boolean, anchorEl: HTMLElement | null) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
}) {
  const [editor] = useLexicalComposerContext();
  const lastCharRef = useRef<string>("");
  const anchorElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const textContent = anchorNode.getTextContent();
          const anchorOffset = selection.anchor.offset;

          // Check if user just typed {
          const currentChar = textContent[anchorOffset - 1];

          // Close popup if user types something other than { or moves cursor away
          // But allow typing to continue - just close the popup
          if (isOpen && currentChar !== "{" && anchorOffset > 0) {
            onOpenChange(false, null);
            if (anchorElRef.current && anchorElRef.current.parentNode) {
              anchorElRef.current.parentNode.removeChild(anchorElRef.current);
            }
            anchorElRef.current = null;
            lastCharRef.current = currentChar || "";
            // Don't return - allow the character to be inserted
          }

          if (currentChar === "{" && lastCharRef.current !== "{") {
            lastCharRef.current = "{";

            // Get the DOM element for positioning
            const domSelection = window.getSelection();
            if (domSelection && domSelection.rangeCount > 0) {
              const range = domSelection.getRangeAt(0);
              const rect = range.getBoundingClientRect();

              // Use the container as anchor, but position relative to cursor
              if (containerRef.current) {
                const containerRect =
                  containerRef.current.getBoundingClientRect();
                const relativeLeft = rect.left - containerRect.left;
                const relativeTop = rect.top - containerRect.top;

                // Clean up previous anchor if exists
                if (anchorElRef.current && anchorElRef.current.parentNode) {
                  anchorElRef.current.parentNode.removeChild(
                    anchorElRef.current
                  );
                }

                // Create a temporary anchor element at cursor position
                const anchorEl = document.createElement("span");
                anchorEl.style.position = "absolute";
                anchorEl.style.left = `${relativeLeft}px`;
                anchorEl.style.top = `${relativeTop}px`;
                anchorEl.style.width = "1px";
                anchorEl.style.height = "1px";
                containerRef.current.appendChild(anchorEl);
                anchorElRef.current = anchorEl;

                onOpenChange(true, anchorEl);
              }
            }
          } else if (currentChar !== "{") {
            lastCharRef.current = currentChar || "";
          }
        }
      });
    });
  }, [editor, onOpenChange, containerRef, isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (anchorElRef.current && anchorElRef.current.parentNode) {
        anchorElRef.current.parentNode.removeChild(anchorElRef.current);
      }
    };
  }, []);

  return null;
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

// Plugin to convert references to decorator nodes as user types
// Only creates decorator nodes for complete references, removes them for partial/invalid ones
function ReferenceHighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  const processedTextRef = useRef<string>("");
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      // Skip if we're in the middle of updating to avoid infinite loops
      if (isUpdatingRef.current) {
        return;
      }

      editorState.read(() => {
        const root = $getRoot();
        const currentText = getTextContentWithReferences(root);

        // Always reprocess if text changed
        if (currentText !== processedTextRef.current) {
          const paragraph = root.getFirstChild();
          const referencePattern = /\{\{[^}]+\}\}/g;
          const hasReferences = referencePattern.test(currentText);

          // Check if we need to rebuild
          let needsRebuild = false;

          if (hasReferences) {
            // Check if any reference is not a decorator node
            if (paragraph && $isParagraphNode(paragraph)) {
              const children = paragraph.getChildren();
              const hasTextNodeWithReference = children.some((child) => {
                if (child instanceof TextNode) {
                  const text = child.getTextContent();
                  return referencePattern.test(text);
                }
                return false;
              });

              if (hasTextNodeWithReference) {
                needsRebuild = true;
              }
            }
          } else {
            // No references - check if we still have decorator nodes
            if (paragraph && $isParagraphNode(paragraph)) {
              const children = paragraph.getChildren();
              const hasDecoratorNode = children.some((child) =>
                $isReferenceDecoratorNode(child)
              );

              if (hasDecoratorNode) {
                needsRebuild = true;
              }
            }
          }

          if (needsRebuild) {
            isUpdatingRef.current = true;
            // Use requestAnimationFrame to ensure we update after Lexical's current cycle
            requestAnimationFrame(() => {
              editor.update(() => {
                const root = $getRoot();
                const paragraph = root.getFirstChild();
                if (paragraph) {
                  paragraph.remove();
                }
                const newParagraph = parseTextWithReferences(currentText);
                root.append(newParagraph);
                processedTextRef.current = currentText;
                isUpdatingRef.current = false;
              });
            });
          } else {
            processedTextRef.current = currentText;
          }
        }
      });
    });
  }, [editor]);

  return null;
}

export function LexicalStringEditor({
  value,
  onChange,
  currentNodeId,
  onOpenPopupRef,
}: LexicalStringEditorProps) {
  const staticPlaceholder = "Enter value or use { reference data";
  const theme = useTheme();
  const [popupOpen, setPopupOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openedFromButton, setOpenedFromButton] = useState(false);
  const [isDynamicAnchor, setIsDynamicAnchor] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const { draftFlow, currentFlow } = useFlowEditStore();

  // Expose method to open popup programmatically
  useEffect(() => {
    if (onOpenPopupRef) {
      onOpenPopupRef.current = (buttonAnchorEl?: HTMLElement | null) => {
        // If button anchor is provided, use it directly
        if (buttonAnchorEl) {
          setOpenedFromButton(true);
          setIsDynamicAnchor(false); // Button is not a dynamically created element
          // Move cursor to end of editor before opening popup
          if (editor) {
            editor.update(() => {
              const root = $getRoot();
              const paragraph = root.getFirstChild();
              if (paragraph && $isParagraphNode(paragraph)) {
                const lastChild = paragraph.getLastChild();
                if (lastChild) {
                  lastChild.selectEnd();
                } else {
                  paragraph.selectEnd();
                }
              }
            });
          }
          setAnchorEl(buttonAnchorEl);
          setPopupOpen(true);
          return;
        }

        // Reset flag when opened from typing {
        setOpenedFromButton(false);

        // Otherwise, try to position at cursor
        if (editorContainerRef.current && editor) {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              // Move cursor to end if not already there
              const root = $getRoot();
              const paragraph = root.getFirstChild();
              if (paragraph && $isParagraphNode(paragraph)) {
                const lastChild = paragraph.getLastChild();
                if (lastChild) {
                  lastChild.selectEnd();
                } else {
                  paragraph.selectEnd();
                }
              }
            }
          });

          // Use requestAnimationFrame to ensure DOM is updated
          requestAnimationFrame(() => {
            if (editorContainerRef.current) {
              // Get cursor position from selection
              const domSelection = window.getSelection();
              if (domSelection && domSelection.rangeCount > 0) {
                const range = domSelection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const containerRect =
                  editorContainerRef.current.getBoundingClientRect();

                // Create anchor element at cursor position
                const anchorEl = document.createElement("span");
                anchorEl.style.position = "absolute";
                anchorEl.style.left = `${rect.left - containerRect.left}px`;
                anchorEl.style.top = `${rect.top - containerRect.top}px`;
                anchorEl.style.width = "1px";
                anchorEl.style.height = "1px";
                editorContainerRef.current.appendChild(anchorEl);
                setIsDynamicAnchor(true); // This is a dynamically created element
                setAnchorEl(anchorEl);
                setPopupOpen(true);
              } else {
                // Fallback: position at end of editor
                const anchorEl = document.createElement("span");
                anchorEl.style.position = "absolute";
                anchorEl.style.left = "12px";
                anchorEl.style.top = `${editorContainerRef.current.offsetHeight - 8}px`;
                anchorEl.style.width = "1px";
                anchorEl.style.height = "1px";
                editorContainerRef.current.appendChild(anchorEl);
                setIsDynamicAnchor(true); // This is a dynamically created element
                setAnchorEl(anchorEl);
                setPopupOpen(true);
              }
            }
          });
        }
      };
    }
    return () => {
      if (onOpenPopupRef) {
        onOpenPopupRef.current = null;
      }
    };
  }, [onOpenPopupRef, editor]);

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
    namespace: "ParameterInputField",
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
        className="lexical-editor-container"
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "36px",
          maxHeight: "96px", // 4 lines (4 * 20px lineHeight) + 16px padding
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${theme.palette.neutral[300]}`,
          borderRadius: "4px",
          backgroundColor: "#ffffff",
          padding: "8px 12px",
          fontSize: `${13}px`,
          fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: theme.palette.text.primary,
          overflowY: "auto",
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
            wordBreak: "break-word",
          },
        }}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              style={{
                outline: "none",
                minHeight: "20px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            />
          }
          placeholder={
            <Box
              component="div"
              sx={{
                position: "absolute",
                top: "8px",
                left: "12px",
                pointerEvents: "none",
                color: theme.palette.text.disabled,
                fontSize: `${13}px`,
                fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}
            >
              {staticPlaceholder}
            </Box>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <InitialValuePlugin value={value} />
        <BracePopupPlugin
          onOpenChange={handlePopupOpenChange}
          containerRef={editorContainerRef}
          isOpen={popupOpen}
        />
        <EditorExposerPlugin onEditorReady={setEditor} />
        <ReferenceHighlightPlugin />
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
