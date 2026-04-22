import {CssBaseline, ThemeProvider} from '@mui/material';
import {FC, PropsWithChildren} from 'react';

import {fabricThemeMorpheus} from '../index';

export const TestThemeProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <ThemeProvider theme={fabricThemeMorpheus}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
