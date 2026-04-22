import { Box, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { type LucideIcon } from "lucide-react";
import { type ComponentType } from "react";
import Link from "next/link";

type IconType = LucideIcon | ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavButtonProps {
  name: string;
  icon: IconType;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function NavButton({
  name,
  icon: Icon,
  href,
  isActive,
  onClick,
}: NavButtonProps) {
  const theme = useTheme();
  const buttonContent = (
    <Box
      component={href ? "div" : "button"}
      onClick={onClick}
      sx={{
        width: "36px", // size-9 in Tailwind = 9 * 4px = 36px
        height: "36px", // size-9 in Tailwind = 9 * 4px = 36px
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isActive ? "#f16923" : "transparent",
        color: "white",
        border: "none",
        borderRadius: "4px", // rounded-md in Tailwind = 4px
        cursor: "pointer",
        transition: "background-color 0.2s",
        "&:hover": {
          backgroundColor: isActive
            ? "#f16923"
            : "rgba(255, 255, 255, 0.3)", // hover:bg-white/30 in Tailwind
        },
      }}
      aria-label={name}
    >
      <Icon
        style={{
          color: "white",
          width: `${theme.tokens.typography.iconSize.md}px`,
          height: `${theme.tokens.typography.iconSize.md}px`,
          flexShrink: 0,
          display: "block",
        }}
      />
    </Box>
  );

  return (
    <Tooltip
      title={name}
      placement="right"
      arrow
      slotProps={{
        tooltip: {
          sx: {
            fontSize: `${theme.tokens.typography.body.body1.size}px`,
            fontWeight: theme.tokens.typography.body.body1.weight,
            lineHeight: theme.tokens.typography.body.body1.lineHeight,
            fontFamily: theme.tokens.typography.fontFamily,
          }
        }
      }}
    >
      {href ? (
        <Link href={href} style={{ textDecoration: "none" }}>
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}
    </Tooltip>
  );
}
