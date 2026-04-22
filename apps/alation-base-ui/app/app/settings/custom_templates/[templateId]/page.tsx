'use client';

import { useState } from "react";
import { Box, Typography, Button, Link, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, Select, MenuItem, Chip, OutlinedInput, Checkbox, ListItemText, IconButton, Divider, Autocomplete } from "@mui/material";
import { ArrowLeft, X, Plus, User, Users, Folder, BarChart3, Edit, Braces, Link as LinkIcon, CheckSquare, CopyCheck, Type, Calendar } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import "allotment/dist/style.css";
import { FieldsPanel } from '../components/fields-panel';
import { CollapsiblePanel } from '../components/collapsible-panel';
import { TemplateCanvas } from '../components/template-canvas';
import { FieldTypeIcon } from '../components/field-types';
import { FieldPreview } from '../components/field-preview';
import { CreateFieldModal } from "../../../../components/create-field-modal";

// Field types with their configurations
const FIELD_TYPES = [
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

// Template categories data
const TEMPLATE_SECTIONS = [
  {
    id: "dob",
    label: "Data Objects",
    items: [
      { id: "table", label: "Table", description: "Configure fields for table catalog pages" },
      { id: "column", label: "Column", description: "Configure fields for column catalog pages" },
      { id: "schema", label: "Schema", description: "Configure fields for schema catalog pages" },
      { id: "datasource", label: "Data Source", description: "Configure fields for data source catalog pages" },
      { id: "bi-report", label: "BI Report", description: "Configure fields for BI report catalog pages" },
      { id: "bi-folder", label: "BI Folder", description: "Configure fields for BI folder catalog pages" }
    ]
  },
  {
    id: "cat",
    label: "Custom Asset Types",
    items: [
      { id: "ai-model", label: "AI Model", description: "Configure fields for AI model catalog pages" },
      { id: "data-policy", label: "Data Policy", description: "Configure fields for data policy catalog pages" },
      { id: "feature-cube", label: "Feature Cube", description: "Configure fields for feature cube catalog pages" }
    ]
  }
];

export default function TemplateEditorPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.templateId as string;

  const [templates, setTemplates] = useState<{
    table: {
      main: Array<{ id: string; label: string; ftype: string } | { id: string; group: true; label: string; fields: any[]; expandedByDefault: boolean }>;
      side: Array<{ id: string; label: string; ftype: string } | { id: string; group: true; label: string; fields: any[]; expandedByDefault: boolean }>;
    };
  }>({
    table: {
      main: [
        { id: "f1", label: "Description", ftype: "Rich text" }
      ],
      side: [
        { id: "f2", label: "Domains", ftype: "Multi-picker" },
        { id: "f3", label: "Stewards", ftype: "People set" },
        { id: "f4", label: "Tags", ftype: "Multi-picker" },
        { id: "f5", label: "References", ftype: "Reference link" }
      ]
    }
  });

  const [isDirty, setIsDirty] = useState(false);
  const [addZone, setAddZone] = useState<'main' | 'side'>('main');
  const [mode, setMode] = useState<'build' | 'preview'>('build');
  const [fieldsPanelOpen, setFieldsPanelOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; zone: 'main' | 'side'; label: string } | null>(null);
  const [createFieldModal, setCreateFieldModal] = useState({ open: false });
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
  const [groupModal, setGroupModal] = useState<{
    open: boolean;
    zone?: 'main' | 'side';
    type?: 'empty' | 'from-fields';
    fields?: any[];
  }>({ open: false });
  const [groupName, setGroupName] = useState('');
  const [focusSearchField, setFocusSearchField] = useState(false);
  const [createFieldStep, setCreateFieldStep] = useState<'select-type' | 'configure'>('select-type');
  const [editingViewPermissions, setEditingViewPermissions] = useState(false);
  const [editingEditPermissions, setEditingEditPermissions] = useState(false);

  // Mock data for permissions - in real app this would come from API
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

  const resetPermissionsToEveryone = (field: 'viewPermissions' | 'editPermissions') => {
    handleFieldFormChange(field, ['everyone']);
    if (field === 'viewPermissions') setEditingViewPermissions(false);
    if (field === 'editPermissions') setEditingEditPermissions(false);
  };

  const startEditingPermissions = (field: 'viewPermissions' | 'editPermissions') => {
    if (field === 'viewPermissions') setEditingViewPermissions(true);
    if (field === 'editPermissions') setEditingEditPermissions(true);
  };

  const handleBackToTemplates = () => {
    router.push('/app/settings/custom_templates');
  };

  const getCurrentTemplate = () => {
    if (!templateId) return { main: [], side: [] };
    return templates[templateId as keyof typeof templates] || { main: [], side: [] };
  };

  const updateTemplate = (newTemplate: any) => {
    if (!templateId) return;
    setTemplates(prev => ({
      ...prev,
      [templateId as keyof typeof templates]: newTemplate
    }));
    setIsDirty(true);
  };

  const getUsedLabels = (): Set<string> => {
    const template = getCurrentTemplate();
    const labels = new Set<string>();

    [...template.main, ...template.side].forEach(item => {
      if ('group' in item && item.group) {
        (item as any).fields.forEach((field: any) => labels.add(field.label));
      } else {
        labels.add((item as any).label);
      }
    });

    return labels;
  };

  const addField = (field: any) => {
    const template = getCurrentTemplate();
    const newField = {
      id: `f-${Date.now()}`,
      label: field.label,
      ftype: field.ftype
    };

    const newTemplate = { ...template };
    (newTemplate as any)[addZone] = [...(newTemplate as any)[addZone], newField];
    updateTemplate(newTemplate);
  };

  const handleAddFieldToCanvas = (field: any) => {
    if (selectedGroup) {
      // Add field to selected group
      const template = getCurrentTemplate();
      const newTemplate = { ...template };
      const groupIndex = (newTemplate as any)[selectedGroup.zone].findIndex((item: any) => item.id === selectedGroup.id);
      if (groupIndex !== -1) {
        const group = (newTemplate as any)[selectedGroup.zone][groupIndex];
        const newField = {
          id: `f-${Date.now()}`,
          label: field.label,
          ftype: field.ftype
        };
        group.fields.push(newField);
        updateTemplate(newTemplate);
      }
    } else {
      // Add field to zone (existing behavior)
      addField(field);
    }
  };

  const handleAddZoneChange = (zone: 'main' | 'side') => {
    setAddZone(zone);
    if (!fieldsPanelOpen) {
      setFieldsPanelOpen(true);
    }
    // Trigger search field focus
    setFocusSearchField(true);
    setTimeout(() => setFocusSearchField(false), 200);
  };

  const toggleFieldsPanel = () => {
    setFieldsPanelOpen(!fieldsPanelOpen);
  };

  const handleCreateNewField = () => {
    setCreateFieldModal({ open: true });
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
  };

  const closeCreateFieldModal = () => {
    setCreateFieldModal({ open: false });
    setCreateFieldStep('select-type');
    setEditingViewPermissions(false);
    setEditingEditPermissions(false);
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

  const createCustomField = () => {
    const selectedFieldType = FIELD_TYPES.find(type => type.id === fieldFormData.type);
    if (!selectedFieldType || !fieldFormData.name.trim()) return;

    // Double-check validation before creating
    const validation = validateFieldName(fieldFormData.name);
    const pluralValidation = validatePluralName(fieldFormData.namePlural);
    if (!validation.isValid || !pluralValidation.isValid) return;

    const newField = {
      id: `custom-${Date.now()}`,
      label: fieldFormData.name.trim(),
      ftype: selectedFieldType.label,
      description: fieldFormData.description,
      // Add other field-specific properties as needed
      isCustom: true
    };

    // Add to the selected zone
    const template = getCurrentTemplate();
    const newTemplate = { ...template };
    (newTemplate as any)[addZone] = [...(newTemplate as any)[addZone], newField];
    updateTemplate(newTemplate);
    closeCreateFieldModal();
  };

  const getSelectedFieldType = () => {
    return FIELD_TYPES.find(type => type.id === fieldFormData.type);
  };

  const validateFieldName = (name: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: true }; // Empty is handled by required validation
    }

    const usedLabels = getUsedLabels();
    if (usedLabels.has(name.trim())) {
      return { isValid: false, error: 'A field with this name already exists' };
    }

    return { isValid: true };
  };

  const validatePluralName = (name: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: true }; // Empty plural is OK for some field types
    }

    const usedLabels = getUsedLabels();
    if (usedLabels.has(name.trim())) {
      return { isValid: false, error: 'A field with this name already exists' };
    }

    return { isValid: true };
  };

  const fieldNameValidation = validateFieldName(fieldFormData.name);
  const pluralNameValidation = validatePluralName(fieldFormData.namePlural);
  const canSave = fieldFormData.type &&
                  fieldFormData.name.trim() &&
                  fieldNameValidation.isValid &&
                  pluralNameValidation.isValid;

  const openGroupModal = (zone: 'main' | 'side', type: 'empty' | 'from-fields', fields?: any[]) => {
    setGroupModal({ open: true, zone, type, fields });
    setGroupName('');
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

    try {
      const template = getCurrentTemplate();
      const newGroup = {
        id: `g-${Date.now()}`,
        group: true as const,
        label: groupName.trim(),
        fields: groupModal.fields || [],
        expandedByDefault: true // New groups are expanded by default
      };

      let newTemplate = { ...template };

      // If we're creating a group from existing fields, remove them first
      if (groupModal.fields && groupModal.fields.length > 0) {
        // Remove fields from their current locations
        groupModal.fields.forEach(field => {
          for (const zone of ['main', 'side'] as const) {
            const items = newTemplate[zone];
            for (let i = items.length - 1; i >= 0; i--) {
              const item = items[i];
              if ('group' in item) {
                // Remove from group
                const fieldIdx = (item as any).fields.findIndex((f: any) => f.id === field.id);
                if (fieldIdx !== -1) {
                  (item as any).fields.splice(fieldIdx, 1);
                  // Remove empty group
                  if ((item as any).fields.length === 0) {
                    items.splice(i, 1);
                  }
                }
              } else if (item.id === field.id) {
                // Remove individual field
                items.splice(i, 1);
              }
            }
          }
        });
      }

      // Add the new group
      (newTemplate as any)[groupModal.zone] = [...(newTemplate as any)[groupModal.zone], newGroup];
      updateTemplate(newTemplate);

      // Auto-select the newly created group for field addition
      if (groupModal.zone) {
        setTimeout(() => {
          setSelectedGroup({ id: newGroup.id, zone: groupModal.zone!, label: newGroup.label });
          setAddZone(groupModal.zone!);
          if (!fieldsPanelOpen) {
            setFieldsPanelOpen(true);
          }
          // Trigger search field focus
          setFocusSearchField(true);
          setTimeout(() => setFocusSearchField(false), 200);
        }, 100); // Small delay to ensure template is updated first
      }

    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      // Always close the modal, even if there was an error
      closeGroupModal();
    }
  };

  const handleSave = () => {
    // Save logic would go here
    setIsDirty(false);
  };

  const handleCancel = () => {
    if (isDirty) {
      // Could add confirmation dialog here if needed
      // For now, just reset to clean state
      setIsDirty(false);
    }
  };

  const getTemplateInfo = () => {
    if (!templateId) return null;

    for (const section of TEMPLATE_SECTIONS) {
      const item = section.items.find(i => i.id === templateId);
      if (item) {
        return {
          section,
          item,
          hasCustomization: !!templates[templateId as keyof typeof templates]
        };
      }
    }
    return null;
  };

  const templateInfo = getTemplateInfo();

  if (!templateInfo) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4">Template not found</Typography>
          <Button onClick={handleBackToTemplates} sx={{ mt: 2 }}>
            Back to Templates
          </Button>
        </Box>
      </Box>
    );
  }

  const { section, item } = templateInfo;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        width: '100%',
        maxWidth: '100%', // Prevent exceeding parent container
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden' // Contain any overflow
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%'
        }}
      >
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
                Custom Templates
              </Button>

              <Typography
                variant="h1"
              >
                {item.label} Template
              </Typography>
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

        {/* Content Section */}
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
              focusSearch={focusSearchField}
              selectedGroup={selectedGroup}
            />
          </CollapsiblePanel>

          <Box sx={{ minWidth: 0, height: '100%', overflow: 'hidden' }}>
            <TemplateCanvas
              template={getCurrentTemplate() as any}
              onTemplateChange={updateTemplate}
              addZone={addZone}
              onAddZoneChange={handleAddZoneChange}
              mode={mode}
              onModeChange={setMode}
              onCreateGroup={openGroupModal}
              fieldsPanelOpen={fieldsPanelOpen}
              onAddField={addField}
              onGroupSelectionChange={setSelectedGroup}
              selectedGroup={selectedGroup}
            />
          </Box>
        </Box>
      </Box>

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
