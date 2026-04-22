"use client";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Tooltip
} from "@mui/material";
import { X, Check, Info } from "lucide-react";

interface UserRolesModalProps {
  open: boolean;
  onClose: () => void;
}

const rolePermissions = [
  {
    permission: "Server Management",
    tooltip: "Server configuration, user management, license & reporting, backup & restore, health check & software updates, monitor online user & tasks.",
    serverAdmin: true,
    catalogAdmin: false,
    sourceAdmin: false,
    steward: false,
    composer: false,
    explorer: false,
    viewer: false,
  },
  {
    permission: "Catalog Management",
    tooltip: "Catalog curation & administration, manage Catalog Sets, Lexicon, Metadata Sync & APIs, create and manage business glossaries & policies.",
    serverAdmin: true,
    catalogAdmin: true,
    sourceAdmin: false,
    steward: false,
    composer: false,
    explorer: false,
    viewer: false,
  },
  {
    permission: "Data Source Management",
    tooltip: "Data source configuration, assign data stewards.",
    serverAdmin: true,
    catalogAdmin: true,
    sourceAdmin: true,
    steward: false,
    composer: false,
    explorer: false,
    viewer: false,
  },
  {
    permission: "Full Access to Compose",
    tooltip: "Use Alation \"Compose\" to author, collaborate on, execute, and share SQL queries.",
    serverAdmin: true,
    catalogAdmin: true,
    sourceAdmin: true,
    steward: true,
    composer: true,
    explorer: false,
    viewer: false,
  },
  {
    permission: "Data Stewardship",
    tooltip: "Serve as a data steward, use the stewardship dashboard, update titles, descriptions, tags, flags & custom fields.",
    serverAdmin: true,
    catalogAdmin: true,
    sourceAdmin: true,
    steward: true,
    composer: true,
    explorer: false,
    viewer: false,
  },
  {
    permission: "Edit Glossary & Article",
    tooltip: "Write articles, define and edit business glossary terms.",
    serverAdmin: true,
    catalogAdmin: true,
    sourceAdmin: true,
    steward: true,
    composer: true,
    explorer: false,
    viewer: false,
  },
  {
    permission: "Run Shared Query Form",
    tooltip: "Execute query forms shared by others.",
    serverAdmin: true,
    catalogAdmin: true,
    sourceAdmin: true,
    steward: true,
    composer: true,
    explorer: true,
    viewer: false,
  },
  {
    permission: "View Catalog & Conversation",
    tooltip: "Search & browse catalog, glossaries, articles, engage in conversations.",
    serverAdmin: true,
    catalogAdmin: true,
    sourceAdmin: true,
    steward: true,
    composer: true,
    explorer: true,
    viewer: true,
  },
];

const roles = [
  { name: "Server Admin", license: "Creator" },
  { name: "Catalog Admin", license: "Creator" },
  { name: "Source Admin", license: "Creator" },
  { name: "Composer", license: "Creator" },
  { name: "Steward", license: "Creator" },
  { name: "Explorer", license: "Explorer" },
  { name: "Viewer", license: "Viewer" },
];

export function UserRolesModal({ open, onClose }: UserRolesModalProps) {

  const getLicenseColor = (license: string) => {
    switch (license) {
      case "Creator": return "#F59E0B";
      case "Explorer": return "#3B82F6";
      case "Viewer": return "#8B5CF6";
      default: return "#6B7280";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxHeight: "80vh",
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 600, fontSize: "20px" }}>
          Compare User Roles
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {/* Permissions Table */}
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box component="thead">
              <Box component="tr">
                <Box
                  component="th"
                  sx={{
                    textAlign: "left",
                    p: 1.5,
                    fontWeight: 600,
                    fontSize: "12px",
                    color: "text.secondary",
                    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    minWidth: "200px",
                  }}
                >
                  User Role
                </Box>
                {roles.map((role) => (
                  <Box
                    key={role.name}
                    component="th"
                    sx={{
                      textAlign: "center",
                      p: 1.5,
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                      minWidth: "100px",
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "12px" }}>
                        {role.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          backgroundColor: `${getLicenseColor(role.license)}10`,
                          padding: "2px 6px",
                          borderRadius: "10px",
                          border: `1px solid ${getLicenseColor(role.license)}30`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "2px",
                            backgroundColor: getLicenseColor(role.license),
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "10px",
                            fontWeight: 600,
                            color: getLicenseColor(role.license),
                          }}
                        >
                          {role.license}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {rolePermissions.map((perm, idx) => (
                <Box
                  key={perm.permission}
                  component="tr"
                  sx={{
                    "&:hover": { backgroundColor: "grey.50" },
                    borderBottom: idx === rolePermissions.length - 1 ? "none" : `1px solid ${"rgb(240, 240, 240)"}`,
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      p: 1.5,
                      fontWeight: 500,
                      fontSize: "13px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {perm.permission}
                      </Typography>
                      <Tooltip title={perm.tooltip} arrow placement="top">
                        <Box sx={{ display: "flex" }}>
                          <Info size={14} color="#9CA3AF" />
                        </Box>
                      </Tooltip>
                    </Box>
                  </Box>
                  {[
                    perm.serverAdmin,
                    perm.catalogAdmin,
                    perm.sourceAdmin,
                    perm.composer,
                    perm.steward,
                    perm.explorer,
                    perm.viewer
                  ].map((hasPermission, roleIdx) => (
                    <Box
                      key={roleIdx}
                      component="td"
                      sx={{
                        textAlign: "center",
                        p: 1.5,
                      }}
                    >
                      {hasPermission ? (
                        <Check size={16} color="#16A34A" />
                      ) : (
                        <Box sx={{ width: 16, height: 16 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

      </DialogContent>
    </Dialog>
  );
}