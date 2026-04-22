"use client";
import { Box, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Plus, ArrowRight, FileText, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { ItemTypeIcon } from "../../flows/components/item-type-icon";

interface BuildCardProps {
  type: "Agent" | "Flow";
  title: string;
  description: string;
  showBetaBadge?: boolean;
  onClick?: () => void;
}

/* Build Card Component */
function BuildCard({
  type,
  title,
  description,
  showBetaBadge = false,
  onClick,
}: BuildCardProps) {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        width: "240px",
        height: "120px",
        backgroundColor: theme.palette.neutral[50],
        borderRadius: "6px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "16px",
        cursor: "pointer",
        border: "1px solid transparent",
        transition: `all ${"150ms"}`,
        "&:hover": {
          backgroundColor: "white",
          border: `1px solid ${theme.palette.neutral[300]}`,
          boxShadow:
            "rgba(0, 0, 0, 0.07) 0px 0.7px 1.4px, rgba(0, 0, 0, 0.05) 0px 1.9px 4px, rgba(0, 0, 0, 0.05) 0px 4.5px 10px",
          "& .plus-icon": {
            opacity: 1,
            transform: "scale(1.2)",
          },
        },
      }}
    >
      {/* Top Row - Icon and Plus */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <ItemTypeIcon type={type} size="default" />
        <Box
          className="plus-icon"
          sx={{
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.text.secondary,
            opacity: 1,
            transform: "scale(1)",
            transition: `opacity ${"150ms"}, transform ${"150ms"}`,
          }}
        >
          <Plus size={16} />
        </Box>
      </Box>

      {/* Bottom Row - Title and Description */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.text.primary }}
          >
            {title}
          </Typography>
          {showBetaBadge && (
            <Chip
              label="Beta"
              size="small"
              sx={{
                height: "24px",
                backgroundColor: theme.palette.blue[100],
                color: theme.palette.blue[600],
                fontWeight: 500,
                fontSize: "12px",
                borderRadius: "40px",
                "& .MuiChip-label": {
                  px: "10px",
                },
              }}
            />
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

interface NavButtonProps {
  type?: "Model" | "Tool" | "Usage";
  icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  onClick: () => void;
  external?: boolean;
}

/* Navigation Button Component */
function NavButton({ type, icon: CustomIcon, label, onClick, external }: NavButtonProps) {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        width: "200px",
        height: "50px",
        backgroundColor: theme.palette.neutral[50],
        borderRadius: "6px",
        padding: "8px",
        paddingRight: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        border: "1px solid transparent",
        transition: `all ${"150ms"}`,
        "&:hover": {
          backgroundColor: "white",
          border: `1px solid ${theme.palette.neutral[300]}`,
          boxShadow:
            "rgba(0, 0, 0, 0.07) 0px 0.7px 1.4px, rgba(0, 0, 0, 0.05) 0px 1.9px 4px, rgba(0, 0, 0, 0.05) 0px 4.5px 10px",
          "& .arrow-icon": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      }}
    >
      {type ? (
        <ItemTypeIcon type={type} size="default" />
      ) : CustomIcon ? (
        <Box
          sx={{
            width: "28px",
            height: "28px",
            borderRadius: "4px",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CustomIcon
            size={20}
            style={{ color: theme.palette.neutral[600] }}
          />
        </Box>
      ) : null}
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 500,
          flex: 1,
        }}
      >
        {label}
      </Typography>
      {/* Hover Icon - Arrow or External Link */}
      <Box
        className="arrow-icon"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transform: "translateX(-4px)",
          transition: `opacity ${"150ms"}, transform ${"150ms"}`,
          color: theme.palette.text.secondary,
        }}
      >
        {external ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
      </Box>
    </Box>
  );
}

/* Getting Started Section */
export function GettingStarted() {
  const theme = useTheme();
  const router = useRouter();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleBuildFlow = () => {
    router.push("/app/studio/flows/new");
  };

  const handleExploreModels = () => {
    router.push("/app/studio/models");
  };

  const handleExploreTools = () => {
    router.push("/app/studio/tools");
  };

  const handleMonitorUsage = () => {
    router.push("/app/studio/usage");
  };

  const handleViewDocs = () => {
    window.open("https://docs.example.com", "_blank");
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "40px",
        alignItems: "flex-end",
        width: "100%",
        padding: "24px",
        pt: "24px",
      }}
    >
      {/* Left Section - Build Cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Greeting */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {getGreeting()} Vishal
          </Typography>
          <Typography
            variant="h1"
            sx={{ color: theme.palette.text.primary }}
          >
            Start building
          </Typography>
        </Box>

        {/* Build Cards */}
        <Box
          sx={{
            display: "flex",
            gap: "16px",
          }}
        >
          <BuildCard
            type="Agent"
            title="Build agent"
            description="Create agents for your data"
          />
          <BuildCard
            type="Flow"
            title="Build flow"
            description="Automate end-to-end processes"
            showBetaBadge
            onClick={handleBuildFlow}
          />
        </Box>
      </Box>

      {/* Right Section - More in Studio */}
      <Box
        sx={{
          minWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
        }}
      >
        {/* Section Title */}
        <Typography
          variant="subtitle1"
          sx={{ color: theme.palette.text.primary }}
        >
          More in Agent Studio
        </Typography>

        {/* Navigation Buttons Grid */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            maxWidth: "416px",
          }}
        >
          <NavButton
            type="Model"
            label="Explore models"
            onClick={handleExploreModels}
          />
          <NavButton
            type="Tool"
            label="Explore tools"
            onClick={handleExploreTools}
          />
          <NavButton
            type="Usage"
            label="Monitor usage"
            onClick={handleMonitorUsage}
          />
          <NavButton
            icon={FileText}
            label="Doc"
            onClick={handleViewDocs}
            external
          />
        </Box>
      </Box>
    </Box>
  );
}
