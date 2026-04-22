import {CSSObject, Theme} from '@mui/material/styles';

import {grey} from './palettes/grey';

export const getLexicalEditorOverrides: (theme: Theme) => CSSObject = (theme) => ({
  '.lexical-ltr': {
    ...theme.typography.body1,
    textAlign: 'left',
    'h1&': {
      ...theme.typography.h1,
      marginBottom: theme.spacing(1),
    },
    'h2&': {
      ...theme.typography.h2,
      marginBottom: theme.spacing(1),
    },
    'h3&': {
      ...theme.typography.h3,
      marginBottom: theme.spacing(1),
    },
    'h4&': {
      ...theme.typography.h4,
      marginBottom: theme.spacing(1),
    },
    'h5&': {
      ...theme.typography.h5,
      marginBottom: theme.spacing(1),
    },
    'h6&': {
      ...theme.typography.h6,
      marginBottom: theme.spacing(1),
    },
  },

  '.lexical-rtl': {
    textAlign: 'right',
  },

  '.lexical-list-unordered, .lexical-list-ordered': {
    marginBottom: theme.spacing(1),
  },

  '.lexical-placeholder': {
    overflow: 'hidden',
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(2),
    userSelect: 'none',
    pointerEvents: 'none',
  },

  // Apply padding to content area regardless of editable state
  '.lexical-container [contenteditable]': {
    padding: theme.spacing(1, 2),
  },

  // Disabled state styling
  '.lexical-container [contenteditable="false"]': {
    color: grey[600],
    cursor: 'default',
  },

  '.lexical-paragraph': {
    marginBottom: theme.spacing(1),
  },
  '.lexical-text-strikethrough': {
    textDecoration: 'line-through',
  },
  '.lexical-text-underline': {
    textDecoration: 'underline',
  },
  '.lexical-text-bold': {
    fontWeight: 'bold',
  },
  '.lexical-text-italic': {
    fontStyle: 'italic',
  },
  '.lexical-text-underline-strikethrough': {
    textDecoration: 'line-through underline',
  },
  '.lexical-quote': {
    margin: theme.spacing(0, 2, 1, 2),
    paddingLeft: theme.spacing(2),
    borderLeft: `0.4rem solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.default,
  },
  '.lexical-code': {
    backgroundColor: theme.palette.background[theme.palette.mode === 'dark' ? 'lighten10' : 'darken10'],
    display: 'block',
    padding: theme.spacing(1, 1, 1, 6.5),
    ...theme.typography.machineBody0,
    margin: 0,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    tabSize: 2,
    /* white-space: pre, */
    overflowX: 'auto',
    position: 'relative',
    '&:before': {
      content: 'attr(data-gutter)',
      position: 'absolute',
      backgroundColor: theme.palette.background[theme.palette.mode === 'dark' ? 'lighten20' : 'darken20'],
      left: 0,
      top: 0,
      borderRight: `0.1rem solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      color: theme.palette.text.primary,
      whiteSpace: 'pre-wrap',
      textAlign: 'right',
      minWidth: '2.5rem',
    },
    '&:after': {
      content: 'attr(data-highlight-language)',
      top: 0,
      right: '0.3rem',
      padding: '0.3rem',
      textTransform: 'uppercase',
      position: 'absolute',
      color: theme.palette.text.primary,
      ...theme.typography.machineCaption,
    },
  },
});
