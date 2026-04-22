'use client';

import { useState } from "react";
import { Box, Typography, Button, IconButton, Chip, Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowLeft, Plus, Edit, Trash2, Database, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data sources with icons
const DATA_SOURCES = {
  'postgres-analytics': { name: 'Postgres Analytics', icon: '🐘', type: 'PostgreSQL' },
  'mysql-app': { name: 'MySQL Application DB', icon: '🐬', type: 'MySQL' },
  'snowflake-prod': { name: 'Snowflake Production', icon: '❄️', type: 'Snowflake' },
  'oracle-dev': { name: 'Oracle Development', icon: '🔶', type: 'Oracle' },
  'bigquery-analytics': { name: 'BigQuery Analytics', icon: '🔍', type: 'BigQuery' },
  'redshift-warehouse': { name: 'Redshift Data Warehouse', icon: '📊', type: 'Redshift' }
};

// Mock data for table templates - this would come from API
const TABLE_TEMPLATES = [
  {
    id: 'default',
    title: 'Default Template',
    dataSources: [],
    isAllSources: true,
    canEdit: true,
    canDelete: false
  },
  {
    id: 'my-config',
    title: 'My Config',
    dataSources: ['postgres-analytics', 'mysql-app'],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'propagation-template',
    title: 'Propagation Template',
    dataSources: ['snowflake-prod'],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'table-test',
    title: 'Table test',
    dataSources: ['oracle-dev'],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'template-capibara',
    title: 'template capibara',
    dataSources: ['bigquery-analytics'],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'visual-config-1',
    title: 'Visual Config 1742983751376',
    dataSources: ['redshift-warehouse'],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'visual-config-2',
    title: 'Visual Config 1742987552140',
    dataSources: [],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'visual-config-3',
    title: 'Visual Config 1742987552317',
    dataSources: [],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'visual-config-4',
    title: 'Visual Config 1742987668337',
    dataSources: [],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'visual-config-5',
    title: 'Visual Config 1742987668796',
    dataSources: [],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'visual-config-6',
    title: 'Visual Config 1742989746417',
    dataSources: [],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  },
  {
    id: 'visual-config-7',
    title: 'Visual Config 1742989746435',
    dataSources: [],
    isAllSources: false,
    canEdit: true,
    canDelete: true
  }
];

export default function TableTemplatesPage() {
  const router = useRouter();
  const theme = useTheme();
  const [templates] = useState(TABLE_TEMPLATES);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTemplateId, setMenuTemplateId] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/app/settings/custom_templates');
  };

  const handleNewTemplate = () => {
    // Navigate to create new template
    router.push('/app/settings/custom_templates/table/new');
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/app/settings/custom_templates/table/${templateId}`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    // Delete logic would go here
    console.log('Delete template:', templateId);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, templateId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuTemplateId(templateId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
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
              onClick={handleBack}
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

            <Typography variant="h1">
              Table Templates
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={handleNewTemplate}
            sx={{
              fontWeight: 500,
              textTransform: 'none'
            }}
          >
            New Template
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {/* Table */}
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
                  Template Title
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
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: 1.54,
                        color: 'text.primary'
                      }}
                    >
                      {template.title}
                    </Typography>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid',
                    borderBottomColor: theme.palette.neutral[300],
                    fontSize: 13,
                    height: '56px'
                  }}>
                    {template.isAllSources ? (
                      <Chip
                        label="All Tables (fallback)"
                        variant="outlined"
                        sx={{
                          borderColor: 'grey.300',
                          color: 'text.secondary',
                          fontWeight: 500,
                          height: '28px',
                          fontSize: '13px'
                        }}
                      />
                    ) : template.dataSources.length > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        {template.dataSources.map((sourceId) => {
                          const source = DATA_SOURCES[sourceId as keyof typeof DATA_SOURCES];
                          if (!source) return null;

                          return (
                            <Chip
                              key={sourceId}
                              variant="outlined"
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <span style={{ fontSize: '14px' }}>{source.icon}</span>
                                  {source.name}
                                </Box>
                              }
                              sx={{
                                borderColor: 'grey.300',
                                color: 'text.secondary',
                                fontWeight: 500,
                                height: '28px',
                                fontSize: '13px',
                                '& .MuiChip-label': {
                                  px: 1.5
                                }
                              }}
                            />
                          );
                        })}
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          fontStyle: 'italic'
                        }}
                      >
                        None
                      </Typography>
                    )}
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
                      onClick={(e) => handleMenuClick(e, template.id)}
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

        {/* Template Actions Menu */}
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
              if (menuTemplateId) {
                handleEditTemplate(menuTemplateId);
                handleMenuClose();
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
                  handleMenuClose();
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
  );
}