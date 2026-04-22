import { Box } from "@mui/material";
import { Braces, Users, Link as LinkIcon, CheckSquare, CopyCheck, Type, Calendar, BadgeCheck } from "lucide-react";

export interface FieldDefinition {
  id: string;
  label: string;
  ftype: string;
  zones?: ('main' | 'side')[];
}

export const FIELD_TYPE_COLORS = {
  "Rich text": "#488800",
  "Text": "#0073DD",
  "Picker": "#7C3AED",
  "Multi-picker": "#0891B2",
  "People set": "#AC6000",
  "Object set": "#EA580C",
  "Reference link": "#CA334A",
  "Date": "#0073DD",
  "Score": "#0073DD",
  "Checkbox": "#0073DD",
  "Table": "#71767D",
  "Code": "#71767D"
};

export const FIELD_TYPE_ICONS = {
  "Rich text": <Type size={16} />,
  "Text": <Type size={16} />,
  "Picker": <CheckSquare size={16} />,
  "Multi-picker": <CopyCheck size={16} />,
  "People set": <Users size={16} />,
  "Object set": <Braces size={16} />,
  "Reference link": <LinkIcon size={16} />,
  "Date": <Calendar size={16} />,
  "Score": <BadgeCheck size={16} />,
  "Checkbox": <CheckSquare size={16} />,
  "Table": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.3" y="1.3" width="13.4" height="13.4" rx="1.3"/>
      <line x1="1.3" y1="6" x2="14.7" y2="6"/>
      <line x1="6.7" y1="6" x2="6.7" y2="14.7"/>
    </svg>
  ),
  "Code": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="4.7,5.3 1.3,8 4.7,10.7"/>
      <polyline points="11.3,5.3 14.7,8 11.3,10.7"/>
      <line x1="8.7" y1="3.3" x2="7.3" y2="12.7"/>
    </svg>
  )
};

interface FieldTypeIconProps {
  ftype: string;
}

export const FieldTypeIcon: React.FC<FieldTypeIconProps> = ({ ftype }) => {
  const icon = (FIELD_TYPE_ICONS as any)[ftype] || FIELD_TYPE_ICONS["Text"];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0
      }}
    >
      {icon}
    </Box>
  );
};

export const FIELD_GROUPS = [
  {
    id: 'builtin',
    label: 'Built-in',
    iconFtype: 'Table',
    color: '#0073DD',
    bg: '#ECF6FF',
    fields: [
      { id: "b1", label: "Description", ftype: "Rich text", zones: ["main", "side"] },
      { id: "b2", label: "Analytics Use Cases", ftype: "Rich text", zones: ["main", "side"] },
      { id: "b4", label: "Data Quality", ftype: "Score", zones: ["main", "side"] },
      { id: "b6", label: "Sample Columns", ftype: "Table", zones: ["main"] },
      { id: "b7", label: "Sample Content", ftype: "Table", zones: ["main"] },
      { id: "b8", label: "Published Queries", ftype: "Table", zones: ["main"] },
      { id: "b9", label: "Table Constraint", ftype: "Text", zones: ["main", "side"] },
      { id: "b10", label: "View SQL", ftype: "Code", zones: ["main"] },
      { id: "b12", label: "Sensitive", ftype: "Checkbox", zones: ["main", "side"] }
    ]
  },
  {
    id: 'richtext',
    label: 'Rich Text',
    iconFtype: 'Rich text',
    color: '#488800',
    bg: '#F0F8EB',
    fields: [
      { id: "rt1", label: "Business Definition", ftype: "Rich text", zones: ["main", "side"] },
      { id: "rt2", label: "Technical Notes", ftype: "Rich text", zones: ["main", "side"] },
      { id: "rt3", label: "Usage Guidelines", ftype: "Rich text", zones: ["main", "side"] }
    ]
  },
  {
    id: 'objectset',
    label: 'Object Set',
    iconFtype: 'Object set',
    color: '#EA580C',
    bg: '#FFF7ED',
    fields: [
      { id: "os1", label: "Referenced By", ftype: "Object set", zones: ["main", "side"] },
      { id: "os2", label: "Relevant Articles", ftype: "Object set", zones: ["main", "side"] },
      { id: "os3", label: "Related Tables", ftype: "Object set", zones: ["main", "side"] },
      { id: "os4", label: "Downstream Reports", ftype: "Object set", zones: ["main", "side"] }
    ]
  },
  {
    id: 'picker',
    label: 'Picker',
    iconFtype: 'Picker',
    color: '#7C3AED',
    bg: '#F5F3FF',
    fields: [
      { id: "p1", label: "Data Domain", ftype: "Picker", zones: ["main", "side"] },
      { id: "p2", label: "Sensitivity Level", ftype: "Picker", zones: ["main", "side"] },
      { id: "p3", label: "Lifecycle Stage", ftype: "Picker", zones: ["main", "side"] }
    ]
  },
  {
    id: 'multipicker',
    label: 'Multi-picker',
    iconFtype: 'Multi-picker',
    color: '#0891B2',
    bg: '#ECFEFF',
    fields: [
      { id: "mp1", label: "Tags", ftype: "Multi-picker", zones: ["main", "side"] },
      { id: "mp2", label: "Data Classification", ftype: "Multi-picker", zones: ["main", "side"] },
      { id: "mp3", label: "Business Terms", ftype: "Multi-picker", zones: ["main", "side"] }
    ]
  },
  {
    id: 'peopleset',
    label: 'People Set',
    iconFtype: 'People set',
    color: '#AC6000',
    bg: '#FCF4E7',
    fields: [
      { id: "ps1", label: "Stewards", ftype: "People set", zones: ["main", "side"] },
      { id: "ps2", label: "Data Owners", ftype: "People set", zones: ["main", "side"] },
      { id: "ps3", label: "Subject Matter Experts", ftype: "People set", zones: ["main", "side"] }
    ]
  },
  {
    id: 'reflink',
    label: 'Reference Link',
    iconFtype: 'Reference link',
    color: '#CA334A',
    bg: '#FFF0F0',
    fields: [
      { id: "rl1", label: "Source System", ftype: "Reference link", zones: ["main", "side"] },
      { id: "rl2", label: "Documentation Link", ftype: "Reference link", zones: ["main", "side"] },
      { id: "rl3", label: "Confluence Page", ftype: "Reference link", zones: ["main", "side"] }
    ]
  }
];