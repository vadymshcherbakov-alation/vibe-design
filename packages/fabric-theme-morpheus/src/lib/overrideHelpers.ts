import type {CSSObject, Theme} from '@mui/material/styles';

// eslint-disable-next-line functional/prefer-readonly-type
type CSSInterpolationFn = (args: {theme: Theme}) => CSSObject;

function isComponentOverrideFn(override: CSSObject | CSSInterpolationFn): override is CSSInterpolationFn {
  return typeof override === 'function';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extendComponentOverrides(subject: any, overrides: CSSObject, theme: Theme): CSSObject {
  const object = subject || {};
  if (typeof object !== 'function' && typeof object !== 'object') {
    throw new Error('extendComponentOverrides only works with objects or functions');
  }
  return {
    ...(isComponentOverrideFn(object) ? object({theme}) : object),
    ...overrides,
  };
}
