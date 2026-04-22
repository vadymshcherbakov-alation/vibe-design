import mix from 'mix-css-color';

import {fabricThemeMorpheus} from '../index';

import {blue} from './palettes/blue';
import {brand} from './palettes/brand';
import {green} from './palettes/green';
import {grey} from './palettes/grey';
import {red} from './palettes/red';
import {text, textShell} from './palettes/text';
import {yellow} from './palettes/yellow';

describe('color palette', () => {
  const {palette} = fabricThemeMorpheus;
  it('should have correct primary palette', () => {
    expect(palette.primary).toEqual({
      light: blue[100],
      main: blue[600],
      dark: blue[800],
      contrastText: textShell.primary,
    });
  });
  it('should have correct secondary palette', () => {
    expect(palette.secondary).toEqual({
      light: mix(brand.background, '#FFFFFF', 10).hex,
      main: blue[900],
      dark: brand.background,
      contrastText: '#fff',
    });
  });
  it('should have correct success palette', () => {
    expect(palette.success).toEqual({
      light: green[100],
      main: green[600],
      dark: green[700],
      contrastText: textShell.primary,
    });
  });
  it('should have correct error palette', () => {
    expect(palette.error).toEqual({
      light: red[100],
      main: red[600],
      dark: red[700],
      contrastText: textShell.primary,
    });
  });
  it('should have correct warning palette', () => {
    expect(palette.warning).toEqual({
      light: yellow[100],
      main: yellow[400],
      dark: yellow[700],
      contrastText: text.primary,
    });
  });
  it('should have correct info palette', () => {
    expect(palette.info).toEqual({
      light: blue[100],
      main: blue[600],
      dark: blue[800],
      contrastText: textShell.primary,
    });
  });
  it('should have correct blue palette', () => {
    expect(palette.blue).toEqual(blue);
  });
  it('should have correct grey palette', () => {
    expect(palette.grey).toEqual(grey);
  });
});
