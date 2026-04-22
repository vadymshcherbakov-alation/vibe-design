'use client';

import { useState, useEffect } from "react";
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup, TextField, IconButton, Switch, FormControlLabel, Autocomplete, Chip, Divider, Tab, Tabs, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowLeft, Edit, Check, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { TemplateCanvas } from "../../components/template-canvas";
import { FieldsPanel } from "../../components/fields-panel";
import { CollapsiblePanel } from "../../components/collapsible-panel";
import { FieldPreview } from "../../components/field-preview";
import { CreateFieldModal } from "../../../../../components/create-field-modal";

// Mock data sources - this would come from API
const DATA_SOURCES = [
  {
    id: 'snowflake-prod',
    name: 'Snowflake Production',
    type: 'Snowflake',
    connection: 'prod.snowflake.com'
  },
  {
    id: 'postgres-analytics',
    name: 'Postgres Analytics',
    type: 'PostgreSQL',
    connection: 'analytics.postgres.internal'
  },
  {
    id: 'mysql-app',
    name: 'MySQL Application DB',
    type: 'MySQL',
    connection: 'app.mysql.internal'
  },
  {
    id: 'oracle-dev',
    name: 'Oracle Development',
    type: 'Oracle',
    connection: 'dev.oracle.internal'
  },
  {
    id: 'redshift-warehouse',
    name: 'Redshift Data Warehouse',
    type: 'Amazon Redshift',
    connection: 'warehouse.redshift.amazonaws.com'
  },
  {
    id: 'bigquery-analytics',
    name: 'BigQuery Analytics',
    type: 'BigQuery',
    connection: 'analytics.bigquery.google.com'
  }
];

export default function TableTemplateEditorPage() {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const templateId = params.templateId as string;

  const [mode, setMode] = useState<'build' | 'preview'>('build');
  const [addZone, setAddZone] = useState<'main' | 'side'>('main');
  const [fieldsPanelOpen, setFieldsPanelOpen] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Data source configuration state
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Group selection state
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; zone: 'main' | 'side'; label: string } | null>(null);

  // Group modal state
  const [groupModal, setGroupModal] = useState<{
    open: boolean;
    zone?: 'main' | 'side';
    type?: 'empty' | 'from-fields';
    fields?: any[];
  }>({ open: false });
  const [groupName, setGroupName] = useState('');

  // Create field modal state (for compatibility with shared modal)
  const [createFieldModal, setCreateFieldModal] = useState({ open: false });

  const closeCreateFieldModal = () => {
    setCreateFieldModal({ open: false });
  };

  const handleCreateNewField = () => {
    setCreateFieldModal({ open: true });
  };

  const createCustomField = (fieldData: any) => {
    // Handle field creation logic
    console.log('Create custom field:', fieldData);
    closeCreateFieldModal();
    setIsDirty(true);
  };

  // Get used labels for field validation
  const getUsedLabels = (): Set<string> => {
    const labels = new Set<string>();
    [...template.main, ...template.side].forEach((item: any) => {
      if ('group' in item && item.group) {
        item.fields?.forEach((field: any) => labels.add(field.label));
      } else {
        labels.add(item.label);
      }
    });
    return labels;
  };

  // Mock current assignments (would come from API)
  const [currentAssignments] = useState({
    dataSourceAssignments: {
      'snowflake-prod': 'propagation-template',
      'postgres-analytics': 'my-config',
      'mysql-app': 'my-config',
      'oracle-dev': 'table-test',
      'redshift-warehouse': 'visual-config-1',
      'bigquery-analytics': 'template-capibara'
    }
  });

  // Check if this is the default template
  const isDefaultTemplate = templateId === 'default';

  // Mock template data - this would come from API based on templateId
  const [template, setTemplate] = useState<{
    main: Array<{ id: string; label: string; ftype: string } | { id: string; group: true; label: string; fields: any[]; expandedByDefault: boolean }>;
    side: Array<{ id: string; label: string; ftype: string } | { id: string; group: true; label: string; fields: any[]; expandedByDefault: boolean }>;
  }>({
    main: [
      { id: 'title', label: 'Title', ftype: 'rich_text' },
      { id: 'description', label: 'Description', ftype: 'rich_text' }
    ],
    side: [
      { id: 'owner', label: 'Owner', ftype: 'people-set' },
      { id: 'steward', label: 'Steward', ftype: 'people-set' }
    ]
  });

  const handleBackToTemplates = () => {
    if (isDirty) {
      // Could show confirmation dialog here
    }
    router.push('/app/settings/custom_templates/table/templates');
  };

  const handleTemplateChange = (newTemplate: any) => {
    setTemplate(newTemplate);
    setIsDirty(true);
  };

  const openGroupModal = (zone: 'main' | 'side', type: 'empty' | 'from-fields', fields?: any[]) => {
    setGroupModal({ open: true, zone, type, fields });
    setGroupName('');
    setSelectedGroup(null); // Clear any existing selection
  };

  const closeGroupModal = () => {
    setGroupModal({ open: false });
    setGroupName('');
  };

  const createGroup = () => {
    if (!groupName.trim() || !groupModal.zone) {
      closeGroupModal();
      return;
    }

    const newGroup = {
      id: `g-${Date.now()}`,
      group: true as const,
      label: groupName.trim(),
      fields: groupModal.fields || [],
      expandedByDefault: true
    };

    const newTemplate = { ...template };

    // If creating group from existing fields, remove them first
    if (groupModal.fields && groupModal.fields.length > 0) {
      groupModal.fields.forEach(field => {
        for (const z of ['main', 'side'] as const) {
          const items = newTemplate[z];
          for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if ('group' in item && item.group) {
              const groupItem = item as any;
              const fieldIdx = groupItem.fields.findIndex((f: any) => f.id === field.id);
              if (fieldIdx !== -1) {
                groupItem.fields.splice(fieldIdx, 1);
                if (groupItem.fields.length === 0) {
                  items.splice(i, 1);
                }
              }
            } else if (item.id === field.id) {
              items.splice(i, 1);
            }
          }
        }
      });
    }

    // Add the new group
    newTemplate[groupModal.zone] = [...newTemplate[groupModal.zone], newGroup];
    setTemplate(newTemplate);
    setIsDirty(true);

    // Auto-select the newly created group for field addition
    if (groupModal.zone) {
      setTimeout(() => {
        setSelectedGroup({ id: newGroup.id, zone: groupModal.zone!, label: newGroup.label });
        setAddZone(groupModal.zone!);
        if (!fieldsPanelOpen) {
          setFieldsPanelOpen(true);
        }
      }, 100); // Small delay to ensure template is updated first
    }

    closeGroupModal();
  };

  const toggleFieldsPanel = () => {
    setFieldsPanelOpen(!fieldsPanelOpen);
  };

  const handleAddField = (field: any) => {
    const newField = {
      id: `f-${Date.now()}`,
      label: field.label,
      ftype: field.ftype
    };

    const newTemplate = { ...template };
    newTemplate[addZone] = [...newTemplate[addZone], newField];
    setTemplate(newTemplate);
    setIsDirty(true);
  };

  const handleAddFieldToCanvas = (field: any) => {
    if (selectedGroup) {
      // Add field to selected group
      const newTemplate = { ...template };
      const groupIndex = newTemplate[selectedGroup.zone].findIndex(item => item.id === selectedGroup.id);
      if (groupIndex !== -1) {
        const group = newTemplate[selectedGroup.zone][groupIndex] as any;
        const newField = {
          id: `f-${Date.now()}`,
          label: field.label,
          ftype: field.ftype
        };
        group.fields.push(newField);
        setTemplate(newTemplate);
        setIsDirty(true);
      }
    } else {
      // Add field to zone (existing behavior)
      handleAddField(field);
    }
  };

  const handleAddZoneChange = (zone: 'main' | 'side') => {
    setAddZone(zone);
    if (!fieldsPanelOpen) {
      setFieldsPanelOpen(true);
    }
  };



  const handleSave = () => {
    // Save logic would go here
    setIsDirty(false);
  };

  const handleCancel = () => {
    if (isDirty) {
      // Could add confirmation dialog here if needed
    }
    setIsDirty(false);
  };

  // Initialize template name and data source configuration
  useEffect(() => {
    let initialName = '';
    if (templateId.includes('default')) {
      initialName = 'Default Template';
      setSelectedDataSources([]);
    } else if (templateId.includes('new') || templateId.includes('table-template-')) {
      initialName = 'New Table Template';
      setSelectedDataSources([]);
    } else {
      initialName = templateId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      // Mock some existing data source configuration
      if (templateId === 'my-config') {
        setSelectedDataSources(['postgres-analytics', 'mysql-app']);
      } else if (templateId === 'propagation-template') {
        setSelectedDataSources(['snowflake-prod']);
      } else if (templateId === 'table-test') {
        setSelectedDataSources(['oracle-dev']);
      } else if (templateId === 'visual-config-1') {
        setSelectedDataSources(['redshift-warehouse']);
      } else if (templateId === 'template-capibara') {
        setSelectedDataSources(['bigquery-analytics']);
      } else {
        setSelectedDataSources([]);
      }
    }
    setTemplateName(initialName);
  }, [templateId]);

  const handleStartEditingName = () => {
    setIsEditingName(true);
  };

  const handleSaveTemplateName = () => {
    setIsEditingName(false);
    setIsDirty(true);
  };

  const handleCancelEditingName = () => {
    setIsEditingName(false);
    // Reset to original name - in real app would reset from API data
  };

  const handleTemplateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value);
  };

  const handleDataSourcesChange = (event: any, value: string[]) => {
    setSelectedDataSources(value);
    setIsDirty(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Check if a data source is available for this template
  const isDataSourceAvailable = (dataSourceId: string) => {
    const assignedTemplate = currentAssignments.dataSourceAssignments[dataSourceId as keyof typeof currentAssignments.dataSourceAssignments];
    return !assignedTemplate || assignedTemplate === templateId || selectedDataSources.includes(dataSourceId);
  };

  // Get template name for display
  const getTemplateName = (templateId: string) => {
    const templateNames: Record<string, string> = {
      'default': 'Default Template',
      'my-config': 'My Config',
      'propagation-template': 'Propagation Template',
      'table-test': 'Table Test',
      'visual-config-1': 'Visual Config 1742983751376',
      'template-capibara': 'template capibara'
    };
    return templateNames[templateId] || templateId;
  };

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      maxWidth: '100%', // Prevent exceeding parent container
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden' // Contain any overflow
    }}>
      {/* Fixed Header Section */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Top Header Content */}
        <Box sx={{ px: 3, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Title and Back Navigation Group */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              {/* Back Navigation */}
              <Button
                variant="text"
                onClick={handleBackToTemplates}
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
                Table Templates
              </Button>

              {isEditingName ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    value={templateName}
                    onChange={handleTemplateNameChange}
                    variant="outlined"
                    size="small"
                    autoFocus
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '22px',
                        fontWeight: 600,
                        lineHeight: 1.21
                      }
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleSaveTemplateName}
                    sx={{
                      color: 'success.main',
                      '&:hover': {
                        backgroundColor: 'success.50'
                      }
                    }}
                  >
                    <Check size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleCancelEditingName}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'grey.50'
                      }
                    }}
                  >
                    <X size={18} />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h1">
                    {templateName}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleStartEditingName}
                    sx={{
                      color: 'text.secondary',
                      opacity: 0.7,
                      '&:hover': {
                        opacity: 1,
                        backgroundColor: 'grey.50'
                      }
                    }}
                  >
                    <Edit size={18} />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isDirty && (
                <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                  Unsaved changes
                </Typography>
              )}

              <Button
                variant="outlined"
                size="medium"
                disabled={!isDirty}
                onClick={handleCancel}
                sx={{
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                size="medium"
                disabled={!isDirty}
                onClick={handleSave}
                sx={{
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main'
            },
            '& .MuiTabs-flexContainer': {
              pl: 3
            }
          }}
        >
          <Tab label="Template" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Template Settings" sx={{ textTransform: 'none', fontWeight: 500 }} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 ? (
        // Template Tab Content
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            width: '100%',
            minWidth: 0,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: fieldsPanelOpen ? 'auto 1fr' : 'auto 1fr',
            position: 'relative'
          }}
        >
          <CollapsiblePanel
            isExpanded={fieldsPanelOpen}
            onToggle={toggleFieldsPanel}
            defaultWidth={280}
            minWidth={240}
            maxWidth={400} // Reduced from 500 to prevent layout overflow
            toggleButtonTop="56px"
          >
            <FieldsPanel
              addZone={addZone}
              onAddZoneChange={handleAddZoneChange}
              onAddField={handleAddFieldToCanvas}
              usedLabels={getUsedLabels()}
              onCreateNewField={handleCreateNewField}
              selectedGroup={selectedGroup}
            />
          </CollapsiblePanel>

          <Box sx={{ minWidth: 0, height: '100%', overflow: 'hidden' }}>
            <TemplateCanvas
              template={template}
              onTemplateChange={handleTemplateChange}
              addZone={addZone}
              onAddZoneChange={handleAddZoneChange}
              mode={mode}
              onModeChange={setMode}
              onCreateGroup={openGroupModal}
              fieldsPanelOpen={fieldsPanelOpen}
              onAddField={handleAddField}
              onGroupSelectionChange={setSelectedGroup}
              selectedGroup={selectedGroup}
            />
          </Box>
        </Box>
      ) : (
        // Data Sources Tab Content
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Box sx={{ maxWidth: '600px' }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Data Sources
            </Typography>

            {isDefaultTemplate ? (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Default Template
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  This template applies to any data source that doesn't have a specific template assigned. It serves as the fallback for all unassigned sources.
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Choose which data sources this template applies to. This template will appear when users create or edit tables from the selected sources.
                </Typography>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'text.secondary',
                      mb: 1,
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  >
                    Select specific data sources
                  </Typography>
                  <Autocomplete
                    multiple
                    size="small"
                    options={DATA_SOURCES.map(ds => ds.id)}
                    getOptionLabel={(option) => DATA_SOURCES.find(ds => ds.id === option)?.name || option}
                    getOptionDisabled={(option) => !isDataSourceAvailable(option)}
                  value={selectedDataSources}
                  onChange={handleDataSourcesChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      InputProps={params.InputProps as any}
                      placeholder="Select data sources..."
                      variant="outlined"
                    />
                  )}
                  renderOption={(props, option) => {
                    const dataSource = DATA_SOURCES.find(ds => ds.id === option);
                    const isAvailable = isDataSourceAvailable(option);
                    const assignedTemplate = currentAssignments.dataSourceAssignments[option as keyof typeof currentAssignments.dataSourceAssignments];

                    return (
                      <li {...props} style={{ opacity: isAvailable ? 1 : 0.5 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {dataSource?.name}
                            {!isAvailable && assignedTemplate && (
                              <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                (assigned to {getTemplateName(assignedTemplate)})
                              </Typography>
                            )}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {dataSource?.type} • {dataSource?.connection}
                          </Typography>
                        </Box>
                      </li>
                    );
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const dataSource = DATA_SOURCES.find(ds => ds.id === option);
                      return (
                        <Chip
                          {...getTagProps({ index })}
                          label={dataSource?.name}
                          sx={{
                            fontSize: '13px',
                            height: '28px'
                          }}
                        />
                      );
                    })
                  }
                  componentsProps={{
                    popper: {
                      sx: {
                        '& .MuiAutocomplete-paper': {
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: `1px solid ${theme.palette.neutral[300]}`
                        }
                      }
                    }
                  }}
                  sx={{ width: '100%' }}
                />
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}

      {/* Group Creation Modal */}
      <Dialog
        open={groupModal.open}
        onClose={closeGroupModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            fontSize: 18,
            fontWeight: 600,
            lineHeight: 1.2
          }}
        >
          Create Field Group
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 3 }}>
          <Box sx={{ mb: 1 }}>
            <Typography
              component="label"
              variant="body2"
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: 'text.primary',
                mb: 1,
                display: 'block'
              }}
            >
              Group Name
            </Typography>
            <TextField
              autoFocus
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && groupName.trim()) {
                  createGroup();
                }
              }}
              placeholder="e.g., Classification Information"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 40,
                  fontSize: 14,
                  '& fieldset': {
                    borderColor: 'divider'
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.600'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 1
                  }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={closeGroupModal}
            color="inherit"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={createGroup}
            variant="contained"
            disabled={!groupName.trim()}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Field Modal */}
      <CreateFieldModal
        open={createFieldModal.open}
        onClose={closeCreateFieldModal}
        onCreateField={createCustomField}
        usedLabels={getUsedLabels()}
        isTemplateContext={true}
        FieldPreview={FieldPreview}
      />
    </Box>
  );
}