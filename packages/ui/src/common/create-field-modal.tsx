// PROTOTYPE-ONLY: scaffolding for the vibe-design prototype. Not part of the design system.
'use client';

import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Chip, Autocomplete, FormControl, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowLeft, X, Plus, Braces, Users, Link as LinkIcon, CheckSquare, CopyCheck, Type, Calendar } from "lucide-react";

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

const OBJECT_TYPES = [
  'Table', 'Column', 'Schema', 'Data Source', 'BI Report', 'BI Folder',
  'AI Model', 'Data Policy', 'Feature Cube', 'Dashboard', 'Query', 'User'
];

// Field types with their configurations
export const MODAL_FIELD_TYPES = [
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

export interface CreateFieldModalProps {
  open: boolean;
  onClose: () => void;
  onCreateField: (fieldData: any) => void;
  editingField?: any;
  usedLabels?: Set<string>;
  // For template editor context
  isTemplateContext?: boolean;
  // Optional field preview component
  FieldPreview?: React.ComponentType<any>;
}

export function CreateFieldModal({
  open,
  onClose,
  onCreateField,
  editingField,
  usedLabels = new Set(),
  isTemplateContext = false,
  FieldPreview
}: CreateFieldModalProps) {
  const theme = useTheme();
  const [createFieldStep, setCreateFieldStep] = useState<'select-type' | 'configure'>(editingField ? 'configure' : 'select-type');

  // Initialize form data based on editing state
  const initializeFormData = () => {
    if (editingField) {
      const modalFieldType = MODAL_FIELD_TYPES.find(t => t.label === editingField.fieldType);
      return {
        type: modalFieldType?.id || 'rich-text',
        name: editingField.name,
        namePlural: '',
        description: '',
        backrefName: '',
        backrefDescription: '',
        permittedTypes: [] as string[],
        options: [] as string[],
        viewPermissions: editingField.viewableBy || ['everyone'],
        editPermissions: editingField.editableBy || ['everyone']
      };
    }
    return {
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
    };
  };

  const [fieldFormData, setFieldFormData] = useState(initializeFormData());
  const [newOption, setNewOption] = useState('');

  // Reinitialize form when modal opens or editingField changes
  useEffect(() => {
    if (open) {
      setFieldFormData(initializeFormData());
      setCreateFieldStep(editingField ? 'configure' : 'select-type');
      setNewOption('');
    }
  }, [open, editingField]);

  const handleClose = () => {
    onClose();
  };

  const handleFieldFormChange = (field: string, value: any) => {
    setFieldFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSelectedFieldType = () => {
    return MODAL_FIELD_TYPES.find(type => type.id === fieldFormData.type);
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

  const handlePermissionChange = (field: 'viewPermissions' | 'editPermissions', newValues: string[]) => {
    // If permissions are cleared, revert to "Everyone"
    if (newValues.length === 0) {
      handleFieldFormChange(field, ['everyone']);
      return;
    }

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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: createFieldStep === 'select-type' ? "768px" : "1024px",
          maxWidth: createFieldStep === 'select-type' ? "768px" : "1024px",
          borderRadius: "16px",
          boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)"
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "22px",
          pb: "16px",
          px: "24px",
          borderBottom: `1px solid ${theme.tokens.color.border.default}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {createFieldStep === 'configure' && !editingField && (
            <IconButton
              onClick={() => setCreateFieldStep('select-type')}
              size="small"
              sx={{
                color: theme.tokens.color.text.secondary,
                '&:hover': {
                  backgroundColor: theme.tokens.color.background.control.hover
                }
              }}
            >
              <ArrowLeft size={16} />
            </IconButton>
          )}
          <Typography
            component="h1"
            sx={{
              fontSize: `${theme.tokens.typography.heading.h1.size}px`,
              fontWeight: theme.tokens.typography.heading.h1.weight,
              lineHeight: theme.tokens.typography.heading.h1.lineHeight,
              fontFamily: theme.tokens.typography.fontFamily,
              color: 'text.primary'
            }}
          >
            {editingField
              ? 'Edit Field'
              : createFieldStep === 'select-type'
                ? 'Select Field Type'
                : `Create ${getSelectedFieldType()?.label || ''} Field`
            }
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {createFieldStep === 'select-type' ? (
          <Box sx={{ px: "24px", py: "16px" }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.tokens.color.text.secondary,
                mb: "24px",
                fontSize: "14px",
                lineHeight: "20px"
              }}
            >
              Choose the type of field you want to create. Each field type is designed for specific use cases.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >
              {MODAL_FIELD_TYPES.map(type => (
                <Box
                  key={type.id}
                  onClick={() => {
                    handleFieldFormChange('type', type.id);
                    setCreateFieldStep('configure');
                  }}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    p: '16px',
                    backgroundColor: theme.tokens.color.background.surface.default,
                    borderRadius: '8px',
                    border: `1px solid ${theme.tokens.color.border.default}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: theme.tokens.color.border.hover,
                      backgroundColor: theme.tokens.color.background.control.hover,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      mb: '8px'
                    }}
                  >
                    <Box sx={{ color: '#0073DD', display: 'flex', alignItems: 'center' }}>
                      {getFieldTypeIcon(type.label)}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.tokens.color.text.primary,
                        fontWeight: 500,
                        fontSize: '14px'
                      }}
                    >
                      {type.label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.tokens.color.text.secondary,
                      fontSize: '12px',
                      lineHeight: '16px'
                    }}
                  >
                    {type.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', height: '500px' }}>
            {/* Left Panel - Field Configuration */}
            <Box sx={{
              width: '65%',
              px: "24px",
              py: "16px",
              borderRight: `1px solid ${theme.tokens.color.border.default}`,
              overflowY: 'auto'
            }}>
              <Typography
                component="h2"
                sx={{
                  mb: 3,
                  fontSize: `${theme.tokens.typography.heading.h2.size}px`,
                  fontWeight: theme.tokens.typography.heading.h2.weight,
                  lineHeight: theme.tokens.typography.heading.h2.lineHeight,
                  fontFamily: theme.tokens.typography.fontFamily,
                  color: 'text.primary'
                }}
              >
                Field Settings
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Field Name */}
                {getSelectedFieldType()?.needsName && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.tokens.color.text.secondary,
                        mb: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.15px"
                      }}
                    >
                      Field Name
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., Field Name"
                      value={fieldFormData.name}
                      onChange={(e) => handleFieldFormChange('name', e.target.value)}
                      size="small"
                    />
                  </Box>
                )}

                {/* Plural Name for multi-value fields */}
                {getSelectedFieldType()?.needsPlural && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.tokens.color.text.secondary,
                        mb: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.15px"
                      }}
                    >
                      Field Name (Plural)
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., Field Names"
                      value={fieldFormData.namePlural}
                      onChange={(e) => handleFieldFormChange('namePlural', e.target.value)}
                      size="small"
                    />
                  </Box>
                )}

                {/* Field Description */}
                {getSelectedFieldType()?.needsDescription && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.tokens.color.text.secondary,
                        mb: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.15px"
                      }}
                    >
                      Field Description/Tooltip
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="This will appear as tooltip text for users"
                      value={fieldFormData.description}
                      onChange={(e) => handleFieldFormChange('description', e.target.value)}
                      size="small"
                    />
                  </Box>
                )}

                {/* Permitted Types for reference fields */}
                {getSelectedFieldType()?.needsPermittedTypes && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.tokens.color.text.secondary,
                        mb: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.15px"
                      }}
                    >
                      Permitted Object Types
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        value={fieldFormData.permittedTypes}
                        onChange={(e) => handleFieldFormChange('permittedTypes', e.target.value)}
                        input={<OutlinedInput />}
                        renderValue={(selected) => selected.join(', ')}
                      >
                        {OBJECT_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            <Checkbox checked={fieldFormData.permittedTypes.indexOf(type) > -1} />
                            <ListItemText primary={type} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}

                {/* Backreference fields */}
                {getSelectedFieldType()?.needsBackref && (
                  <>
                    <Divider sx={{ my: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', px: 2 }}>
                        Backreference Configuration
                      </Typography>
                    </Divider>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.tokens.color.text.secondary,
                          mb: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.15px"
                        }}
                      >
                        Backreference Field Name
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="e.g., Referenced By"
                        value={fieldFormData.backrefName}
                        onChange={(e) => handleFieldFormChange('backrefName', e.target.value)}
                        size="small"
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.tokens.color.text.secondary,
                          mb: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.15px"
                        }}
                      >
                        Backreference Description
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Description for the reverse relationship"
                        value={fieldFormData.backrefDescription}
                        onChange={(e) => handleFieldFormChange('backrefDescription', e.target.value)}
                        size="small"
                      />
                    </Box>
                  </>
                )}

                {/* Options for Picker fields */}
                {getSelectedFieldType()?.needsOptions && (
                  <>
                    <Divider sx={{ my: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', px: 2 }}>
                        Field Options
                      </Typography>
                    </Divider>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.tokens.color.text.secondary,
                          mb: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.15px"
                        }}
                      >
                        Add Option
                      </Typography>
                      <Box sx={{ display: 'flex', gap: "8px", mb: "16px" }}>
                        <TextField
                          fullWidth
                          placeholder="e.g., High Priority"
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          size="small"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addOption();
                            }
                          }}
                        />
                        <Button
                          variant="outlined"
                          onClick={addOption}
                          disabled={!newOption.trim()}
                          sx={{ textTransform: "none", fontSize: "13px", fontWeight: 600 }}
                        >
                          <Plus size={16} />
                        </Button>
                      </Box>

                      {fieldFormData.options.length > 0 && (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Options:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {fieldFormData.options.map((option) => (
                              <Chip
                                key={option}
                                label={option}
                                onDelete={() => removeOption(option)}
                                deleteIcon={<X size={14} />}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </Box>

              {/* Always show Permissions section */}
              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', px: 2 }}>
                  Permissions
                </Typography>
              </Divider>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* View Permissions */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.tokens.color.text.secondary,
                      mb: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.15px"
                    }}
                  >
                    Who can view this field?
                  </Typography>
                  {editingField?.category === 'built-in' ? (
                    <TextField
                      fullWidth
                      size="small"
                      value="Everyone"
                      disabled
                      helperText="Built-in fields are always viewable by everyone"
                    />
                  ) : (
                    <Autocomplete
                      multiple
                      size="small"
                      options={PERMISSION_OPTIONS.map(opt => opt.id)}
                      getOptionLabel={(option) => PERMISSION_OPTIONS.find(opt => opt.id === option)?.label || option}
                      value={fieldFormData.viewPermissions}
                      onChange={(_, newValue) => handlePermissionChange('viewPermissions', newValue)}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      renderInput={(params) => <TextField {...params} InputProps={params.InputProps as any} placeholder="Select Groups or People Sets" />}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={PERMISSION_OPTIONS.find(opt => opt.id === option)?.label || option}
                            {...getTagProps({ index })}
                            sx={{
                              fontSize: '13px',
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                              height: '24px'
                            }}
                          />
                        ))
                      }
                      componentsProps={{
                        popper: {
                          sx: {
                            '& .MuiAutocomplete-paper': {
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                              border: `1px solid ${theme.tokens.color.border.default}`
                            }
                          }
                        }
                      }}
                    />
                  )}
                </Box>

                {/* Edit Permissions */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.tokens.color.text.secondary,
                      mb: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.15px"
                    }}
                  >
                    Who can edit this field?
                  </Typography>
                  <Autocomplete
                    multiple
                    size="small"
                    options={PERMISSION_OPTIONS.map(opt => opt.id)}
                    getOptionLabel={(option) => PERMISSION_OPTIONS.find(opt => opt.id === option)?.label || option}
                    value={fieldFormData.editPermissions}
                    onChange={(_, newValue) => handlePermissionChange('editPermissions', newValue)}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    renderInput={(params) => <TextField {...params} InputProps={params.InputProps as any} placeholder="Select Groups or People Sets" />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={PERMISSION_OPTIONS.find(opt => opt.id === option)?.label || option}
                          {...getTagProps({ index })}
                          sx={{
                            fontSize: '13px',
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                            height: '24px'
                          }}
                        />
                      ))
                    }
                    componentsProps={{
                      popper: {
                        sx: {
                          '& .MuiAutocomplete-paper': {
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: `1px solid ${theme.tokens.color.border.default}`
                          }
                        }
                      }
                    }}
                  />
                  {editingField?.category === 'built-in' && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '12px',
                        mt: 0.5,
                        display: 'block'
                      }}
                    >
                      Edit permissions can be modified for built-in fields
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Right Panel - Field Preview */}
            <Box sx={{
              width: '35%',
              backgroundColor: theme.tokens.color.background.surface.secondary,
              overflowY: 'auto'
            }}>
              <Box sx={{ px: "24px", py: "16px" }}>
                <Typography
                  component="h2"
                  sx={{
                    mb: 3,
                    fontSize: `${theme.tokens.typography.heading.h2.size}px`,
                    fontWeight: theme.tokens.typography.heading.h2.weight,
                    lineHeight: theme.tokens.typography.heading.h2.lineHeight,
                    fontFamily: theme.tokens.typography.fontFamily,
                    color: 'text.primary'
                  }}
                >
                  Field Preview
                </Typography>

{FieldPreview ? (
                  <FieldPreview
                    selectedFieldType={getSelectedFieldType()}
                    fieldFormData={fieldFormData}
                  />
                ) : (
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      {fieldFormData.name || getSelectedFieldType()?.label || 'Field Name'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                      {getSelectedFieldType()?.description}
                    </Typography>
                    {fieldFormData.description && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        Tooltip: {fieldFormData.description}
                      </Typography>
                    )}
                    {fieldFormData.options.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                          Options:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {fieldFormData.options.map((option) => (
                            <Chip key={option} label={option} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      {createFieldStep === 'configure' && (
        <DialogActions sx={{
          p: 3,
          pt: 2,
          borderTop: `1px solid ${theme.tokens.color.border.default}`
        }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => onCreateField(fieldFormData)}
            disabled={!fieldFormData.type || !fieldFormData.name.trim()}
          >
            {editingField ? 'Save Changes' : 'Create Field'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}