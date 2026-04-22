"use client";

import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { getAgentById } from "../../../agents/agent-data";
import { EditModeContext, useEditMode } from "../edit-mode-context";
import { CollapsibleSection } from "./collapsible-section";
import { GeneralSection } from "./general-section";
import { InputSection } from "./input-section";
import { OutputSection } from "./output-section";
import { SystemPromptSection } from "./system-prompt-section";
import { ToolsSection } from "./tools-section";

type SectionId = "general" | "input" | "tools" | "system-prompt" | "output";

const SECTION_ORDER: SectionId[] = [
  "general",
  "input",
  "tools",
  "system-prompt",
  "output",
];

const SECTION_ELEMENT_ID: Record<SectionId, string> = {
  general: "agents2-section-general",
  input: "agents2-section-input",
  tools: "agents2-section-tools",
  "system-prompt": "agents2-section-system-prompt",
  output: "agents2-section-output",
};

const NOOP_SET_EDIT_MODE = (_value: boolean) => {};

export function AgentDetailPane() {
  const params = useParams();
  const { isEditMode } = useEditMode();
  const [editingSection, setEditingSection] = useState<SectionId | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const agentId = params.id as string;
  const agent = getAgentById(agentId);

  const scrollToSection = (targetSection: SectionId) => {
    requestAnimationFrame(() => {
      const sectionElement = document.getElementById(
        SECTION_ELEMENT_ID[targetSection],
      );
      const scrollContainer = scrollContainerRef.current;
      if (!sectionElement || !scrollContainer) {
        return;
      }

      const targetTop =
        sectionElement.getBoundingClientRect().top -
        scrollContainer.getBoundingClientRect().top +
        scrollContainer.scrollTop -
        24;

      scrollContainer.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    });
  };

  const handleNextSection = (currentSection: SectionId) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const nextSection = SECTION_ORDER[currentIndex + 1];
    setEditingSection(nextSection ?? null);

    if (nextSection) {
      // Wait for state update/render, then snap next section with top offset.
      scrollToSection(nextSection);
    }
  };

  const handlePreviousSection = (currentSection: SectionId) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const previousSection = SECTION_ORDER[currentIndex - 1];
    if (!previousSection) {
      return;
    }

    setEditingSection(previousSection);
    // Wait for state update/render, then snap previous section with top offset.
    scrollToSection(previousSection);
  };

  if (!agent) {
    return null;
  }

  return (
    <Box
      ref={scrollContainerRef}
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "#FAFAFA",
      }}
    >
      {/* Content Container */}
      <Box
        sx={{
          maxWidth: "1280px",
          margin: "0 auto",
          px: "24px",
          py: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* General Section */}
        <CollapsibleSection
          sectionId={SECTION_ELEMENT_ID.general}
          title="General"
          defaultExpanded={true}
          forceExpandedWhen={isEditMode || editingSection === "general"}
          onEditClick={() =>
            setEditingSection((previous) =>
              previous === "general" ? null : "general",
            )
          }
          onNextSectionClick={() => handleNextSection("general")}
          disableCollapse={editingSection === "general"}
          isEditing={editingSection === "general"}
        >
          <GeneralSection
            agent={agent}
            isEditMode={isEditMode || editingSection === "general"}
          />
        </CollapsibleSection>

        {/* Input Section */}
        <CollapsibleSection
          sectionId={SECTION_ELEMENT_ID.input}
          title="Input"
          badgeCount={6}
          defaultExpanded={true}
          forceExpandedWhen={isEditMode || editingSection === "input"}
          onEditClick={() =>
            setEditingSection((previous) => (previous === "input" ? null : "input"))
          }
          onNextSectionClick={() => handleNextSection("input")}
          onPreviousSectionClick={() => handlePreviousSection("input")}
          disableCollapse={editingSection === "input"}
          isEditing={editingSection === "input"}
        >
          <EditModeContext.Provider
            value={{
              isEditMode: isEditMode || editingSection === "input",
              setIsEditMode: NOOP_SET_EDIT_MODE,
            }}
          >
            <InputSection agentName={agent.name} />
          </EditModeContext.Provider>
        </CollapsibleSection>

        {/* Tools Section */}
        <CollapsibleSection
          sectionId={SECTION_ELEMENT_ID.tools}
          title="Tools"
          badgeCount={agent.tools?.length ?? 0}
          defaultExpanded={true}
          forceExpandedWhen={isEditMode || editingSection === "tools"}
          onEditClick={() =>
            setEditingSection((previous) => (previous === "tools" ? null : "tools"))
          }
          onNextSectionClick={() => handleNextSection("tools")}
          onPreviousSectionClick={() => handlePreviousSection("tools")}
          disableCollapse={editingSection === "tools"}
          isEditing={editingSection === "tools"}
        >
          <EditModeContext.Provider
            value={{
              isEditMode: isEditMode || editingSection === "tools",
              setIsEditMode: NOOP_SET_EDIT_MODE,
            }}
          >
            <ToolsSection agent={agent} />
          </EditModeContext.Provider>
        </CollapsibleSection>

        {/* System Prompt Section */}
        <CollapsibleSection
          sectionId={SECTION_ELEMENT_ID["system-prompt"]}
          title="System prompt"
          defaultExpanded={true}
          forceExpandedWhen={isEditMode || editingSection === "system-prompt"}
          onEditClick={() =>
            setEditingSection((previous) =>
              previous === "system-prompt" ? null : "system-prompt",
            )
          }
          onNextSectionClick={() => handleNextSection("system-prompt")}
          onPreviousSectionClick={() => handlePreviousSection("system-prompt")}
          disableCollapse={editingSection === "system-prompt"}
          isEditing={editingSection === "system-prompt"}
        >
          <EditModeContext.Provider
            value={{
              isEditMode: isEditMode || editingSection === "system-prompt",
              setIsEditMode: NOOP_SET_EDIT_MODE,
            }}
          >
            <SystemPromptSection />
          </EditModeContext.Provider>
        </CollapsibleSection>

        {/* Output Section */}
        <CollapsibleSection
          sectionId={SECTION_ELEMENT_ID.output}
          title="Output"
          badgeCount={0}
          defaultExpanded={true}
          forceExpandedWhen={isEditMode || editingSection === "output"}
          onEditClick={() =>
            setEditingSection((previous) => (previous === "output" ? null : "output"))
          }
          onNextSectionClick={() => handleNextSection("output")}
          onPreviousSectionClick={() => handlePreviousSection("output")}
          disableCollapse={editingSection === "output"}
          isEditing={editingSection === "output"}
        >
          <OutputSection />
        </CollapsibleSection>
      </Box>
    </Box>
  );
}
