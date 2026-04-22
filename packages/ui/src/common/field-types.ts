// Shared field type definitions for create field modals
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