"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { User } from "lucide-react";

type AppRole = "App Admin" | "App Viewer" | "App User";
type PrivacyLevel = "public" | "private";

interface AppUser {
  id: number;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  avatarTextColor: string;
  role: AppRole;
}

const INITIAL_USERS: AppUser[] = [
  { id: 1, name: "server admin", email: "admin@alation.com", initials: "SA", avatarColor: "#E8B86D", avatarTextColor: "#fff", role: "App Admin" },
  { id: 2, name: "El", email: "elena.barmina@alation.com", initials: "El", avatarColor: "#B0B8C1", avatarTextColor: "#fff", role: "App Admin" },
  { id: 3, name: "VA", email: "viewer.dpm@alation.com", initials: "VA", avatarColor: "#B0B8C1", avatarTextColor: "#fff", role: "App Viewer" },
  { id: 4, name: "user12", email: "user12@alation.com", initials: "U", avatarColor: "#B0B8C1", avatarTextColor: "#fff", role: "App Viewer" },
  { id: 5, name: "Yashwanth K", email: "yashwanth.kalva@alation.com", initials: "YK", avatarColor: "#B0B8C1", avatarTextColor: "#fff", role: "App User" },
  { id: 6, name: "Jeff Pickelman", email: "jeff.pickelman@alation.com", initials: "JP", avatarColor: "#B0B8C1", avatarTextColor: "#fff", role: "App User" },
];

const APP_ROLES: AppRole[] = ["App Admin", "App Viewer", "App User"];

const PRIVACY_OPTIONS: { value: PrivacyLevel; title: string; description: string }[] = [
  {
    value: "public",
    title: "Public",
    description:
      "Everyone can view the marketplace app, and everyone with the appropriate Alation license can create marketplaces and data products. Only Alation server admins and those given explicit permissions can modify app settings and user roles.",
  },
  {
    value: "private",
    title: "Private",
    description:
      "Only Alation Server Admins and users given explicit permission can view the app, create marketplaces and products, and modify app settings and user roles.",
  },
];

const TABLE_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "role", label: "App Role" },
  { key: "actions", label: "" },
] as const;

export default function ManageAppPage() {
  const theme = useTheme();
  const [privacy, setPrivacy] = useState<PrivacyLevel>("public");
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);

  const updateRole = (id: number, role: AppRole) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));

  const removeUser = (id: number) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          px: "24px",
          py: "20px",
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: "22px", fontWeight: 700, color: theme.palette.text.primary }}>
          App Settings
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: "24px", py: "28px", display: "flex", flexDirection: "column", gap: "28px" }}>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Box>
            <Typography sx={{ fontSize: "16px", fontWeight: 600, color: theme.palette.text.primary, mb: "4px" }}>
              App Privacy
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Set default view permissions for the product. When the product is listed in a marketplace, everyone who can view the marketplace can view the product.
            </Typography>
          </Box>

          <RadioGroup
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as PrivacyLevel)}
            sx={{ gap: "12px" }}
          >
            {PRIVACY_OPTIONS.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio size="small" />}
                label={
                  <Box sx={{ pt: "2px" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      {opt.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.5 }}>
                      {opt.description}
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start", m: 0 }}
              />
            ))}
          </RadioGroup>
        </Box>

        <Divider />

        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <Box>
              <Typography sx={{ fontSize: "16px", fontWeight: 600, color: theme.palette.text.primary, mb: "4px" }}>
                App Roles
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Select users or groups and assign roles to control what they can do in the app. Users must have the required Alation license for their assigned app roles to work.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              sx={{
                height: "36px",
                fontSize: "13px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
                textTransform: "none",
                borderColor: theme.palette.neutral[300],
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: theme.palette.neutral[400],
                  backgroundColor: theme.palette.neutral[100],
                },
              }}
            >
              Add User/Group
            </Button>
          </Box>

          <Box
            sx={{
              border: `1px solid ${theme.palette.neutral[300]}`,
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <Table sx={{ width: "100%", border: "none", borderRadius: 0 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.neutral[50] }}>
                  {TABLE_COLUMNS.map((col, idx) => (
                    <TableCell
                      key={col.key}
                      sx={{
                        py: "10px",
                        px: "16px",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: theme.palette.text.primary,
                        borderRight: idx < TABLE_COLUMNS.length - 1 ? `1px solid ${theme.palette.neutral[300]}` : "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ "&:hover": { backgroundColor: theme.palette.neutral[100] } }}
                  >
                    <TableCell sx={{ px: "16px", py: "10px" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: user.avatarColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Typography sx={{ fontSize: "11px", fontWeight: 600, color: user.avatarTextColor }}>
                            {user.initials}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.info.main,
                              cursor: "pointer",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {user.name}
                          </Typography>
                          <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ px: "16px", py: "10px" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <User size={14} color={theme.palette.text.secondary} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                          User
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ px: "16px", py: "10px", width: "220px" }}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value as AppRole)}
                          sx={{ fontSize: "13px", height: "32px" }}
                        >
                          {APP_ROLES.map((role) => (
                            <MenuItem key={role} value={role} sx={{ fontSize: "13px" }}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell sx={{ px: "16px", py: "10px", width: "80px" }}>
                      <Typography
                        variant="body2"
                        onClick={() => removeUser(user.id)}
                        sx={{
                          color: theme.palette.info.main,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Remove
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
