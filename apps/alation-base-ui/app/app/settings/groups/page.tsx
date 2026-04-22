"use client";

import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Chip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users } from "lucide-react";
import { customGroups, builtInGroups, Group } from "./group-data";
import { ConfigureGroupsModal } from "./components/configure-groups-modal";
import { AddGroupModal } from "./components/add-group-modal";

export default function GroupsPage() {
  const router = useRouter();
  const theme = useTheme();
  const [groups, setGroups] = useState<Group[]>([...customGroups, ...builtInGroups]);
  const [configureOpen, setConfigureOpen] = useState(false);
  const [addGroupOpen, setAddGroupOpen] = useState(false);

  const columns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Group Name",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Users
            size={16}
            color={theme.palette.blue[600]}
            style={{ flexShrink: 0 }}
          />
          <Typography
            sx={{
              fontSize: "14px",
              color: theme.palette.blue[600],
              fontWeight: 500,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {row.original.name}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Chip
          label={row.original.type}
          color={row.original.type === "Built-in" ? "secondary" : "primary"}
        />
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "memberCount",
      header: "Members",
    },
    {
      accessorKey: "definedIn",
      header: "Defined In",
    },
  ];

  const handleAddGroup = (newGroup: {
    name: string;
    description: string;
    mappedRole: string;
    definedIn: "Alation" | "Alation Cloud";
  }) => {
    const group: Group = {
      id: String(Date.now()),
      name: newGroup.name,
      description: newGroup.description,
      type: "Custom",
      memberCount: 0,
      definedIn: newGroup.definedIn,
      mappedRole: newGroup.mappedRole || undefined,
      members: [],
    };
    setGroups((prev) => [group, ...prev]);
  };

  const handleRowClick = (row: Group) => {
    router.push(`/app/settings/groups/${row.id}`);
  };

  return (
    <>
      <SettingsSingleTablePage
        pageTitle="Groups"
        breadcrumbs={[{ label: "User Management" }, { label: "Groups" }]}
        pageActions={[
          {
            label: "Configure",
            onClick: () => setConfigureOpen(true),
            variant: "secondary",
          },
          {
            label: "Add Group",
            onClick: () => setAddGroupOpen(true),
            variant: "primary",
          },
        ]}
        tableTitle="User Groups"
        tableDescription="Manage user groups and their permissions. Built-in groups are defined by user roles. Custom groups can be created for additional access control."
        columns={columns}
        data={groups}
        rowActions={[
          {
            label: "Edit",
            onClick: (row) => console.log("Edit", row),
          },
          {
            label: "Manage Members",
            onClick: (row) => console.log("Manage members", row),
          },
          {
            label: "View Permissions",
            onClick: (row) => console.log("View permissions", row),
          },
          {
            label: "Delete",
            onClick: (row) => console.log("Delete", row),
          },
        ]}
        searchPlaceholder="Search groups..."
        onRowClick={handleRowClick}
      />

      <ConfigureGroupsModal
        open={configureOpen}
        onClose={() => setConfigureOpen(false)}
      />

      <AddGroupModal
        open={addGroupOpen}
        onClose={() => setAddGroupOpen(false)}
        onSave={handleAddGroup}
      />
    </>
  );
}
