"use client";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Play,
  Globe,
  Mail,
  Plug,
  SquareChevronRight,
  TextAlignStart,
} from "lucide-react";
import FlowIconSvg from "@/app/app/studio/assets/type-flow.svg";
import AgentIconSvg from "@/app/app/studio/assets/type-agent.svg";
import ModelIconSvg from "@/app/app/studio/assets/type-aimodel.svg";
import ToolIconSvg from "@/app/app/studio/assets/type-tool.svg";
import UsageIconSvg from "@/app/app/studio/assets/type-usage.svg";

/* Custom Icon Props */
interface CustomIconProps {
  size?: number;
  style?: React.CSSProperties;
}

/* Custom Flow Icon Component */
function FlowIcon({ size = 24, style }: CustomIconProps) {
  return (
    <FlowIconSvg
      width={size}
      height={size}
      style={{ ...style, fill: style?.color }}
    />
  );
}

/* Custom Agent Icon Component */
function AgentIcon({ size = 24, style }: CustomIconProps) {
  return (
    <AgentIconSvg
      width={size}
      height={size}
      style={{ ...style, fill: style?.color }}
    />
  );
}

/* Custom Model Icon Component */
function ModelIcon({ size = 24, style }: CustomIconProps) {
  return (
    <ModelIconSvg
      width={size}
      height={size}
      style={{ ...style, fill: style?.color }}
    />
  );
}

/* Custom Tool Icon Component */
function ToolIcon({ size = 24, style }: CustomIconProps) {
  return (
    <ToolIconSvg
      width={size}
      height={size}
      style={{ ...style, fill: style?.color }}
    />
  );
}

/* Custom Usage Icon Component */
function UsageIcon({ size = 24, style }: CustomIconProps) {
  return (
    <UsageIconSvg
      width={size}
      height={size}
      style={{ ...style, fill: style?.color }}
    />
  );
}

interface ItemTypeIconProps {
  type:
    | "Tool"
    | "Agent"
    | "Start"
    | "Flow"
    | "MCP"
    | "Model"
    | "Usage"
    | "native"
    | "rest"
    | "smtp"
    | "JSON"
    | "Message";
  size?: "default" | "small" | number;
}

export function ItemTypeIcon({ type, size = "default" }: ItemTypeIconProps) {
  const theme = useTheme();

  // Normalize size: support both string ("default" | "small") and legacy numeric values
  const normalizedSize =
    typeof size === "number" ? (size <= 20 ? "small" : "default") : size;

  const boxSize = normalizedSize === "default" ? 28 : 16;
  const iconSize = normalizedSize === "default" ? 20 : 12;
  const borderRadius =
    normalizedSize === "default"
      ? "4px"
      : "2px";

  const getBackgroundColor = () => {
    switch (type) {
      case "Flow":
        return theme.palette.teal[200];
      case "MCP":
        return theme.palette.neutral[50];
      case "Agent":
        return theme.palette.purple[200];
      case "Tool":
      case "native":
      case "rest":
      case "smtp":
        return theme.palette.blue[100];
      case "Model":
        return theme.palette.amber[200];
      case "Usage":
        return theme.palette.green[100];
      case "JSON":
      case "Message":
        return theme.palette.neutral[100];
      case "Start":
        return theme.palette.neutral[700];
      default:
        return theme.palette.neutral[100];
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "Flow":
        return theme.palette.teal[600];
      case "MCP":
        return theme.palette.neutral[600];
      case "Agent":
        return theme.palette.purple[600];
      case "Tool":
      case "native":
      case "rest":
      case "smtp":
        return theme.palette.blue[600];
      case "Model":
        return theme.palette.amber[600];
      case "Usage":
        return theme.palette.green[600];
      case "JSON":
      case "Message":
        return theme.palette.neutral[500];
      case "Start":
        return "#ffffff";
      default:
        return theme.palette.neutral[600];
    }
  };

  const renderIcon = () => {
    const color = getIconColor();
    const style = { color };

    switch (type) {
      case "Flow":
        return <FlowIcon size={iconSize} style={style} />;
      case "MCP":
        return <Plug size={iconSize} style={style} />;
      case "Agent":
        return <AgentIcon size={iconSize} style={style} />;
      case "Tool":
      case "native":
        return <ToolIcon size={iconSize} style={style} />;
      case "Model":
        return <ModelIcon size={iconSize} style={style} />;
      case "Usage":
        return <UsageIcon size={iconSize} style={style} />;
      case "JSON":
        return <SquareChevronRight size={iconSize} style={style} />;
      case "Message":
        return <TextAlignStart size={iconSize} style={style} />;
      case "Start":
        return <Play size={iconSize} style={style} />;
      case "rest":
        return <Globe size={iconSize} style={style} />;
      case "smtp":
        return <Mail size={iconSize} style={style} />;
      default:
        return <ToolIcon size={iconSize} style={style} />;
    }
  };

  return (
    <Box
      sx={{
        width: `${boxSize}px`,
        height: `${boxSize}px`,
        borderRadius: borderRadius,
        backgroundColor: getBackgroundColor(),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {renderIcon()}
    </Box>
  );
}
