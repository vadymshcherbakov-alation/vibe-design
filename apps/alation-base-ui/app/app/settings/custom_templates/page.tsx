'use client';

import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Button, Card, CardContent, Avatar, Link, TextField, Chip } from "@mui/material";
import { Plus, ArrowRight, FileInput, FolderOpen, ArrowLeft, Search, Table, Database, FileText, Layers, Grid, Folder, Settings, Pencil, Scroll, LibraryBig, File } from "lucide-react";
import { TableIcon } from "../../../components/icons";
import { useRouter } from "next/navigation";

// Template categories data with sections
const TEMPLATE_SECTIONS = [
  {
    id: "dob",
    label: "Data Objects",
    bounded: true, // Single template per object type
    sections: [
      {
        title: "Relational Data",
        items: [
          { id: "datasource", label: "Data Source", description: "Catalog pages" },
          { id: "schema", label: "Schema", description: "Catalog pages" },
          { id: "table", label: "Table", description: "Catalog pages" },
          { id: "column", label: "Column", description: "Catalog pages" },
        ]
      },
      {
        title: "NoSQL",
        items: [
          { id: "nosql-database", label: "NoSQL Database", description: "Catalog pages" },
          { id: "nosql-collection", label: "NoSQL Collection", description: "Catalog pages" },
          { id: "nosql-attribute", label: "NoSQL Attribute", description: "Catalog pages" },
        ]
      },
      {
        title: "API",
        items: [
          { id: "api-resource", label: "API Resource", description: "Catalog pages" },
          { id: "api-resource-folder", label: "API Folder", description: "Catalog pages" },
          { id: "api-field", label: "API Field", description: "Catalog pages" },
        ]
      },
      {
        title: "BI",
        items: [
          { id: "bi-server", label: "BI Server", description: "Catalog pages" },
          { id: "bi-folder", label: "BI Folder", description: "Catalog pages" },
          { id: "bi-report", label: "BI Report", description: "Catalog pages" },
          { id: "bi-datasource", label: "BI Data Source", description: "Catalog pages" },
          { id: "bi-report-column", label: "BI Report Column", description: "Catalog pages" },
          { id: "bi-datasource-column", label: "BI Data Source Column", description: "Catalog pages" },
        ]
      },
      {
        title: "File System",
        items: [
          { id: "file-system", label: "File System", description: "Catalog pages" },
          { id: "directory", label: "Directory", description: "Catalog pages" },
          { id: "file", label: "File", description: "Catalog pages" },
        ]
      },
      {
        title: "Other",
        items: [
          { id: "domain", label: "Domain", description: "Catalog pages" },
          { id: "dataflow", label: "Dataflow", description: "Catalog pages" },
        ]
      }
    ]
  },
  {
    id: "cat",
    label: "Custom Asset Types",
    bounded: false, // Can create multiple templates
    sections: [
      {
        title: "Custom Types",
        items: [
          { id: "custom-fields", label: "Custom Fields", description: "Catalog pages" },
              { id: "data-policy", label: "Data Policy", description: "Catalog pages" },
          { id: "composite-data-model", label: "Composite Data Model", description: "Catalog pages" },
          { id: "composite-data-schema", label: "Composite Data Schema", description: "Catalog pages" },
          { id: "custom-query-resource", label: "Custom Query Resource", description: "Catalog pages" },
          { id: "data-store-api", label: "Data Store API", description: "Catalog pages" },
          { id: "data-store-api-endpoint", label: "Data Store API Endpoint", description: "Catalog pages" },
          { id: "data-store-api-resource", label: "Data Store API Resource", description: "Catalog pages" },
          { id: "data-store-api-source", label: "Data Store API Source", description: "Catalog pages" },
          { id: "feature-code", label: "Feature Code", description: "Catalog pages" },
          { id: "feature-fact", label: "Feature Fact", description: "Catalog pages" },
          { id: "feature-cube", label: "Feature Cube", description: "Catalog pages" },
          { id: "mlstructure-source", label: "MLStructure Source", description: "Catalog pages" },
          { id: "mlstructure-model", label: "MLStructure Model", description: "Catalog pages" },
          { id: "power-bi-column", label: "Power BI Column", description: "Catalog pages" },
          { id: "power-bi-dashboard", label: "Power BI Dashboard", description: "Catalog pages" },
          { id: "power-bi-dataset", label: "Power BI Dataset", description: "Catalog pages" },
          { id: "power-bi-folder", label: "Power BI Folder", description: "Catalog pages" },
          { id: "power-bi-report", label: "Power BI Report", description: "Catalog pages" },
          { id: "power-bi-source", label: "Power BI Source", description: "Catalog pages" },
          { id: "power-bi-table", label: "Power BI Table", description: "Catalog pages" },
          { id: "power-bi-tile", label: "Power BI Tile", description: "Catalog pages" }
        ]
      }
    ]
  },
  {
    id: "doc",
    label: "Document Hubs",
    isHubs: true,
    bounded: false, // Can create multiple hubs
    sections: []
  },
  {
    id: "policy",
    label: "Policy Templates",
    bounded: false, // Can create multiple templates
    sections: [
      {
        title: "Policy Templates",
        items: [
          { id: "policy-template", label: "Policy Template", description: "Catalog pages" },
          { id: "policy-threat-1", label: "Policy Threat 1", description: "Catalog pages" },
          { id: "data-flow", label: "Data Flow", description: "Catalog pages" },
          { id: "data-pipeline", label: "Data Pipeline", description: "Catalog pages" },
          { id: "html-content-107", label: "HTML Content 107", description: "Catalog pages" },
          { id: "html-content-108", label: "HTML Content 108", description: "Catalog pages" },
          { id: "policy-template-7842", label: "Policy Template (7842)", description: "Catalog pages" },
          { id: "policy-template-7843", label: "Policy Template (7843)", description: "Catalog pages" },
          { id: "policy-template-7844", label: "Policy Template (7844)", description: "Catalog pages" },
          { id: "policy-template-7845", label: "Policy Template (7845)", description: "Catalog pages" },
          { id: "policy-template-7846", label: "Policy Template (7846)", description: "Catalog pages" },
          { id: "policy-template-7847", label: "Policy Template (7847)", description: "Catalog pages" },
          { id: "policy-template-7848", label: "Policy Template (7848)", description: "Catalog pages" },
          { id: "policy-template-7849", label: "Policy Template (7849)", description: "Catalog pages" },
          { id: "policy-template-7850", label: "Policy Template (7850)", description: "Catalog pages" },
          { id: "policy-template-7851", label: "Policy Template (7851)", description: "Catalog pages" },
          { id: "policy-template-7852", label: "Policy Template (7852)", description: "Catalog pages" },
          { id: "policy-template-7853", label: "Policy Template (7853)", description: "Catalog pages" },
          { id: "policy-template-7854", label: "Policy Template (7854)", description: "Catalog pages" },
          { id: "policy-template-7855", label: "Policy Template (7855)", description: "Catalog pages" }
        ]
      }
    ]
  }
];

const INITIAL_HUBS = [
  {
    id: 'glossaries',
    name: 'Glossaries',
    folderTemplates: 1,
    docTemplates: 1
  },
  {
    id: 'sap-automation',
    name: 'SAP Automation',
    folderTemplates: 1,
    docTemplates: 2
  },
  {
    id: 'test-detailed-workflow',
    name: 'Test Detailed for Workflow Enhancements',
    folderTemplates: 1,
    docTemplates: 1
  },
  {
    id: 'performance-hub-2',
    name: 'Performance hub 2',
    folderTemplates: 1,
    docTemplates: 1
  },
  {
    id: 'performance-hub-3',
    name: 'Performance hub 3',
    folderTemplates: 1,
    docTemplates: 1
  },
  {
    id: 'performance-hub-4',
    name: 'Performance hub 4',
    folderTemplates: 1,
    docTemplates: 1
  },
  {
    id: 'performance-hub-5',
    name: 'Performance hub 5',
    folderTemplates: 1,
    docTemplates: 1
  },
  {
    id: 'performance-hub-6',
    name: 'Performance hub 6',
    folderTemplates: 1,
    docTemplates: 1
  }
];

// Icon mapping for template types (Neo icons + Lucide placeholders)
const getTemplateIcon = (templateId: string, theme: any) => {
  const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
    'table': TableIcon, // Using Neo icon
    'column': Layers, // TODO: Replace with AttrIcon
    'schema': Grid, // TODO: Replace with SchemaIcon
    'datasource': Database, // TODO: Replace with DatabaseIcon
    'nosql-database': Database, // TODO: Replace with NoSqlCollectionsIcon
    'nosql-collection': Folder, // TODO: Replace with NoSqlCollectionIcon
    'nosql-attribute': FileText, // TODO: Replace with NoSqlAttributeIcon
    'api-resource': Settings, // TODO: Replace with SwitchLeftRightIcon
    'api-resource-folder': Folder, // TODO: Replace with ApiFolderIcon
  };

  // Policy templates use Scroll icon
  if (templateId.startsWith('policy-') || templateId === 'data-flow' || templateId === 'data-pipeline' || templateId.startsWith('html-content-')) {
    return <Scroll size={14} />;
  }

  const IconComponent = iconMap[templateId];
  return IconComponent ? <IconComponent size={14} /> : <FileInput size={14} />;
};

const renderListTemplateItem = (item: any, handleSelectTemplate: (id: string) => void, theme: any) => {
  // Mock data for table templates count - this would come from API in real implementation
  const tableTemplateCount = item.id === 'table' ? 12 : 0;
  const hasMultipleTemplates = item.id === 'table'; // This would be feature flag + item type check

  return (
  <Box
    key={item.id}
    onClick={() => handleSelectTemplate(item.id)}
    sx={{
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      py: 0.75,
      px: 1,
      borderRadius: 0.5,
      transition: 'all 0.15s',
      position: 'relative',
      '&:hover': {
        backgroundColor: 'grey.50',
        '& .edit-icon': {
          opacity: 1,
          visibility: 'visible'
        }
      }
    }}
  >
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: 0.5,
        bgcolor: '#ECF6FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <Box sx={{
        color: '#0073DD',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0
      }}>
        {getTemplateIcon(item.id, theme)}
      </Box>
    </Box>
    <Box sx={{ flex: 1, minWidth: 0, pr: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: 13,
          fontWeight: 400,
          lineHeight: 1.54,
          color: 'text.primary',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {item.label}
      </Typography>

      {/* Template count chip for multi-template items */}
      {hasMultipleTemplates && tableTemplateCount > 0 && (
        <Chip
          label={tableTemplateCount}
          size="small"
          sx={{
            height: '18px',
            fontSize: '11px',
            fontWeight: 500,
            bgcolor: 'grey.100',
            color: 'text.secondary',
            '& .MuiChip-label': {
              px: 0.75
            }
          }}
        />
      )}
    </Box>

    {/* Edit/Navigate Icon - appears on hover */}
    <Box
      className="edit-icon"
      sx={{
        opacity: 0,
        visibility: 'hidden',
        transition: 'all 0.15s',
        position: 'absolute',
        right: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary'
      }}
    >
      {hasMultipleTemplates ? (
        <ArrowRight size={14} />
      ) : (
        <Pencil size={14} />
      )}
    </Box>
  </Box>
  );
};

const renderListHubItem = (hub: any, theme: any, handleSelectHub: (id: string) => void) => (
  <Box
    key={hub.id}
    onClick={() => handleSelectHub(hub.id)}
    sx={{
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      py: 0.75,
      px: 1,
      borderRadius: 0.5,
      transition: 'all 0.15s',
      position: 'relative',
      '&:hover': {
        backgroundColor: 'grey.50',
        '& .edit-icon': {
          opacity: 1,
          visibility: 'visible'
        }
      }
    }}
  >
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: 0.5,
        bgcolor: '#ECF6FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <Box sx={{
        color: '#0073DD',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0
      }}>
        <LibraryBig size={14} />
      </Box>
    </Box>
    <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: 13,
          fontWeight: 400,
          lineHeight: 1.54,
          color: 'text.primary',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {hub.name}
      </Typography>
    </Box>

    {/* Edit Icon - appears on hover */}
    <Box
      className="edit-icon"
      sx={{
        opacity: 0,
        visibility: 'hidden',
        transition: 'all 0.15s',
        position: 'absolute',
        right: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary'
      }}
    >
      <Pencil size={14} />
    </Box>
  </Box>
);

const renderFullWidthSection = (section: any, theme: any, handleCreateHub: () => void, handleCreateTemplate: () => void, handleSelectTemplate: (id: string) => void, handleSelectHub: (id: string) => void, searchQuery: string) => (
  <Box key={section.title} sx={{ mb: 4 }}>
    {/* Section Header with Divider and Create Button */}
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: `${18}px`,
            fontWeight: 600,
            lineHeight: 1.21,
            color: 'text.primary'
          }}
        >
          {section.title}
        </Typography>

        {/* Create Button */}
        {(section.isHubs || section.categoryId === 'policy') && (
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            startIcon={<Plus size={16} />}
            onClick={section.isHubs ? handleCreateHub : handleCreateTemplate}
            sx={{
              textTransform: 'inherit',
              fontWeight: 500
            }}
          >
            {section.isHubs ? 'Create New Hub' : 'Create New Template'}
          </Button>
        )}
      </Box>

      {/* Divider */}
      <Box
        sx={{
          height: '1px',
          backgroundColor: 'divider',
          width: '100%'
        }}
      />
    </Box>

    {/* Section Items Grid */}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 0.5
      }}
    >
      {section.isHubs ? (
        section.items.map((hub: any) => renderListHubItem(hub, theme, handleSelectHub))
      ) : (
        section.items.map((item: any) => renderListTemplateItem(item, handleSelectTemplate, theme))
      )}
    </Box>
  </Box>
);

const renderSectionBox = (section: any, theme: any, handleCreateHub: () => void, handleSelectTemplate: (id: string) => void, handleSelectHub: (id: string) => void, searchQuery: string) => (
  <Box
    key={section.title}
    sx={{
      border: '1px solid',
      borderColor: 'grey.200',
      borderRadius: 2,
      overflow: 'hidden',
      backgroundColor: 'white',
      height: '100%', // Stretch to fill available grid cell height
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    {/* Section Header */}
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'grey.100',
        backgroundColor: 'grey.50'
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontSize: `${14}px`,
          fontWeight: 600, // Keep existing weight instead of 500 (500)
          lineHeight: 1.21,
          color: 'text.primary'
        }}
      >
        {section.title}
      </Typography>
    </Box>

    {/* Section Items */}
    <Box sx={{ p: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
      {section.isHubs ? (
        section.items.map((hub: any) => renderListHubItem(hub, theme, handleSelectHub))
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {section.items.map((item: any) => renderListTemplateItem(item, handleSelectTemplate, theme))}
        </Box>
      )}
    </Box>
  </Box>
);

export default function CustomTemplatesPage() {
  const theme = useTheme();
  const router = useRouter();
  const [hubs] = useState(INITIAL_HUBS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateHub = () => {
    router.push('/app/settings/custom_templates/document_hubs/new');
  };

  const handleCreateTemplate = () => {
    // Policy template creation logic will go here
    console.log('Create new policy template');
  };

  const handleSelectTemplate = (templateId: string) => {
    // For template types that support multiple templates, go to listing page first
    if (templateId === 'table') {
      router.push(`/app/settings/custom_templates/table/templates`);
    } else {
      // For all other template types, go directly to template editor
      router.push(`/app/settings/custom_templates/${templateId}`);
    }
  };

  const handleSelectHub = (hubId: string) => {
    router.push(`/app/settings/custom_templates/document_hubs/${hubId}`);
  };

  const getBoundedSections = () => {
    // Return bounded sections (finite template types) as compact boxes
    const boundedSectionBoxes: any[] = [];

    TEMPLATE_SECTIONS.forEach(category => {
      if (category.bounded === true && category.sections) {
        category.sections.forEach(section => {
          const filteredItems = section.items.filter(item =>
            !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filteredItems.length > 0) {
            boundedSectionBoxes.push({
              ...section,
              items: filteredItems,
              isHubs: false,
              categoryTitle: category.label
            });
          }
        });
      }
    });

    return boundedSectionBoxes;
  };

  const getUnboundedSections = () => {
    // Return unbounded sections (can create multiple templates) as full-width sections
    const unboundedSections: any[] = [];

    TEMPLATE_SECTIONS.forEach(category => {
      if (category.bounded === false) {
        if (category.isHubs) {
          const filteredHubs = hubs.filter(hub =>
            !searchQuery || hub.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filteredHubs.length > 0) {
            unboundedSections.push({
              title: category.label,
              items: filteredHubs,
              isHubs: true,
              categoryTitle: category.label,
              categoryId: category.id
            });
          }
        } else if (category.sections) {
          // For unbounded non-hub categories, combine all items from all sections
          const allItems: any[] = [];
          category.sections.forEach(section => {
            const filteredItems = section.items.filter(item =>
              !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            allItems.push(...filteredItems);
          });
          if (allItems.length > 0) {
            unboundedSections.push({
              title: category.label,
              items: allItems,
              isHubs: false,
              categoryTitle: category.label,
              categoryId: category.id
            });
          }
        }
      }
    });

    return unboundedSections;
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
                Custom Templates
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Single Column Content */}
      <Box sx={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <Box sx={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <Box sx={{ p: 3 }}>
            {/* Search */}
            <Box sx={{ mb: 3 }}>
              <TextField
                size="small"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search size={16} style={{ marginRight: 8, color: '#71767D' }} />
                }}
                sx={{ width: '100%', maxWidth: 400 }}
              />
            </Box>
            {/* Bounded Template Sections (Compact Boxes) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gridAutoRows: 'auto', // Let each row determine its own height
                gap: 2.5,
                alignItems: 'stretch', // Stretch all items to match the tallest in each row
                mb: getBoundedSections().length > 0 && getUnboundedSections().length > 0 ? 4 : 0
              }}
            >
              {getBoundedSections().map((section: any) =>
                renderSectionBox(section, theme, handleCreateHub, handleSelectTemplate, handleSelectHub, searchQuery)
              )}
            </Box>

            {/* Unbounded Template Sections (Full Width) */}
            <Box>
              {getUnboundedSections().map((section: any) =>
                renderFullWidthSection(section, theme, handleCreateHub, handleCreateTemplate, handleSelectTemplate, handleSelectHub, searchQuery)
              )}
            </Box>

            {getBoundedSections().length === 0 && getUnboundedSections().length === 0 && searchQuery && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: 1.54,
                    color: 'text.secondary'
                  }}
                >
                  No templates found matching &quot;{searchQuery}&quot;
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
