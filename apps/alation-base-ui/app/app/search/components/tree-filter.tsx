"use client";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Collapse,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChevronRight, ChevronDown, Folder } from "lucide-react";
import { useState } from "react";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface TreeFilterProps {
  nodes: TreeNode[];
  selectedIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  selectedIds: Set<string>;
  indeterminateIds: Set<string>;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
  getAllDescendants: (node: TreeNode) => string[];
}

function TreeItem({
  node,
  level,
  selectedIds,
  indeterminateIds,
  expandedIds,
  onToggle,
  onExpand,
  getAllDescendants,
}: TreeItemProps) {
  const theme = useTheme();
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedIds.has(node.id);
  const isIndeterminate = indeterminateIds.has(node.id);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pl: level * 2,
          py: 0.5,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        {hasChildren ? (
          <Box
            onClick={() => onExpand(node.id)}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              mr: 0.5,
            }}
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </Box>
        ) : (
          <Box sx={{ width: "16px", mr: 0.5 }} />
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={isSelected && !isIndeterminate}
              indeterminate={isIndeterminate}
              onChange={() => onToggle(node.id)}
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Folder size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" sx={{ fontSize: "13px" }}>
                {node.label}
              </Typography>
            </Box>
          }
          sx={{
            flex: 1,
            m: 0,
            gap: "16px", // Figma spec: itemSpacing between checkbox and label
            "& .MuiFormControlLabel-label": {
              display: "flex",
              alignItems: "center",
              minWidth: 0,
            },
          }}
        />
      </Box>

      {hasChildren && isExpanded && (
        <Collapse in={isExpanded}>
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedIds={selectedIds}
              indeterminateIds={indeterminateIds}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onExpand={onExpand}
              getAllDescendants={getAllDescendants}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
}

export function TreeFilter({
  nodes,
  selectedIds,
  onSelectionChange,
}: TreeFilterProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const getAllDescendants = (node: TreeNode): string[] => {
    let descendants: string[] = [];
    if (node.children) {
      for (const child of node.children) {
        descendants.push(child.id);
        descendants = descendants.concat(getAllDescendants(child));
      }
    }
    return descendants;
  };

  const getAncestors = (nodeId: string, allNodes: TreeNode[]): string[] => {
    const ancestors: string[] = [];
    const findAncestors = (nodes: TreeNode[], targetId: string): boolean => {
      for (const node of nodes) {
        if (node.id === targetId) {
          return true;
        }
        if (node.children) {
          if (findAncestors(node.children, targetId)) {
            ancestors.push(node.id);
            return true;
          }
        }
      }
      return false;
    };
    findAncestors(allNodes, nodeId);
    return ancestors;
  };

  const calculateIndeterminate = (
    selectedIds: Set<string>,
    allNodes: TreeNode[]
  ): Set<string> => {
    const indeterminate = new Set<string>();

    const checkNode = (node: TreeNode): boolean => {
      if (!node.children || node.children.length === 0) {
        return selectedIds.has(node.id);
      }

      const childStates = node.children.map((child) => checkNode(child));
      const allSelected = childStates.every((state) => state === true);
      const someSelected = childStates.some((state) => state === true);
      const noneSelected = childStates.every((state) => state === false);

      if (someSelected && !allSelected) {
        indeterminate.add(node.id);
      }

      return allSelected || someSelected;
    };

    allNodes.forEach((node) => checkNode(node));
    return indeterminate;
  };

  const handleToggle = (nodeId: string) => {
    const findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const node = findNode(nodes, nodeId);
    if (!node) return;

    const newSelected = new Set(selectedIds);
    const isCurrentlySelected = selectedIds.has(nodeId);
    const currentIndeterminateIds = calculateIndeterminate(selectedIds, nodes);
    const isCurrentlyIndeterminate = currentIndeterminateIds.has(nodeId);
    const descendants = getAllDescendants(node);

    if (isCurrentlySelected && !isCurrentlyIndeterminate) {
      // Fully selected → deselect this node and all descendants
      newSelected.delete(nodeId);
      descendants.forEach((id) => newSelected.delete(id));
    } else {
      // Not selected or indeterminate → select this node and all descendants
      newSelected.add(nodeId);
      descendants.forEach((id) => newSelected.add(id));
    }

    onSelectionChange(newSelected);
  };

  const handleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedIds(newExpanded);
  };

  const handleExpandAll = () => {
    const allIds = new Set<string>();
    const addAllIds = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          allIds.add(node.id);
          addAllIds(node.children);
        }
      });
    };
    addAllIds(nodes);
    setExpandedIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const indeterminateIds = calculateIndeterminate(selectedIds, nodes);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Button size="small" onClick={handleExpandAll}>
          Expand all
        </Button>
        <Button size="small" onClick={handleCollapseAll}>
          Collapse all
        </Button>
      </Box>
      <Box sx={{ ml: -1 }}>
        {nodes.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            level={0}
            selectedIds={selectedIds}
            indeterminateIds={indeterminateIds}
            expandedIds={expandedIds}
            onToggle={handleToggle}
            onExpand={handleExpand}
            getAllDescendants={getAllDescendants}
          />
        ))}
      </Box>
    </Box>
  );
}
