'use client';

import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { ArrowLeft, Edit, Check, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { TemplateCanvas } from '../../../../components/template-canvas';
import { FieldsPanel } from '../../../../components/fields-panel';
import { CollapsiblePanel } from '../../../../components/collapsible-panel';

export default function DocumentTemplateEditorPage() {
  const router = useRouter();
  const params = useParams();
  const hubId = params.hubId as string;
  const templateId = params.templateId as string;

  const [isDirty, setIsDirty] = useState(false);
  const [hubName, setHubName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [fieldsPanelOpen, setFieldsPanelOpen] = useState(true);
  const [addZone, setAddZone] = useState<'main' | 'side'>('main');
  const [mode, setMode] = useState<'build' | 'preview'>('build');

  // Default template fields
  const [template, setTemplate] = useState({
    main: [
      { id: "f1", label: "Description", ftype: "Rich text" }
    ],
    side: [
      { id: "f2", label: "Domains", ftype: "Multi-picker" },
      { id: "f3", label: "Stewards", ftype: "People set" },
      { id: "f4", label: "Tags", ftype: "Multi-picker" },
      { id: "f5", label: "References", ftype: "Reference link" }
    ]
  });

  // Get used field labels for the FieldsPanel
  const getUsedLabels = () => {
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

  const handleAddField = (field: any) => {
    const newField = {
      ...field,
      id: `f${Date.now()}` // Simple ID generation
    };

    setTemplate(prev => ({
      ...prev,
      [addZone]: [...prev[addZone], newField]
    }));
    setIsDirty(true);
  };

  const handleAddZoneChange = (zone: 'main' | 'side') => {
    setAddZone(zone);
  };

  const handleAddFieldToCanvas = (field: any) => {
    handleAddField(field);
  };

  const handleTemplateChange = (newTemplate: any) => {
    setTemplate(newTemplate);
    setIsDirty(true);
  };

  const handleCreateGroup = (zone: 'main' | 'side', type: 'empty' | 'from-fields', fields?: any[]) => {
    const newGroup = {
      id: `g${Date.now()}`,
      group: true,
      label: type === 'empty' ? 'New Group' : 'Field Group',
      fields: fields || [],
      expandedByDefault: true
    };

    setTemplate(prev => ({
      ...prev,
      [zone]: [...prev[zone], newGroup]
    }));
    setIsDirty(true);
  };

  // Mock data - would come from API
  useEffect(() => {
    // Get hub name for breadcrumb
    if (hubId === 'glossaries') {
      setHubName('Glossaries');
    } else if (hubId.includes('document-hub-')) {
      setHubName('New Document Hub');
    } else {
      setHubName(hubId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    }

    // Initialize template name
    let initialName = '';
    if (templateId === 'folder-template') {
      initialName = 'Folder';
    } else if (templateId === 'default-document') {
      initialName = 'Document';
    } else if (templateId.includes('document-template-')) {
      initialName = 'New Document Template';
    } else {
      initialName = templateId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    setTemplateName(initialName);
  }, [hubId, templateId]);

  const handleBackToHub = () => {
    if (isDirty) {
      // Could show confirmation dialog here
    }
    router.push(`/app/settings/custom_templates/document_hubs/${hubId}`);
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


  const getTemplateType = () => {
    if (templateId === 'folder-template') return 'folder';
    return 'document';
  };

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
              onClick={handleBackToHub}
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
              {hubName}
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
          onToggle={() => setFieldsPanelOpen(!fieldsPanelOpen)}
          defaultWidth={280}
          minWidth={240}
          maxWidth={400}
          toggleButtonTop="56px"
        >
          <FieldsPanel
            addZone={addZone}
            onAddZoneChange={handleAddZoneChange}
            onAddField={handleAddFieldToCanvas}
            usedLabels={getUsedLabels()}
            onCreateNewField={() => {}}
          />
        </CollapsiblePanel>

        <Box sx={{ minWidth: 0, height: '100%', overflow: 'hidden' }}>
          <TemplateCanvas
            template={template as any}
            onTemplateChange={handleTemplateChange}
            addZone={addZone}
            onAddZoneChange={handleAddZoneChange}
            mode={mode}
            onModeChange={setMode}
            onCreateGroup={handleCreateGroup}
            fieldsPanelOpen={fieldsPanelOpen}
            onAddField={handleAddField}
          />
        </Box>
      </Box>
    </Box>
  );
}