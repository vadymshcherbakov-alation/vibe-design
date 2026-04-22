import {CSSObject, Theme} from '@mui/material/styles';

export function getFroalaStyleOverrides(t: Theme | {readonly theme: Theme}): CSSObject {
  let theme: Theme;
  if ('theme' in t) {
    theme = t.theme;
  } else {
    theme = t;
  }
  return {
    'body .fr-toolbar, body .fr-second-toolbar': {
      border: 'none',
      zIndex: 10,
    },
    'body .fr-toolbar .fr-btn-grp': {
      margin: 0,
    },
    'body .fr-box.fr-basic .fr-wrapper': {
      border: 'none',
    },
    'body .fr-box.fr-basic': {
      border: `1px solid ${theme.palette.grey[400]}`,
      borderRadius: theme.shape.borderRadius,
    },
    'body .fr-toolbar .fr-newline': {
      background: theme.palette.grey[400],
    },
    'body .fr-toolbar, body .fr-popup, body .fr-modal': {
      '.fr-command.fr-btn': {
        height: '2.4rem',
      },
      '.fr-command.fr-btn svg.fr-svg': {
        height: '1.8rem',
      },
      '.fr-command.fr-btn i, .fr-command.fr-btn svg': {
        margin: '0.2rem 0.1rem',
        height: '2rem',
      },
    },
    'body .fr-toolbar .fr-more-toolbar.fr-expanded': {
      backgroundColor: 'white',
      borderBottom: `0.1rem solid ${theme.palette.grey[400]}`,
      height: '3.2rem',
    },
    'body .fr-view a': {
      color: theme.palette.primary.main,
    },
    'body .fr-element.fr-view .untitled-object': {
      fontStyle: 'italic',
    },
    'body .fr-box.fr-basic .fr-element': {
      fontFamily: 'inherit',
    },
    'body .fr-separator.fr-vs': {
      height: '1.6rem',
    },
    '.fr-view': {
      code: {
        ...theme.typography.machineBody1,
        backgroundColor: theme.palette.grey[300],
        border: `0.1rem solid ${theme.palette.grey[500]}`,
        borderRadius: '0.3rem',
        padding: `${theme.spacing(0.2)} ${theme.spacing(0.4)}`,
        whiteSpace: 'noWrap',
      },
      'pre code': {
        backgroundColor: 'transparent',
        border: 0,
        padding: 0,
        whiteSpace: 'pre-wrap',
      },
      pre: {
        ...theme.typography.machineBody1,
        backgroundColor: theme.palette.grey[300],
        border: `0.1rem solid ${theme.palette.grey[500]}`,
        borderRadius: '0.4rem',
        marginBottom: theme.spacing(1.5),
        padding: theme.spacing(1),
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      },
      'table, th, td': {
        ...theme.typography.body1,
        border: 'none',
      },
      th: {
        background: 'none',
      },
      table: {
        width: '100%',
        tr: {
          '& td, & th': {
            padding: theme.spacing(1),
            borderRight: `0.1rem solid ${theme.palette.grey[400]}`,
            borderLeft: 'none',
            '&:last-child': {
              borderRight: 'none',
            },
          },
          '& th': {
            textAlign: 'left',
            fontWeight: 600,
            background: 'none',
          },
        },
        thead: {
          tr: {
            borderBottom: `0.1rem solid ${theme.palette.grey[600]}`,
          },
        },
        tbody: {
          tr: {
            borderBottom: `0.1rem solid ${theme.palette.grey[400]}`,
            '&:last-child': {
              borderBottom: 'none',
            },
            '&:nth-of-type(even)': {
              backgroundColor: theme.palette.grey[200],
            },
          },
        },
      },
      p: {
        ...theme.typography.body1,
        marginBottom: theme.spacing(1),
      },
      h1: {
        ...theme.typography.h1,
        marginBottom: theme.spacing(1),
      },
      h2: {
        ...theme.typography.h2,
        marginBottom: theme.spacing(1),
      },
      h3: {
        ...theme.typography.h3,
        marginBottom: theme.spacing(1),
      },
      h4: {
        ...theme.typography.h4,
        marginBottom: theme.spacing(1),
      },
    },
  };
}
