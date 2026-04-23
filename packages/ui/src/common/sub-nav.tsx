// PROTOTYPE-ONLY: scaffolding for the vibe-design prototype. Not part of the design system.
"use client";
import { Box, Divider, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SubNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    width?: number;
    height?: number;
  }>;
  href: string;
  iconStyle?: "fill" | "stroke";
  dividerBefore?: boolean;
}

export interface SubNavSection {
  title: string;
  items: SubNavItem[];
}

export interface SubNavConfig {
  title: string;
  items?: SubNavItem[];
  sections?: SubNavSection[];
}

interface SubNavProps {
  config: SubNavConfig;
}

export function SubNav({ config }: SubNavProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const [currentSection, setCurrentSection] = useState<SubNavSection | null>(null);

  // Auto-navigate to the correct section based on current pathname only on initial load
  useEffect(() => {
    if (config.sections && currentSection === null) {
      const activeSection = config.sections.find(section =>
        section.items.some(item =>
          pathname === item.href || pathname?.startsWith(item.href + "/")
        )
      );
      if (activeSection) {
        setCurrentSection(activeSection);
      }
    }
  }, [pathname, config.sections]); // Removed currentSection dependency to prevent re-triggering

  const renderItems = (items: SubNavItem[]) => {
    return items.map((item) => {
      const isActive = pathname === item.href;
      const Icon = item.icon;
      const useStroke = item.iconStyle === "stroke";
      return (
        <Box key={item.id}>
          {item.dividerBefore && (
            <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: "4px" }} />
          )}
          <Link href={item.href} style={{ textDecoration: "none" }}>
            <Box
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "12px",
                py: "10px",
                px: "12px",
                ml: "-12px", // Extend background to the left
                mr: "-12px", // Extend background to the right
                backgroundColor: isActive
                  ? "rgba(255, 255, 255, 0.15)"
                  : "transparent",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: (theme) =>
                  `background-color ${theme.tokens.transition.fast}`,
                "&:hover": {
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Icon
                width={theme.tokens.typography.iconSize.sm}
                height={theme.tokens.typography.iconSize.sm}
                style={{
                  ...(useStroke
                    ? {
                        color: "white",
                        stroke: "white",
                        fill: "none",
                      }
                    : {
                        fill: "white",
                      }),
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  color: "white",
                  fontSize: `${theme.tokens.typography.body.body1.size}px`,
                  fontWeight: isActive ? 500 : theme.tokens.typography.body.body1.weight,
                  lineHeight: theme.tokens.typography.body.body1.lineHeight,
                  fontFamily: theme.tokens.typography.fontFamily,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Link>
        </Box>
      );
    });
  };

  const renderSections = (sections: SubNavSection[]) => {
    return sections.map((section) => {
      // Check if any item in this section is active
      const hasActiveItem = section.items.some(item =>
        pathname === item.href || pathname?.startsWith(item.href + "/")
      );

      return (
        <Box
          key={section.title}
          component="div"
          onClick={() => setCurrentSection(section)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: "10px",
            px: "12px",
            ml: "-12px", // Extend background to the left
            mr: "-12px", // Extend background to the right
            backgroundColor: hasActiveItem
              ? "rgba(255, 255, 255, 0.15)"
              : "transparent",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: (theme) =>
              `background-color ${theme.tokens.transition.fast}`,
            "&:hover": {
              backgroundColor: hasActiveItem
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: `${theme.tokens.typography.body.body1.size}px`,
              fontWeight: hasActiveItem ? 500 : theme.tokens.typography.body.body1.weight,
              lineHeight: theme.tokens.typography.body.body1.lineHeight,
              fontFamily: theme.tokens.typography.fontFamily,
            }}
          >
            {section.title}
          </Typography>
          <ChevronLeft
            size={theme.tokens.typography.iconSize.sm}
            style={{
              color: "white",
              transform: "rotate(180deg)" // Point right like your screenshot
            }}
          />
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        width: "280px",
        backgroundColor: "#FFFFFF10",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px 12px 0 0",
        mr: "12px",
        minHeight: 0,
        maxHeight: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          py: "16px",
          px: "12px",
          pl: "24px",
          flexShrink: 0,
        }}
      >
        {/* Always show main title */}
        <Typography
          sx={{
            color: "white",
            fontSize: `${theme.tokens.typography.heading.h1.size}px`,
            fontWeight: theme.tokens.typography.heading.h1.weight,
            lineHeight: theme.tokens.typography.heading.h1.lineHeight,
            fontFamily: theme.tokens.typography.fontFamily,
          }}
        >
          {config.title}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          pr: "12px",
          pl: "24px", // Match the header padding for consistent left alignment
          pb: "16px",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "3px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          },
        }}
      >
        {currentSection ? (
          // Show items in the selected section
          <Box>
            {/* Back button */}
            <Button
              variant="text"
              onClick={() => setCurrentSection(null)}
              startIcon={<ChevronLeft size={theme.tokens.typography.iconSize.sm} />}
              sx={{
                color: "white",
                fontSize: `${theme.tokens.typography.body.body1.size}px`,
                fontWeight: theme.tokens.typography.body.body1.weight,
                textTransform: "none",
                padding: "4px 8px",
                marginLeft: "-8px", // Align with text content
                marginBottom: "16px",
                alignSelf: "flex-start",
                justifyContent: "flex-start",
                '&:hover': {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }
              }}
            >
              All Settings
            </Button>

            {/* Section title as h3 */}
            <Typography
              sx={{
                color: "white",
                fontSize: `${theme.tokens.typography.heading.h3.size}px`,
                fontWeight: theme.tokens.typography.heading.h3.weight,
                lineHeight: theme.tokens.typography.heading.h3.lineHeight,
                fontFamily: theme.tokens.typography.fontFamily,
                mb: "16px",
              }}
            >
              {currentSection.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {renderItems(currentSection.items)}
            </Box>
          </Box>
        ) : (
          // Show top-level navigation
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {config.sections ? renderSections(config.sections) : (
              config.items && renderItems(config.items)
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
