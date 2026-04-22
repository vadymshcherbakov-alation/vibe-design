import {darkGrey} from './grey';

export interface BrandColor {
  readonly background: string;
  readonly logo: string;
}

// Inlined from @alation/api-core defaultBrandColors (not present in this repo)
export const brand: BrandColor = {
  background: '#00416b',
  logo: '#f16923',
};

export const darkBrand: BrandColor = {
  background: darkGrey[50],
  logo: '#f16923',
};
