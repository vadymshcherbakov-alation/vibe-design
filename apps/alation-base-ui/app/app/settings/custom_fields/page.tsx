'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Link, Select, MenuItem, TextField, Chip, ToggleButtonGroup, ToggleButton, IconButton, Menu, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, OutlinedInput, Checkbox, ListItemText, Divider, Autocomplete } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Plus, Search, Braces, Users, Link as LinkIcon, CheckSquare, CopyCheck, Type, Calendar, MoreVertical, X, ArrowLeft } from "lucide-react";
import { FieldPreview } from "../custom_templates/components/field-preview";
import { CreateFieldModal } from "../../../components/create-field-modal";

interface CustomField {
  id: string;
  name: string;
  fieldType: string;
  appliesTo: string;
  viewableBy: string[];
  editableBy: string[];
  required: boolean;
  createdAt: string;
  category: "built-in" | "custom";
}

// Generate mock data with over 100 fields
const generateMockData = (): CustomField[] => {
  const fieldNames = [
    "Data Classification", "Business Owner", "PII Status", "Data Retention Period", "Compliance Tags",
    "Update Frequency", "Related Assets", "Data Quality Score", "Technical Contact", "Business Context",
    "Source System", "ETL Process", "Data Lineage", "Usage Guidelines", "Access Controls", "Criticality Level",
    "Geographic Region", "Industry Category", "Regulatory Requirements", "Retention Schedule", "Archive Policy",
    "Backup Requirements", "Recovery Objectives", "Service Level Agreement", "Cost Center", "Budget Code",
    "Project Reference", "Migration Status", "Documentation Link", "Training Materials", "Support Contact",
    "Vendor Information", "License Type", "Contract Details", "Renewal Date", "Performance Metrics",
    "Monitoring Dashboard", "Alert Thresholds", "Escalation Procedures", "Incident History", "Change Log",
    "Version Control", "Development Stage", "Test Results", "Validation Status", "Approval Workflow",
    "Review Cycle", "Audit Trail", "Certification Status", "Risk Assessment", "Impact Analysis",
    "Dependency Mapping", "Integration Points", "API Endpoints", "Security Classification", "Encryption Status",
    "Access Patterns", "Usage Statistics", "Performance Baseline", "Capacity Planning", "Scaling Strategy",
    "Disaster Recovery", "Failover Procedures", "Monitoring Tools", "Logging Configuration", "Debug Settings",
    "Feature Flags", "Configuration Management", "Environment Variables", "Deployment Strategy", "Release Notes",
    "User Feedback", "Issue Tracking", "Resolution Status", "Knowledge Base", "FAQ Reference",
    "Training Schedule", "Certification Requirements", "Skill Matrix", "Resource Allocation", "Team Assignment",
    "Priority Level", "Milestone Tracking", "Deliverable Status", "Quality Gates", "Acceptance Criteria",
    "Test Coverage", "Code Review", "Security Scan", "Vulnerability Assessment", "Penetration Test",
    "Compliance Check", "Audit Results", "Remediation Plan", "Risk Mitigation", "Control Framework",
    "Policy Reference", "Procedure Manual", "Guidelines Document", "Best Practices", "Lessons Learned",
    "Success Metrics", "KPI Dashboard", "Benchmark Comparison", "Trend Analysis", "Forecast Model",
    "Business Rules", "Logic Flow", "Decision Tree", "Workflow Diagram", "Process Map",
    "Data Dictionary", "Schema Definition", "Field Mapping", "Transformation Rules", "Validation Logic",
    "Error Handling", "Exception Management", "Retry Policy", "Timeout Settings", "Circuit Breaker",
    "Load Balancing", "Caching Strategy", "Performance Optimization", "Resource Utilization", "Cost Analysis"
  ];

  const fieldTypes = ["Object Set", "People Set", "Object Reference", "Picker", "Multi-Select Picker", "Rich Text", "Date"];
  const appliesTo = [
    "Table", "Column", "Schema",
    "Table, Column", "Table, Schema", "Column, Schema", "Table, Column, Schema",
    "Document Template", "Policy Template", "Custom Asset",
    "BI Report Template", "Data Quality Template", "Glossary Template",
    "Article Template", "Query Template", "Dashboard Template",
    "Table, Column, Schema, Document Template",
    "Policy Template, Custom Asset Template",
    "Table, Column, Schema, BI Report, Dashboard, Query, Custom Asset, Document Template",
    "All Asset Types"
  ];
  const viewableByOptions = [
    ["Everyone"],
    ["Authorized Users"],
    ["Data Stewards"],
    ["Compliance Team"],
    ["Technical Users"],
    ["Business Users"],
    ["Data Stewards", "Compliance Team"],
    ["Technical Users", "Business Users", "Data Owners"],
    ["Data Stewards", "Compliance Team", "Technical Users", "Business Users"],
    ["Catalog Admins", "Server Admins", "Data Privacy Team"],
    ["Data Stewards", "Compliance Team", "Technical Users", "Business Users", "Data Privacy Team", "Catalog Admins"],
    ["Everyone", "Data Stewards"], // This should show as just "Everyone"
    ["Data Owners", "Stewards", "Experts", "Technical Users", "Business Users", "Compliance Team", "Data Privacy Team"]
  ];
  const editableByOptions = [
    ["Data Stewards"],
    ["Compliance Team"],
    ["Technical Users"],
    ["Business Users"],
    ["Data Privacy Team"],
    ["Catalog Admins"],
    ["Data Owners"],
    ["Data Stewards", "Data Owners"],
    ["Compliance Team", "Data Privacy Team"],
    ["Technical Users", "Catalog Admins", "Server Admins"],
    ["Data Stewards", "Compliance Team", "Data Owners"],
    ["Business Users", "Technical Users", "Data Stewards", "Catalog Admins"],
    ["Data Privacy Team", "Compliance Team", "Server Admins", "Catalog Admins", "Data Stewards"],
    ["Data Owners", "Stewards", "Experts", "Technical Users", "Business Users", "Compliance Team", "Data Privacy Team", "Catalog Admins", "Server Admins"]
  ];
  const categories: ("built-in" | "custom")[] = ["built-in", "custom"];

  return fieldNames.map((name, index) => {
    const category = categories[index % 2];
    const isBuiltIn = category === "built-in";

    return {
      id: String(index + 1),
      name,
      fieldType: fieldTypes[index % fieldTypes.length],
      appliesTo: appliesTo[index % appliesTo.length],
      // Built-in fields always have "Everyone" for viewable, custom fields can vary
      viewableBy: isBuiltIn ? ["Everyone"] : viewableByOptions[index % viewableByOptions.length],
      editableBy: editableByOptions[index % editableByOptions.length],
      required: index % 5 === 0,
      createdAt: new Date(2023, Math.floor(index / 10), (index % 28) + 1).toISOString().split('T')[0],
      category,
    };
  });
};

const mockData: CustomField[] = generateMockData();

const FIELD_TYPES = [
  "All Types",
  "Object Set",
  "People Set",
  "Object Reference",
  "Picker",
  "Multi-Select Picker",
  "Rich Text",
  "Date"
];

// Field types with their configurations for modal
const MODAL_FIELD_TYPES = [
  {
    id: 'object-set',
    label: 'Object Set',
    ftype: 'Object set',
    description: 'Link to a collection of related data objects like tables or schemas',
    needsName: true,
    needsPlural: true,
    needsDescription: true,
    needsPermittedTypes: true,
    needsBackref: true
  },
  {
    id: 'people-set',
    label: 'People Set',
    ftype: 'People set',
    description: 'Link to a group of users or team members with specific roles',
    needsName: true,
    needsPlural: true,
    needsDescription: true,
    needsBackref: true
  },
  {
    id: 'object-reference',
    label: 'Object Reference',
    ftype: 'Reference link',
    description: 'Single link to another data object in the catalog',
    needsName: true,
    needsDescription: true,
    needsPermittedTypes: true,
    needsBackref: true
  },
  {
    id: 'picker',
    label: 'Picker',
    ftype: 'Picker',
    description: 'Single-choice dropdown with predefined options',
    needsName: true,
    needsDescription: true,
    needsOptions: true
  },
  {
    id: 'multi-select-picker',
    label: 'Multi-Select Picker',
    ftype: 'Multi-picker',
    description: 'Multiple-choice selection from predefined options',
    needsName: true,
    needsPlural: true,
    needsDescription: true,
    needsOptions: true
  },
  {
    id: 'rich-text',
    label: 'Rich Text',
    ftype: 'Rich text',
    description: 'Formatted text with support for links, bold, italics, and lists',
    needsName: true,
    needsDescription: true
  },
  {
    id: 'date',
    label: 'Date',
    ftype: 'Text',
    description: 'Date picker for selecting specific dates or timestamps',
    needsName: true,
    needsDescription: true
  }
];

const OBJECT_TYPES = [
  'Table', 'Column', 'Schema', 'Data Source', 'BI Report', 'BI Folder',
  'AI Model', 'Data Policy', 'Feature Cube', 'Dashboard', 'Query', 'User'
];

// Mock data for permissions
const PERMISSION_OPTIONS = [
  { id: 'everyone', label: 'Everyone', type: 'everyone', icon: null },
  { id: 'catalog-admins', label: 'Catalog Admins', type: 'group', icon: 'group' },
  { id: 'server-admins', label: 'Server Admins', type: 'group', icon: 'group' },
  { id: 'data-stewards', label: 'Data Stewards', type: 'group', icon: 'group' },
  { id: 'viewers', label: 'Viewer', type: 'group', icon: 'group' },
  { id: 'data-owners-ps', label: 'Data Owners', type: 'people-set', icon: 'people' },
  { id: 'stewards-ps', label: 'Stewards', type: 'people-set', icon: 'people' },
  { id: 'experts-ps', label: 'Experts', type: 'people-set', icon: 'people' }
];

// Icon mapping for field types
const getFieldTypeIcon = (fieldType: string) => {
  const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
    'Object Set': Braces,
    'People Set': Users,
    'Object Reference': LinkIcon,
    'Picker': CheckSquare,
    'Multi-Select Picker': CopyCheck,
    'Rich Text': Type,
    'Date': Calendar,
  };

  const IconComponent = iconMap[fieldType];
  return IconComponent ? <IconComponent size={16} /> : <CheckSquare size={16} />;
};

export default function CustomFieldsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [data, setData] = useState<CustomField[]>(mockData);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "built-in" | "custom">("all");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [searchQuery, setSearchQuery] = useState('');
  const [createFieldModalOpen, setCreateFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(50);

  // Modal state
  const [createFieldStep, setCreateFieldStep] = useState<'select-type' | 'configure'>('select-type');
  const [fieldFormData, setFieldFormData] = useState({
    type: '',
    name: '',
    namePlural: '',
    description: '',
    backrefName: '',
    backrefDescription: '',
    permittedTypes: [] as string[],
    options: [] as string[],
    viewPermissions: ['everyone'] as string[],
    editPermissions: ['everyone'] as string[]
  });
  const [newOption, setNewOption] = useState('');
  const [editingViewPermissions, setEditingViewPermissions] = useState(false);
  const [editingEditPermissions, setEditingEditPermissions] = useState(false);

  const filteredAndSortedData = data
    .filter(field => {
      const matchesCategory = categoryFilter === "all" || field.category === categoryFilter;
      const matchesType = typeFilter === "All Types" || field.fieldType === typeFilter;
      const matchesSearch = !searchQuery || field.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      // First sort by field type
      if (a.fieldType !== b.fieldType) {
        return a.fieldType.localeCompare(b.fieldType);
      }
      // Then sort by field name
      return a.name.localeCompare(b.name);
    });

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleCreateField = () => {
    setEditingField(null);
    setCreateFieldStep('select-type');
    setEditingViewPermissions(false);
    setEditingEditPermissions(false);
    // Reset form data
    setFieldFormData({
      type: '',
      name: '',
      namePlural: '',
      description: '',
      backrefName: '',
      backrefDescription: '',
      permittedTypes: [],
      options: [],
      viewPermissions: ['everyone'],
      editPermissions: ['everyone']
    });
    setNewOption('');
    setCreateFieldModalOpen(true);
  };

  const handleEditField = (field: CustomField) => {
    setEditingField(field);
    // Map field type to modal field type ID - ensure we always have a valid type
    const modalFieldType = MODAL_FIELD_TYPES.find(t => t.label === field.fieldType);
    setFieldFormData({
      type: modalFieldType?.id || 'rich-text', // Default to rich-text if mapping fails
      name: field.name,
      namePlural: '',
      description: '',
      backrefName: '',
      backrefDescription: '',
      permittedTypes: [],
      options: [],
      viewPermissions: field.viewableBy,
      editPermissions: field.editableBy
    });
    setCreateFieldStep('configure'); // Skip type selection for edit
    setEditingViewPermissions(false);
    setEditingEditPermissions(false);
    setCreateFieldModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteField = (fieldId: string) => {
    setData(prev => prev.filter(f => f.id !== fieldId));
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, fieldId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedFieldId(fieldId);
    setMenuAnchorEl(event.currentTarget);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedFieldId(null);
  };

  const handleFieldFormChange = (field: string, value: any) => {
    setFieldFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addOption = () => {
    if (newOption.trim() && !fieldFormData.options.includes(newOption.trim())) {
      setFieldFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const removeOption = (optionToRemove: string) => {
    setFieldFormData(prev => ({
      ...prev,
      options: prev.options.filter(option => option !== optionToRemove)
    }));
  };

  const getSelectedFieldType = () => {
    return MODAL_FIELD_TYPES.find(type => type.id === fieldFormData.type);
  };

  const handlePermissionChange = (field: 'viewPermissions' | 'editPermissions', newValues: string[]) => {
    // If "everyone" is selected, remove all other selections
    if (newValues.includes('everyone')) {
      if (fieldFormData[field].includes('everyone')) {
        // "everyone" was already selected, so this is trying to add something specific
        // Remove "everyone" and keep the new specific selection
        handleFieldFormChange(field, newValues.filter(val => val !== 'everyone'));
      } else {
        // "everyone" is being added, so remove all others
        handleFieldFormChange(field, ['everyone']);
      }
    } else {
      // No "everyone" in selection, just update normally
      handleFieldFormChange(field, newValues);
    }
  };

  const closeCreateFieldModal = () => {
    setCreateFieldModalOpen(false);
    setCreateFieldStep('select-type');
    setEditingViewPermissions(false);
    setEditingEditPermissions(false);
    setEditingField(null);
  };

  const createCustomField = () => {
    const selectedFieldType = getSelectedFieldType();
    if (!selectedFieldType || !fieldFormData.name.trim()) return;

    const fieldData = {
      name: fieldFormData.name.trim(),
      fieldType: selectedFieldType.label,
      appliesTo: "Table", // Default - could make this configurable
      viewableBy: fieldFormData.viewPermissions,
      editableBy: fieldFormData.editPermissions
    };

    if (editingField) {
      // Update existing field
      setData(prev => prev.map(f =>
        f.id === editingField.id
          ? { ...f, ...fieldData }
          : f
      ));
    } else {
      // Create new field
      const newField: CustomField = {
        id: String(Date.now()),
        ...fieldData,
        category: "custom" as const,
        required: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setData(prev => [newField, ...prev]);
    }
    closeCreateFieldModal();
  };

  const canSave = fieldFormData.type && fieldFormData.name.trim();

  // Get used labels from existing fields
  const getUsedLabels = (): Set<string> => {
    const labels = new Set<string>();
    data.forEach(field => labels.add(field.name));
    return labels;
  };

  const renderPermissions = (permissions: string[]) => {
    if (permissions.length <= 2) {
      return permissions.join(", ");
    }
    const displayed = permissions.slice(0, 2);
    const remaining = permissions.length - 2;
    return `${displayed.join(", ")} +${remaining} more`;
  };

  const renderAppliesTo = (appliesTo: string) => {
    const items = appliesTo.split(", ");
    if (items.length <= 3) {
      return appliesTo;
    }
    const displayed = items.slice(0, 2);
    const remaining = items.length - 2;
    return `${displayed.join(", ")} +${remaining} more`;
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Fixed Header Section */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 3, // 24px horizontal padding
          py: 3 // 24px vertical padding
        }}
      >
        <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Title and Back Navigation Group */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              {/* Back Navigation */}
              <Button
                variant="text"
                onClick={() => router.push('/app/settings')}
                startIcon={<ArrowLeft size={16} />}
                sx={{
                  color: 'text.secondary',
                  fontSize: '14px',
                  fontWeight: 400,
                  textTransform: 'none',
                  padding: '4px 8px',
                  alignSelf: 'flex-start',
                  '&:hover': {
                    backgroundColor: 'grey.50',
                    color: 'text.primary'
                  }
                }}
              >
                Settings
              </Button>

              <Typography variant="h1">
                Custom Fields & Permissions
              </Typography>
            </Box>

            {/* Create Field Button */}
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={handleCreateField}
            >
              Create Field
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <Box sx={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <Box sx={{ p: `${"24px"}px` }}>
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Category Toggle */}
              <ToggleButtonGroup
                value={categoryFilter}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    setCategoryFilter(newValue as "all" | "built-in" | "custom");
                    setPage(1); // Reset to first page when filter changes
                  }
                }}
                size="small"
                sx={{
                  backgroundColor: theme.palette.neutral[100],
                  borderRadius: "6px",
                  p: "2px",
                  "& .MuiToggleButtonGroup-grouped": {
                    border: "none",
                    borderRadius: "4px",
                    px: "12px",
                    py: 0,
                    height: "32px",
                    fontSize: "13px",
                    fontWeight: 500,
                    textTransform: "none",
                    "&.Mui-selected": {
                      backgroundColor: "#ffffff",
                      boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.33)",
                      color: theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: "#ffffff",
                      },
                    },
                    "&:not(.Mui-selected)": {
                      backgroundColor: "transparent",
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        backgroundColor: theme.palette.neutral[100],
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="built-in">Built-in</ToggleButton>
                <ToggleButton value="custom">Custom</ToggleButton>
              </ToggleButtonGroup>

              <Select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1); // Reset to first page when filter changes
                }}
                size="small"
                sx={{
                  minWidth: '160px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '13px',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 400
                  }
                }}
              >
                {FIELD_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type !== "All Types" && (
                        <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                          {getFieldTypeIcon(type)}
                        </Box>
                      )}
                      <Typography sx={{
                        fontSize: '13px',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 400,
                        lineHeight: 1.4
                      }}>
                        {type}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>

              <TextField
                size="small"
                placeholder="Search custom fields..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page when search changes
                }}
                InputProps={{
                  startAdornment: <Search size={16} style={{ marginRight: 8, color: '#71767D' }} />
                }}
                sx={{ width: '100%', maxWidth: 400 }}
              />
            </Box>

            {/* Table */}
            <Box sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', position: 'relative' }}>
                <thead>
                  <tr style={{ backgroundColor: theme.palette.neutral[100] }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid',
                      borderBottomColor: theme.palette.neutral[300],
                      fontSize: 13,
                      fontWeight: 500,
                      color: theme.palette.text.secondary
                    }}>
                      Field Name
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid',
                      borderBottomColor: theme.palette.neutral[300],
                      fontSize: 13,
                      fontWeight: 500,
                      color: theme.palette.text.secondary
                    }}>
                      Applies to
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid',
                      borderBottomColor: theme.palette.neutral[300],
                      fontSize: 13,
                      fontWeight: 500,
                      color: theme.palette.text.secondary
                    }}>
                      Viewable by
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid',
                      borderBottomColor: theme.palette.neutral[300],
                      fontSize: 13,
                      fontWeight: 500,
                      color: theme.palette.text.secondary
                    }}>
                      Editable by
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      borderBottom: '1px solid rgb(229, 231, 235)',
                      width: '60px'
                    }}>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((field) => (
                    <tr
                      key={field.id}
                      onMouseEnter={() => setHoveredRowId(field.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                      onClick={() => handleEditField(field)}
                      style={{
                        backgroundColor: hoveredRowId === field.id ? theme.palette.neutral[100] : 'transparent',
                        transition: 'background-color 0.15s',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid',
                        borderBottomColor: theme.palette.neutral[300],
                        fontSize: 13,
                        fontWeight: 500,
                        height: '56px'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 1,
                              bgcolor: '#ECF6FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Box sx={{ color: '#0073DD', display: 'flex', alignItems: 'center' }}>
                              {getFieldTypeIcon(field.fieldType)}
                            </Box>
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 500,
                                lineHeight: 1.54,
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {field.name}
                            </Typography>
                          </Box>
                        </Box>
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid',
                        borderBottomColor: theme.palette.neutral[300],
                        fontSize: 13,
                        color: theme.palette.text.secondary,
                        height: '56px'
                      }}>
                        {renderAppliesTo(field.appliesTo)}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid',
                        borderBottomColor: theme.palette.neutral[300],
                        fontSize: 13,
                        color: theme.palette.text.secondary,
                        height: '56px'
                      }}>
                        {renderPermissions(field.viewableBy)}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid',
                        borderBottomColor: theme.palette.neutral[300],
                        fontSize: 13,
                        color: theme.palette.text.secondary,
                        height: '56px'
                      }}>
                        {renderPermissions(field.editableBy)}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid',
                          borderBottomColor: theme.palette.neutral[300],
                          textAlign: 'right',
                          width: '60px',
                          height: '56px'
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, field.id)}
                          sx={{
                            padding: "4px",
                            visibility: hoveredRowId === field.id || selectedFieldId === field.id ? 'visible' : 'hidden'
                          }}
                        >
                          <MoreVertical size={18} />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            const field = data.find(f => f.id === selectedFieldId);
            if (field) handleEditField(field);
          }}
        >
          Edit Field
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedFieldId) handleDeleteField(selectedFieldId);
          }}
          sx={{ color: 'error.main' }}
        >
          Delete Field
        </MenuItem>
      </Menu>

      {/* Create/Edit Field Modal */}
      <CreateFieldModal
        open={createFieldModalOpen}
        onClose={closeCreateFieldModal}
        onCreateField={createCustomField}
        editingField={editingField}
        usedLabels={getUsedLabels()}
        isTemplateContext={false}
        FieldPreview={FieldPreview}
      />
    </Box>
  );
}
