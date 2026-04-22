'use client';

import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Chip, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowLeft, Plus, Edit, Trash2, MoreVertical, Folder, FileText } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function DocumentHubEditorPage() {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const hubId = params.hubId as string;

  const [isDirty, setIsDirty] = useState(false);
  const [hubMenuAnchorEl, setHubMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [templateMenuAnchorEl, setTemplateMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTemplateId, setMenuTemplateId] = useState<string | null>(null);

  // Initialize settings based on whether this is a new hub or existing
  const isNewHub = hubId.includes('new') || hubId.includes('document-hub-');
  const [isPublished, setIsPublished] = useState(!isNewHub); // New hubs are drafts, existing are published

  const [hubSettings, setHubSettings] = useState({
    name: isNewHub ? '' : 'Glossaries',
    folderSingular: isNewHub ? '' : 'Glossary',
    folderPlural: isNewHub ? '' : 'Glossaries',
    documentSingular: isNewHub ? '' : 'Term',
    documentPlural: isNewHub ? '' : 'Terms'
  });

  // Mock template data - combine folder and document templates into one list
  const [templates, setTemplates] = useState([
    {
      id: 'folder-template',
      name: 'Folder',
      type: 'Folder',
      isDefault: false,
      canEdit: true,
      canDelete: false
    },
    {
      id: 'default-document',
      name: 'Document',
      type: 'Document',
      isDefault: true,
      canEdit: true,
      canDelete: false
    },
    {
      id: 'business-term',
      name: 'Business Term',
      type: 'Document',
      isDefault: false,
      canEdit: true,
      canDelete: true
    },
    {
      id: 'technical-term',
      name: 'Technical Term',
      type: 'Document',
      isDefault: false,
      canEdit: true,
      canDelete: true
    },
    {
      id: 'policy-term',
      name: 'Policy Term',
      type: 'Document',
      isDefault: false,
      canEdit: true,
      canDelete: true
    },
    {
      id: 'acronym-template',
      name: 'Acronym',
      type: 'Document',
      isDefault: false,
      canEdit: true,
      canDelete: true
    },
    {
      id: 'data-definition',
      name: 'Data Definition',
      type: 'Document',
      isDefault: false,
      canEdit: true,
      canDelete: true
    }
  ]);

  const handleBackToHubs = () => {
    if (isDirty) {
      // Could show confirmation dialog here
    }
    router.push('/app/settings/custom_templates');
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

  const handleSettingsChange = (field: string, value: string) => {
    setHubSettings(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const getHubName = () => {
    if (hubId.includes('new') || hubId.includes('document-hub-')) {
      return hubSettings.name || 'New Document Hub';
    }
    return hubSettings.name;
  };

  const handleNewTemplate = () => {
    router.push(`/app/settings/custom_templates/document_hubs/${hubId}/templates/new`);
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/app/settings/custom_templates/document_hubs/${hubId}/templates/${templateId}`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log('Delete template:', templateId);
  };

  const handleSetAsDefault = (templateId: string) => {
    setTemplates(prevTemplates =>
      prevTemplates.map(template => ({
        ...template,
        isDefault: template.id === templateId
      }))
    );
    setIsDirty(true);
  };

  const handlePublish = () => {
    setIsPublished(true);
    setIsDirty(false);
    console.log('Publish hub');
  };

  const handleUnpublish = () => {
    setIsPublished(false);
    setIsDirty(true);
    console.log('Unpublish hub');
  };

  const handleDeleteHub = () => {
    console.log('Delete hub');
    setHubMenuAnchorEl(null);
    // Would redirect back to custom templates page after deletion
  };

  const handleHubMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setHubMenuAnchorEl(event.currentTarget);
  };

  const handleHubMenuClose = () => {
    setHubMenuAnchorEl(null);
  };

  const handleTemplateMenuClick = (event: React.MouseEvent<HTMLElement>, templateId: string) => {
    event.stopPropagation();
    setTemplateMenuAnchorEl(event.currentTarget);
    setMenuTemplateId(templateId);
  };

  const handleTemplateMenuClose = () => {
    setTemplateMenuAnchorEl(null);
    setMenuTemplateId(null);
  };

  const handleRowClick = (templateId: string) => {
    handleEditTemplate(templateId);
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
          px: 3,
          py: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Title and Back Navigation Group */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {/* Back Navigation */}
            <Button
              variant="text"
              onClick={handleBackToHubs}
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h1">
                {getHubName()}
              </Typography>
              {!isPublished && (
                <Chip
                  label="Draft"
                  sx={{
                    bgcolor: 'warning.100',
                    color: 'warning.700',
                    fontWeight: 500,
                    height: '28px',
                    fontSize: '13px'
                  }}
                />
              )}
            </Box>
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

            {/* Publish/Unpublish Button */}
            {!isPublished ? (
              <Button
                variant="contained"
                size="medium"
                onClick={handlePublish}
                disabled={isDirty || !hubSettings.name}
                sx={{
                  textTransform: 'none',
                  bgcolor: 'success.main',
                  '&:hover': {
                    bgcolor: 'success.dark'
                  }
                }}
              >
                Publish
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="medium"
                onClick={handleUnpublish}
                sx={{
                  textTransform: 'none',
                  borderColor: 'error.main',
                  color: 'error.main',
                  '&:hover': {
                    borderColor: 'error.dark',
                    color: 'error.dark',
                    backgroundColor: 'error.50'
                  }
                }}
              >
                Unpublish
              </Button>
            )}

            {/* Kebab Menu */}
            <IconButton
              size="medium"
              onClick={handleHubMenuClick}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <MoreVertical size={20} />
            </IconButton>

            {/* Hub Actions Menu */}
            <Menu
              anchorEl={hubMenuAnchorEl}
              open={Boolean(hubMenuAnchorEl)}
              onClose={handleHubMenuClose}
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
                  handleDeleteHub();
                  handleHubMenuClose();
                }}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.50'
                  }
                }}
              >
                <Trash2 size={16} style={{ marginRight: '8px' }} />
                Delete Hub
              </MenuItem>
            </Menu>

            {/* Template Actions Menu */}
            <Menu
              anchorEl={templateMenuAnchorEl}
              open={Boolean(templateMenuAnchorEl)}
              onClose={handleTemplateMenuClose}
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
                  if (menuTemplateId) {
                    handleEditTemplate(menuTemplateId);
                    handleTemplateMenuClose();
                  }
                }}
              >
                <Edit size={16} style={{ marginRight: '8px' }} />
                Edit Template
              </MenuItem>
              {menuTemplateId && templates.find(t => t.id === menuTemplateId)?.canDelete && (
                <MenuItem
                  onClick={() => {
                    if (menuTemplateId) {
                      handleDeleteTemplate(menuTemplateId);
                      handleTemplateMenuClose();
                    }
                  }}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.50'
                    }
                  }}
                >
                  <Trash2 size={16} style={{ marginRight: '8px' }} />
                  Delete Template
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {/* Hub Settings */}
        <Box sx={{ mb: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50' }}>
          <Typography variant="h3" sx={{ mb: 3, color: 'text.secondary', textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>
            Hub Settings
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Hub & Navigation Name
            </Typography>
            <TextField
              fullWidth
              value={hubSettings.name}
              onChange={(e) => handleSettingsChange('name', e.target.value)}
              placeholder="Enter hub name"
              size="small"
              sx={{ maxWidth: 400 }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              Appears as the top-level navigation name.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Folders are called
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    value={hubSettings.folderSingular}
                    onChange={(e) => handleSettingsChange('folderSingular', e.target.value)}
                    placeholder="Singular"
                    size="small"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Singular form
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    value={hubSettings.folderPlural}
                    onChange={(e) => handleSettingsChange('folderPlural', e.target.value)}
                    placeholder="Plural"
                    size="small"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Plural form
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Documents are called
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    value={hubSettings.documentSingular}
                    onChange={(e) => handleSettingsChange('documentSingular', e.target.value)}
                    placeholder="Singular"
                    size="small"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Singular form
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    value={hubSettings.documentPlural}
                    onChange={(e) => handleSettingsChange('documentPlural', e.target.value)}
                    placeholder="Plural"
                    size="small"
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Plural form
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Templates Table */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 600, fontSize: '18px' }}>
            Templates
          </Typography>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            startIcon={<Plus size={16} />}
            onClick={handleNewTemplate}
            sx={{
              textTransform: 'inherit',
              fontWeight: 500
            }}
          >
            New Document Template
          </Button>
        </Box>

        <Box sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  Template Name
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  borderBottom: '1px solid',
                  borderBottomColor: theme.palette.neutral[300],
                  width: '60px'
                }}>
                </th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id}
                  onClick={() => handleRowClick(template.id)}
                  style={{
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.15s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.palette.neutral[100];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 0.5,
                          bgcolor: '#ECF6FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: '#0073DD'
                        }}
                      >
                        {template.type === 'Folder' ? <Folder size={16} /> : <FileText size={16} />}
                      </Box>

                      {/* Template name */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: 13,
                            fontWeight: 400,
                            lineHeight: 1.54,
                            color: 'text.primary'
                          }}
                        >
                          {template.name}
                        </Typography>

                        {/* Default chip for default templates */}
                        {template.isDefault && (
                          <Tooltip title="Pre-selected when users create new documents">
                            <Chip
                              label="Default"
                              sx={{
                                bgcolor: 'success.200',
                                color: 'success.800',
                                fontWeight: 500,
                                height: '20px',
                                fontSize: '11px'
                              }}
                            />
                          </Tooltip>
                        )}

                        {/* Set as Default button on hover for non-default document templates */}
                        {template.type === 'Document' && !template.isDefault && (
                          <Button
                            variant="text"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetAsDefault(template.id);
                            }}
                            className="set-default-btn"
                            sx={{
                              textTransform: 'none',
                              fontSize: '12px',
                              fontWeight: 400,
                              color: 'text.secondary',
                              minWidth: 'auto',
                              px: 0.5,
                              py: 0.25,
                              opacity: 0,
                              visibility: 'hidden',
                              transition: 'all 0.15s',
                              'tr:hover &': {
                                opacity: 1,
                                visibility: 'visible'
                              },
                              '&:hover': {
                                backgroundColor: 'transparent',
                                color: 'text.primary'
                              }
                            }}
                          >
                            Set as Default
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid',
                    borderBottomColor: theme.palette.neutral[300],
                    textAlign: 'right',
                    height: '56px'
                  }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleTemplateMenuClick(e, template.id)}
                      sx={{
                        color: 'text.secondary',
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'all 0.15s',
                        'tr:hover &': {
                          opacity: 1,
                          visibility: 'visible'
                        },
                        '&:hover': {
                          color: 'text.primary',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <MoreVertical size={16} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
}