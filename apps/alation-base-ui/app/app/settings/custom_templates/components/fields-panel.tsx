import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Collapse, ToggleButton, ToggleButtonGroup, Accordion, AccordionSummary, AccordionDetails, Chip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Search, X, ChevronDown, ArrowRight, Plus } from 'lucide-react';
import { FIELD_GROUPS, FieldTypeIcon } from './field-types';

interface FieldsPanelProps {
  addZone: 'main' | 'side';
  onAddZoneChange: (zone: 'main' | 'side') => void;
  onAddField: (field: any) => void;
  usedLabels: Set<string>;
  onCreateNewField?: () => void;
  focusSearch?: boolean;
  selectedGroup?: { id: string; zone: 'main' | 'side'; label: string } | null;
}

export const FieldsPanel: React.FC<FieldsPanelProps> = ({
  addZone,
  onAddZoneChange,
  onAddField,
  usedLabels,
  onCreateNewField,
  focusSearch = false,
  selectedGroup
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroups, setOpenGroups] = useState({ builtin: true });
  const [highlightedFieldIndex, setHighlightedFieldIndex] = useState(0);
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when requested
  useEffect(() => {
    if (focusSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100); // Small delay to ensure the panel is fully rendered
    }
  }, [focusSearch]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({ ...prev, [groupId]: !(prev as any)[groupId] }));
  };

  const filteredGroups = FIELD_GROUPS.map(group => ({
    ...group,
    fields: group.fields.filter(field =>
      !usedLabels.has(field.label) &&
      (!searchQuery || field.label.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (field.zones ? field.zones.includes(addZone) : true) // Filter by zone compatibility
    )
  })).filter(group => group.fields.length > 0);

  // Create a flat list of all visible fields for keyboard navigation
  const allVisibleFields = filteredGroups.flatMap(group => group.fields);

  // Reset highlighted field when search changes
  React.useEffect(() => {
    setHighlightedFieldIndex(0);
    // Auto-enable keyboard navigation when there's a search query and results
    setIsKeyboardNavigating(searchQuery.length > 0 && allVisibleFields.length > 0);
  }, [searchQuery, addZone, allVisibleFields.length]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (allVisibleFields.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsKeyboardNavigating(true);
      setHighlightedFieldIndex(prev =>
        prev < allVisibleFields.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsKeyboardNavigating(true);
      setHighlightedFieldIndex(prev =>
        prev > 0 ? prev - 1 : allVisibleFields.length - 1
      );
    } else if (e.key === 'Enter' && allVisibleFields[highlightedFieldIndex]) {
      e.preventDefault();
      setIsKeyboardNavigating(false);
      onAddField(allVisibleFields[highlightedFieldIndex]);
    }
  };

  const handleFieldClick = (field: any) => {
    setIsKeyboardNavigating(false);
    onAddField(field);
  };

  const handleSearchBlur = () => {
    // Reset keyboard navigation when search loses focus
    setIsKeyboardNavigating(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0
      }}
    >
      {/* Fixed Header */}
      <Box sx={{
        p: '24px 24px 9px 24px',
        borderBottom: 1,
        borderColor: 'divider',
        flexShrink: 0,
        backgroundColor: 'background.paper'
      }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Add Fields
        </Typography>

        {/* Zone selector */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: 'text.secondary',
              letterSpacing: '0.05em',
              mb: 0.5,
              display: 'block'
            }}
          >
            Add fields to
          </Typography>
          <ToggleButtonGroup
            value={addZone}
            exclusive
            onChange={(_, val) => val && onAddZoneChange(val)}
            size="small"
            sx={{
              width: '100%',
              backgroundColor: theme.palette.neutral[100] || 'grey.100',
              borderRadius: '4px',
              p: '1px',
              '& .MuiToggleButtonGroup-grouped': {
                border: 'none',
                borderRadius: '3px',
                px: '8px',
                py: 0,
                height: '24px',
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'none',
                flex: 1,
                minWidth: 0,
                '&.Mui-selected': {
                  backgroundColor: "#ffffff",
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.1)',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: "#ffffff"
                  }
                },
                '&:not(.Mui-selected)': {
                  backgroundColor: 'transparent',
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.neutral[100]
                  }
                }
              }
            }}
          >
            <ToggleButton value="main">Main Body</ToggleButton>
            <ToggleButton value="side">Sidebar</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Search */}
        <TextField
          inputRef={searchInputRef}
          size="small"
          placeholder="Search fields…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onBlur={handleSearchBlur}
          variant="outlined"
          InputProps={{
            startAdornment: <Search size={16} style={{ marginRight: 8, color: '#71767D' }} />,
            endAdornment: searchQuery && (
              <Button
                size="small"
                onClick={() => setSearchQuery('')}
                sx={{
                  minWidth: 'auto',
                  p: 0,
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <X size={12} />
              </Button>
            ),
            sx: {
              fontSize: 13,
              color: 'text.primary'
            }
          }}
          sx={{ mb: 2, width: '100%' }}
        />
      </Box>

      {/* Scrollable Content Area */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        minHeight: 0
      }}>
        {filteredGroups.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'left' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? `No fields match "${searchQuery}"`
                : `All available ${addZone === 'main' ? 'main body' : 'sidebar'} fields have been added`}
            </Typography>
          </Box>
        )}

        {filteredGroups.map(group => (
          <Accordion
            key={group.id}
            expanded={(openGroups as any)[group.id] || !!searchQuery}
            onChange={() => !searchQuery && toggleGroup(group.id)}
            variant="outlined"
            sx={{
              boxShadow: 'none',
              '&:before': { display: 'none' },
              '&:not(:last-child)': { mb: 0 },
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              borderRadius: 0,
              borderTopRightRadius: group === filteredGroups[0] ? '6px' : 0,
              borderTopLeftRadius: group === filteredGroups[0] ? '6px' : 0
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown size={16} />}
              sx={{
                minHeight: 44,
                height: 44,
                pl: 3, // 24px left padding
                pr: 3, // 24px right padding
                '& .MuiAccordionSummary-content': {
                  margin: 0,
                  alignItems: 'center',
                  gap: 1.5
                },
                '& .MuiAccordionSummary-expandIconWrapper': {
                  ml: 0
                },
                '&:hover': {
                  backgroundColor: 'grey.50'
                }
              }}
            >
              <FieldTypeIcon ftype={group.iconFtype} />
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                {group.label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {group.fields.map(field => {
                const fieldIndex = allVisibleFields.findIndex(f => f.id === field.id);
                const isHighlighted = isKeyboardNavigating && fieldIndex === highlightedFieldIndex;
                return (
                <Button
                  key={field.id}
                  fullWidth
                  onClick={() => handleFieldClick(field)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 0.5, // 4px vertical padding - more compact
                    px: 3, // 24px horizontal padding
                    minHeight: 36, // More compact row height
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    borderRadius: 1,
                    transition: 'background-color 0.1s ease',
                    backgroundColor: isHighlighted ? 'primary.50' : 'transparent',
                    '&:hover': {
                      backgroundColor: isHighlighted ? 'primary.100' : 'grey.100',
                      '& .field-arrow': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {field.label}
                  </Typography>
                  <Box
                    className="field-arrow"
                    sx={{
                      opacity: 0,
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    <ArrowRight size={16} />
                  </Box>
                </Button>
                );
              })}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Fixed Create New Field Button */}
      {onCreateNewField && (
        <Box sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          flexShrink: 0,
          backgroundColor: 'background.paper'
        }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onCreateNewField}
            startIcon={<Plus size={16} />}
            sx={{
              textTransform: 'none',
              py: 1.5,
              color: 'text.primary',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'grey.50',
                borderColor: 'divider'
              }
            }}
          >
            Create New Field
          </Button>
        </Box>
      )}
    </Box>
  );
};