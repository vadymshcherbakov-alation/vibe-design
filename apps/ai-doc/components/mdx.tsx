import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  Tool,
  ToolHeader,
  ToolBody,
  ToolInput,
  ToolOutput,
  ToolTimeline,
  ToolTimelineHeader,
  ToolTimelineInput,
  ToolTimelineOutput,
  ToolTimelineFooter,
  Attachment,
  Attachments,
  PromptInput,
  Shimmer,
} from './ai-ui';
import { PreviewBox } from './preview-box';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    PreviewBox,
    Reasoning,
    ReasoningTrigger,
    ReasoningContent,
    Tool,
    ToolHeader,
    ToolBody,
    ToolInput,
    ToolOutput,
    ToolTimeline,
    ToolTimelineHeader,
    ToolTimelineInput,
    ToolTimelineOutput,
    ToolTimelineFooter,
    Attachment,
    Attachments,
    PromptInput,
    Shimmer,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
