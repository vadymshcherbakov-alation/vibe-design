"use client";
import { Box } from "@mui/material";
import { Suspense, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { SearchFilters } from "./components/search-filters";
import { SearchResults } from "./components/search-results";
import { CollapsiblePanel } from "../settings/custom_templates/components/collapsible-panel";

function SearchPageContent() {
  const theme = useTheme();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selections, setSelections] = useState<Record<string, Set<string>>>({});

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        height: "100%",
        overflow: "hidden",
        position: "relative",
        backgroundColor: sidebarExpanded ? "inherit" : "#ffffff"
      }}
    >
      <CollapsiblePanel
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        defaultWidth={320}
        minWidth={260}
        maxWidth={500}
        toggleButtonTop="56px"
        backgroundColor={theme.palette.neutral[50]}
      >
        <SearchFilters selections={selections} setSelections={setSelections} />
      </CollapsiblePanel>

      <SearchResults selections={selections} setSelections={setSelections} />
    </Box>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
