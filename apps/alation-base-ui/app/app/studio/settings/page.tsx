"use client";

import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { ModelSelector } from "../components/ModelSelector";

/* Product areas and agents for per-feature overrides */
const PRODUCT_AREAS = [
  { id: "catalog", name: "Catalog" },
  { id: "governance", name: "Governance" },
  { id: "lineage", name: "Lineage" },
  { id: "search", name: "Search" },
  { id: "compliance", name: "Compliance" },
];

const AGENTS = [
  { id: "default-agent", name: "Default agent" },
  { id: "sql-agent", name: "SQL agent" },
  { id: "nl-agent", name: "Natural language agent" },
  { id: "docs-agent", name: "Documentation agent" },
  { id: "schema-agent", name: "Schema agent" },
  { id: "recommendations-agent", name: "Recommendations agent" },
];

export default function SettingsPage() {
  const theme = useTheme();
  const initialModelId = "alation-claude-sonnet";
  const [selectedModelId, setSelectedModelId] =
    useState<string>(initialModelId);
  const [savedModelId, setSavedModelId] = useState<string>(initialModelId);
  const [toastOpen, setToastOpen] = useState(false);

  type OverrideState = { enabled: boolean; modelId: string };
  const [productAreaOverrides, setProductAreaOverrides] = useState<
    Record<string, OverrideState>
  >({});
  const [agentOverrides, setAgentOverrides] = useState<
    Record<string, OverrideState>
  >({});

  const hasModelChanged = selectedModelId !== savedModelId;

  const getOverride = (
    overrides: Record<string, OverrideState>,
    id: string,
    defaultModelId: string,
  ): OverrideState =>
    overrides[id] ?? { enabled: false, modelId: defaultModelId };

  const setProductAreaOverride = (id: string, next: Partial<OverrideState>) => {
    setProductAreaOverrides((prev) => ({
      ...prev,
      [id]: { ...getOverride(prev, id, savedModelId), ...next },
    }));
  };
  const setAgentOverride = (id: string, next: Partial<OverrideState>) => {
    setAgentOverrides((prev) => ({
      ...prev,
      [id]: { ...getOverride(prev, id, savedModelId), ...next },
    }));
  };

  const handleSave = () => {
    setSavedModelId(selectedModelId);
    setToastOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        width: "100%",
      }}
    >
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: "24px",
          pb: "4px",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h2">Settings</Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: "24px",
          gap: "24px",
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Default Model Section */}
        <Box
          sx={{
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "8px",
            p: "24px",
            backgroundColor:
              "#ffffff",
          }}
        >
          <Typography variant="h2" sx={{ mb: 1 }}>
            Default model
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, mb: 3 }}
          >
            Set the default model for all default agents and product areas.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <ModelSelector
              value={selectedModelId}
              onChange={setSelectedModelId}
              placeholder="Select model"
            />
          </Box>
          <Box sx={{ mt: 3, display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setSelectedModelId(savedModelId)}
            >
              Reset to default
            </Button>
            <Button
              variant="contained"
              disabled={!hasModelChanged}
              onClick={handleSave}
              sx={{ ml: "auto" }}
            >
              Save
            </Button>
          </Box>
        </Box>

        {/* Per-Feature Overrides Section */}
        <Box
          sx={{
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "8px",
            p: "24px",
            backgroundColor:
              "#ffffff",
          }}
        >
          <Typography variant="h2" sx={{ mb: 1 }}>
            Per-feature overrides
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, mb: 3 }}
          >
            Override the default model for specific product areas or agents.
          </Typography>

          {/* Product areas */}
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Product areas
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            {PRODUCT_AREAS.map((area) => {
              const override = getOverride(
                productAreaOverrides,
                area.id,
                savedModelId,
              );
              return (
                <Box
                  key={area.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      width: 200,
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="body1">{area.name}</Typography>
                    <Tooltip
                      title="Override the default model for this product area"
                      placement="top"
                    >
                      <IconButton
                        size="small"
                        sx={{ p: 0 }}
                        aria-label={`Help for ${area.name}`}
                      >
                        <HelpCircle size={14} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <ModelSelector
                      value={override.enabled ? override.modelId : savedModelId}
                      onChange={(modelId) =>
                        setProductAreaOverride(area.id, { modelId })
                      }
                      placeholder="Select model"
                      disabled={!override.enabled}
                      sx={{ maxWidth: "100%" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      Override
                    </Typography>
                    <Switch
                      size="small"
                      checked={override.enabled}
                      onChange={(_, checked) =>
                        setProductAreaOverride(area.id, {
                          enabled: checked,
                          modelId: checked ? savedModelId : override.modelId,
                        })
                      }
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Agents (under Agent Studio) */}
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Agents (under Agent Studio)
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {AGENTS.map((agent) => {
              const override = getOverride(
                agentOverrides,
                agent.id,
                savedModelId,
              );
              return (
                <Box
                  key={agent.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      width: 200,
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="body1">{agent.name}</Typography>
                    <Tooltip
                      title="Override the default model for this agent"
                      placement="top"
                    >
                      <IconButton
                        size="small"
                        sx={{ p: 0 }}
                        aria-label={`Help for ${agent.name}`}
                      >
                        <HelpCircle size={14} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <ModelSelector
                      value={override.enabled ? override.modelId : savedModelId}
                      onChange={(modelId) =>
                        setAgentOverride(agent.id, { modelId })
                      }
                      placeholder="Select model"
                      disabled={!override.enabled}
                      sx={{ maxWidth: "100%" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      Override
                    </Typography>
                    <Switch
                      size="small"
                      checked={override.enabled}
                      onChange={(_, checked) =>
                        setAgentOverride(agent.id, {
                          enabled: checked,
                          modelId: checked ? savedModelId : override.modelId,
                        })
                      }
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          variant="filled"
        >
          Settings saved
        </Alert>
      </Snackbar>
    </Box>
  );
}
