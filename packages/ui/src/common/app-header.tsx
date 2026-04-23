// PROTOTYPE-ONLY: scaffolding for the vibe-design prototype. Not part of the design system.
"use client";
import { Box, TextField, IconButton, Avatar, Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";
import { Search, Settings, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomerAlationLogo from "../assets/logo/customer-alation.svg";

export function AppHeader() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box
      component="header"
      sx={{
        p: "12px",
        pb: "4px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <CustomerAlationLogo />

      <Box sx={{ flex: 1, maxWidth: "600px" }}>
        <TextField
          placeholder="Search Alation"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          size="small"
          fullWidth
          variant="filled"
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <IconButton
                size="small"
                onClick={handleSearch}
                sx={{
                  padding: "4px",
                  color: isFocused ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.9)",
                }}
              >
                <Search size={18} />
              </IconButton>
            ),
          }}
          sx={{
            backgroundColor: isFocused
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0.15)",
            borderRadius: "6px",
            transition: "background-color 0.2s ease",
            "& .MuiFilledInput-root": {
              height: "36px",
              backgroundColor: "transparent",
              borderRadius: "6px",
              border: isFocused
                ? "1px solid rgba(0, 0, 0, 0.23)"
                : "1px solid rgba(255, 255, 255, 0.3)",
              transition: "all 0.2s ease",
              paddingTop: "8px",
              paddingBottom: "8px",
              "&:hover": {
                backgroundColor: "transparent",
                borderColor: isFocused
                  ? "rgba(0, 0, 0, 0.4)"
                  : "rgba(255, 255, 255, 0.4)",
              },
              "&.Mui-focused": {
                backgroundColor: "transparent",
              },
              "&:before, &:after": {
                display: "none",
              },
            },
            "& .MuiInputBase-input": {
              color: isFocused ? "rgba(0, 0, 0, 0.87)" : "white",
              transition: "color 0.2s ease",
              fontSize: "14px",
              paddingTop: 0,
              paddingBottom: 0,
            },
            "& .MuiInputBase-input::placeholder": {
              color: isFocused ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.72)",
              opacity: 1,
              fontSize: "14px",
            },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <IconButton
          size="small"
          onClick={() => router.push("/app/settings")}
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Settings size={20} />
        </IconButton>
        <Avatar
          src="https://mockmind-api.uifaces.co/content/human/219.jpg"
          alt="User avatar"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            width: 32,
            height: 32,
            cursor: "pointer",
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => { setAnchorEl(null); router.push("/app/account"); }}>
            <ListItemIcon><User size={16} /></ListItemIcon>
            My Profile
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); router.push("/app/account"); }}>
            <ListItemIcon><Settings size={16} /></ListItemIcon>
            Profile Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><LogOut size={16} /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
