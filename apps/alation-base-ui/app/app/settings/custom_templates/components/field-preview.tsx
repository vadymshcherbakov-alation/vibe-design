'use client';

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Plus, X, User, BarChart3, Edit } from "lucide-react";

interface FieldPreviewProps {
  selectedFieldType: any;
  fieldFormData: {
    name: string;
    namePlural: string;
    backrefName: string;
    options: string[];
  };
}

export const FieldPreview = ({ selectedFieldType, fieldFormData }: FieldPreviewProps) => {
  const theme = useTheme();

  const getDefaultFieldName = (isPlural = false) => {
    if (fieldFormData.name) {
      return isPlural && fieldFormData.namePlural ? fieldFormData.namePlural : fieldFormData.name;
    }
    if (selectedFieldType?.id === 'object-set') {
      return isPlural ? 'Related Tables' : 'Related Table';
    }
    if (selectedFieldType?.id === 'people-set') {
      return isPlural ? 'Data Stewards' : 'Data Steward';
    }
    return selectedFieldType?.label || 'Field Name';
  };

  if (selectedFieldType?.id === 'object-set') {
    const fieldName = getDefaultFieldName(true); // Use plural for multiple items
    const backrefName = fieldFormData.backrefName || 'Referenced By';
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Target page view */}
        <Box>
          <Typography variant="overline" sx={{ fontSize: 10, color: 'text.secondary', mb: 1, display: 'block' }}>
            On Target Page (Table)
          </Typography>
          <Box sx={{
            backgroundColor: "#ffffff",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: '8px',
            p: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {fieldName}
              </Typography>
              <Plus size={16} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                <BarChart3 size={12} />
                <Typography variant="body2">Customer Orders Table</Typography>
                <X size={12} style={{ marginLeft: 'auto' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                <BarChart3 size={12} />
                <Typography variant="body2">Product Catalog Schema</Typography>
                <X size={12} style={{ marginLeft: 'auto' }} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Source/Referenced page view */}
        <Box>
          <Typography variant="overline" sx={{ fontSize: 10, color: 'text.secondary', mb: 1, display: 'block' }}>
            On Referenced Pages (Tables/Schemas)
          </Typography>
          <Box sx={{
            backgroundColor: "#ffffff",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: '8px',
            p: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {backrefName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, backgroundColor: theme.palette.neutral[50], borderRadius: 1 }}>
              <BarChart3 size={14} />
              <Typography variant="body2">Sales Report Table</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (selectedFieldType?.id === 'people-set') {
    const fieldName = getDefaultFieldName(true); // Use plural for multiple items
    const backrefName = fieldFormData.backrefName || 'Assigned Tables';
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Target page view */}
        <Box>
          <Typography variant="overline" sx={{ fontSize: 10, color: 'text.secondary', mb: 1, display: 'block' }}>
            On Target Page (Table)
          </Typography>
          <Box sx={{
            backgroundColor: "#ffffff",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: '8px',
            p: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {fieldName}
              </Typography>
              <Plus size={16} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                <User size={12} />
                <Typography variant="body2">John Doe</Typography>
                <X size={12} style={{ marginLeft: 'auto' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                <User size={12} />
                <Typography variant="body2">Jane Doe</Typography>
                <X size={12} style={{ marginLeft: 'auto' }} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Source/Referenced page view */}
        <Box>
          <Typography variant="overline" sx={{ fontSize: 10, color: 'text.secondary', mb: 1, display: 'block' }}>
            On People's Profile Pages
          </Typography>
          <Box sx={{
            backgroundColor: "#ffffff",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: '8px',
            p: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {backrefName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, backgroundColor: theme.palette.neutral[50], borderRadius: 1 }}>
              <BarChart3 size={14} />
              <Typography variant="body2">Customer Orders Table</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (selectedFieldType?.id === 'object-reference') {
    const fieldName = getDefaultFieldName(false); // Use singular for single reference
    const backrefName = fieldFormData.backrefName || 'Referenced By';
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Target page view */}
        <Box>
          <Typography variant="overline" sx={{ fontSize: 10, color: 'text.secondary', mb: 1, display: 'block' }}>
            On Target Page (Table)
          </Typography>
          <Box sx={{
            backgroundColor: "#ffffff",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: '8px',
            p: 2
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              {fieldName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, backgroundColor: theme.palette.neutral[50], borderRadius: 1 }}>
              <BarChart3 size={14} />
              <Typography variant="body2">Customer Orders Table</Typography>
            </Box>
          </Box>
        </Box>

        {/* Source/Referenced page view */}
        <Box>
          <Typography variant="overline" sx={{ fontSize: 10, color: 'text.secondary', mb: 1, display: 'block' }}>
            On Referenced Page (Customer Orders Table)
          </Typography>
          <Box sx={{
            backgroundColor: "#ffffff",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: '8px',
            p: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {backrefName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, backgroundColor: theme.palette.neutral[50], borderRadius: 1 }}>
              <BarChart3 size={14} />
              <Typography variant="body2">Sales Report Table</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (selectedFieldType?.id === 'multi-select-picker') {
    const fieldName = getDefaultFieldName(true); // Use plural for multiple options
    return (
      <Box sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: '8px',
        p: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {fieldName}
          </Typography>
          <Edit size={16} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {fieldFormData.options.length > 0 ? (
            fieldFormData.options.slice(0, 4).map((option, index) => (
              <Typography key={index} variant="body2" sx={{ py: 0.25 }}>
                {option}
              </Typography>
            ))
          ) : (
            <>
              <Typography variant="body2" sx={{ py: 0.25 }}>High Priority</Typography>
              <Typography variant="body2" sx={{ py: 0.25 }}>Medium Priority</Typography>
              <Typography variant="body2" sx={{ py: 0.25 }}>Low Priority</Typography>
            </>
          )}
        </Box>
      </Box>
    );
  }

  if (selectedFieldType?.id === 'picker') {
    const fieldName = getDefaultFieldName(false); // Use singular for single selection
    return (
      <Box sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: '8px',
        p: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {fieldName}
          </Typography>
          <Edit size={16} />
        </Box>
        <Box sx={{ py: 1, px: 1.5, backgroundColor: theme.palette.neutral[50], borderRadius: 1 }}>
          <Typography variant="body2">
            {fieldFormData.options.length > 0 ? fieldFormData.options[0] : 'High Priority'}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (selectedFieldType?.id === 'rich-text') {
    const fieldName = getDefaultFieldName(false); // Use singular for single content
    return (
      <Box sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: '8px',
        p: 2
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          {fieldName}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          This dataset contains <strong>customer information</strong> including <em>purchase history</em> and <a href="#" style={{ textDecoration: 'none', color: theme.palette.info.main }}>contact details</a>.
        </Typography>
      </Box>
    );
  }

  if (selectedFieldType?.id === 'date') {
    const fieldName = getDefaultFieldName(false); // Use singular for single date
    return (
      <Box sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: '8px',
        p: 2
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          {fieldName}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          January 15, 2025
        </Typography>
      </Box>
    );
  }

  // Default preview for any unhandled field types
  return (
    <Box sx={{
      p: 3,
      backgroundColor: "#ffffff",
      borderRadius: '8px',
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px dashed ${theme.palette.neutral[300]}`
    }}>
      <Typography variant="body2" sx={{
        color: theme.palette.text.secondary,
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Field preview will appear here
      </Typography>
    </Box>
  );
};