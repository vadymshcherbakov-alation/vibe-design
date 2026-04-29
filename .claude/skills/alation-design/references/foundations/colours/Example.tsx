import { Box, Stack, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import type { ReactNode } from 'react';

// Mirrors the Figma `Color (Semantic)` collection 1:1 — 97 tokens organised by
// UI concept (Background / Border / Icon / Text) and element subgroup
// (control, button, chip, surface, accent, scrollbar, avatar, progress, misc).
// Hex values are the resolved Light-mode values; Dark-mode values live in §5
// of usage.md.

// ───────────────────────────────────────────────────────────────────────────
// Raw palette — source for the semantic layer. Brand = Orange/600.

type PaletteFamily = {
  name: string;
  shades: Record<string, string | null>;
};

const PALETTE: PaletteFamily[] = [
  { name: 'Blue',    shades: { 50: null, 100: '#ECF6FF', 200: '#D9EEFF', 300: '#BAE2FF', 400: '#93CCFF', 500: '#57ABFF', 600: '#0073DD', 700: '#0059DF', 800: '#003EB4', 900: '#002C81' } },
  { name: 'Red',     shades: { 50: null, 100: '#FFF0F0', 200: '#FFE1E1', 300: '#FFC9CB', 400: '#FFA8AC', 500: '#FF7781', 600: '#CA334A', 700: '#C3002E', 800: '#9B001B', 900: '#6F0012' } },
  { name: 'Amber',   shades: { 50: null, 100: '#FCF4E7', 200: '#FCE9CC', 300: '#FCD9A1', 400: '#F2BF6A', 500: '#E19900', 600: '#AC6000', 700: '#A44400', 800: '#812C00', 900: '#5C1F00' } },
  { name: 'Green',   shades: { 50: null, 100: '#F0F8EB', 200: '#E2F3D5', 300: '#CBEAB2', 400: '#ACD987', 500: '#81BE40', 600: '#488800', 700: '#277800', 800: '#125C00', 900: '#0D4100' } },
  { name: 'Teal',    shades: { 50: null, 100: '#E7F9F6', 200: '#CCF6F0', 300: '#9FF0E5', 400: '#5CE2D2', 500: '#00CAB6', 600: '#009482', 700: '#008673', 800: '#006758', 900: '#00493E' } },
  { name: 'Purple',  shades: { 50: null, 100: '#F5F3FF', 200: '#EDE7FF', 300: '#E0D5FF', 400: '#CBBAFF', 500: '#AF91FF', 600: '#7C56D5', 700: '#6F33D5', 800: '#5519AC', 900: '#3C137B' } },
  { name: 'Pink',    shades: { 50: null, 100: '#FFF0F4', 200: '#FFE1EA', 300: '#FFC8DB', 400: '#FFA7C5', 500: '#FC76A4', 600: '#C4336F', 700: '#BD005C', 800: '#960044', 900: '#6B0030' } },
  { name: 'Neutral', shades: { 50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4', 400: '#A3A3A3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717' } },
  { name: 'Orange',  shades: { 50: null, 100: '#FFF1EB', 200: '#FFE3D5', 300: '#FFCEB3', 400: '#FFAF89', 500: '#FE8047', 600: '#F16923', 700: '#C10000', 800: '#990000', 900: '#6E0000' } },
  { name: 'Yellow',  shades: { 50: null, 100: '#F9F5E7', 200: '#F7ECCB', 300: '#F1DDA0', 400: '#E4C668', 500: '#CFA400', 600: '#9B6C00', 700: '#915500', 800: '#713C00', 900: '#512A00' } },
];

const SHADE_ROWS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

function PaletteGrid() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `48px repeat(${PALETTE.length}, minmax(0, 1fr))`,
        gap: '6px',
        alignItems: 'center',
      }}
    >
      <Box />
      {PALETTE.map(({ name }) => (
        <Box key={name} sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary', textAlign: 'center', pb: '6px', letterSpacing: '0.02em' }}>
          {name}
        </Box>
      ))}

      {SHADE_ROWS.map((shade) => (
        <Box key={shade} sx={{ display: 'contents' }}>
          <Box sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'ui-monospace, monospace', textAlign: 'right', pr: '6px' }}>
            {shade}
          </Box>
          {PALETTE.map(({ name, shades }) => {
            const value = shades[shade];
            const isBrand = name === 'Orange' && shade === '600';
            if (!value) {
              return (
                <Box
                  key={`${name}-${shade}`}
                  sx={{
                    height: 36,
                    borderRadius: '6px',
                    border: '1px dashed',
                    borderColor: 'grey.400',
                    background: 'transparent',
                  }}
                />
              );
            }
            return (
              <Box
                key={`${name}-${shade}`}
                title={`${name} ${shade} · ${value}${isBrand ? ' (Brand)' : ''}`}
                sx={{
                  position: 'relative',
                  height: 36,
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  background: value,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isBrand && (
                  <StarRoundedIcon
                    sx={{
                      color: '#FFFFFF',
                      fontSize: 26,
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Semantic tokens — mirrored from Figma `Color (Semantic)` Light mode.

type Token = { name: string; value: string };
type SubGroup = { title: string; tokens: Token[] };

const BACKGROUND: SubGroup[] = [
  {
    title: 'surface',
    tokens: [
      { name: 'background/surface/default',        value: '#FFFFFF' },
      { name: 'background/surface/secondary',      value: '#FAFAFA' },
      { name: 'background/surface/modal/backdrop', value: '#27272AB2' },
    ],
  },
  {
    title: 'control',
    tokens: [
      { name: 'background/control/default',           value: '#FFFFFF' },
      { name: 'background/control/hover',             value: '#F5F5F5' },
      { name: 'background/control/secondary',         value: '#F5F5F5' },
      { name: 'background/control/secondary-hover',   value: '#E5E5E5' },
      { name: 'background/control/disabled',          value: '#FAFAFA' },
      { name: 'background/control/selected',          value: '#F5F5F5' },
      { name: 'background/control/inverted',          value: '#262626' },
      { name: 'background/control/warning',           value: '#FCE9CC' },
      { name: 'background/control/error',             value: '#FFE1E1' },
      { name: 'background/control/information',       value: '#D9EEFF' },
      { name: 'background/control/success',           value: '#E2F3D5' },
    ],
  },
  {
    title: 'button',
    tokens: [
      { name: 'background/button/primary',                value: '#0073DD' },
      { name: 'background/button/primary-hover',          value: '#0059DF' },
      { name: 'background/button/error',                  value: '#CA334A' },
      { name: 'background/button/error-hover',            value: '#C3002E' },
      { name: 'background/button/secondary-hover',        value: '#ECF6FF' },
      { name: 'background/button/error-secondary-hover',  value: '#FFF0F0' },
    ],
  },
  {
    title: 'progress',
    tokens: [{ name: 'background/progress/primary', value: '#0073DD' }],
  },
  {
    title: 'scrollbar',
    tokens: [
      { name: 'background/scrollbar/default', value: '#D4D4D4' },
      { name: 'background/scrollbar/hover',   value: '#A3A3A3' },
    ],
  },
  {
    title: 'avatar',
    tokens: [
      { name: 'background/avatar/default', value: '#0073DD' },
      { name: 'background/avatar/subtle',  value: '#D4D4D4' },
    ],
  },
  {
    title: 'misc',
    tokens: [{ name: 'background/misc/placeholder', value: '#FFF0F4' }],
  },
  {
    title: 'accent',
    tokens: [
      { name: 'background/accent/gray',   value: '#E5E5E5' },
      { name: 'background/accent/blue',   value: '#D9EEFF' },
      { name: 'background/accent/red',    value: '#FFE1E1' },
      { name: 'background/accent/amber',  value: '#FCE9CC' },
      { name: 'background/accent/green',  value: '#E2F3D5' },
      { name: 'background/accent/teal',   value: '#CCF6F0' },
      { name: 'background/accent/purple', value: '#EDE7FF' },
      { name: 'background/accent/pink',   value: '#FFE1EA' },
    ],
  },
  {
    title: 'chip',
    tokens: [
      { name: 'background/chip/gray',           value: '#E5E5E5' },
      { name: 'background/chip/blue',           value: '#D9EEFF' },
      { name: 'background/chip/red',            value: '#FFE1E1' },
      { name: 'background/chip/amber',          value: '#FCE9CC' },
      { name: 'background/chip/green',          value: '#E2F3D5' },
      { name: 'background/chip/teal',           value: '#CCF6F0' },
      { name: 'background/chip/purple',         value: '#EDE7FF' },
      { name: 'background/chip/pink',           value: '#FFE1EA' },
      { name: 'background/chip/orange',         value: '#FFE3D5' },
      { name: 'background/chip/gray-strong',    value: '#525252' },
      { name: 'background/chip/blue-strong',    value: '#0073DD' },
      { name: 'background/chip/red-strong',     value: '#CA334A' },
      { name: 'background/chip/amber-strong',   value: '#AC6000' },
      { name: 'background/chip/green-strong',   value: '#488800' },
      { name: 'background/chip/teal-strong',    value: '#009482' },
      { name: 'background/chip/purple-strong',  value: '#7C56D5' },
      { name: 'background/chip/pink-strong',    value: '#C4336F' },
      { name: 'background/chip/orange-strong',  value: '#F16923' },
    ],
  },
];

const BORDER: SubGroup[] = [
  {
    title: 'default',
    tokens: [
      { name: 'border/default',     value: '#E5E5E5' },
      { name: 'border/hover',       value: '#A3A3A3' },
      { name: 'border/disabled',    value: '#E5E5E5' },
      { name: 'border/focused',     value: '#0073DD' },
      { name: 'border/selected',    value: '#737373' },
      { name: 'border/error',       value: '#CA334A' },
      { name: 'border/warning',     value: '#AC6000' },
      { name: 'border/information', value: '#0073DD' },
      { name: 'border/success',     value: '#488800' },
    ],
  },
  {
    title: 'button',
    tokens: [
      { name: 'border/button/primary', value: '#0073DD' },
      { name: 'border/button/error',   value: '#CA334A' },
      { name: 'border/button/focus',   value: '#002C81' },
    ],
  },
  {
    title: 'misc',
    tokens: [{ name: 'border/misc/placeholder', value: '#FC76A4' }],
  },
];

const ICON: SubGroup[] = [
  {
    title: 'default',
    tokens: [
      { name: 'icon/primary',        value: '#171717' },
      { name: 'icon/secondary',      value: '#525252' },
      { name: 'icon/disabled',       value: '#A3A3A3' },
      { name: 'icon/inverted',       value: '#FAFAFA' },
      { name: 'icon/information',    value: '#0073DD' },
      { name: 'icon/success',        value: '#488800' },
      { name: 'icon/error',          value: '#CA334A' },
      { name: 'icon/error-disabled', value: '#FFA8AC' },
      { name: 'icon/warning',        value: '#AC6000' },
    ],
  },
  {
    title: 'button',
    tokens: [{ name: 'icon/button/primary', value: '#0073DD' }],
  },
];

const TEXT: SubGroup[] = [
  {
    title: 'default',
    tokens: [
      { name: 'text/primary',        value: '#171717' },
      { name: 'text/secondary',      value: '#525252' },
      { name: 'text/disabled',       value: '#A3A3A3' },
      { name: 'text/inverted',       value: '#FAFAFA' },
      { name: 'text/warning',        value: '#AC6000' },
      { name: 'text/error',          value: '#CA334A' },
      { name: 'text/error-disabled', value: '#FFA8AC' },
      { name: 'text/information',    value: '#0073DD' },
      { name: 'text/success',        value: '#488800' },
    ],
  },
  {
    title: 'button',
    tokens: [{ name: 'text/button/primary', value: '#0073DD' }],
  },
  {
    title: 'chip',
    tokens: [
      { name: 'text/chip/gray',   value: '#525252' },
      { name: 'text/chip/blue',   value: '#0073DD' },
      { name: 'text/chip/red',    value: '#CA334A' },
      { name: 'text/chip/amber',  value: '#AC6000' },
      { name: 'text/chip/green',  value: '#488800' },
      { name: 'text/chip/teal',   value: '#009482' },
      { name: 'text/chip/purple', value: '#7C56D5' },
      { name: 'text/chip/pink',   value: '#C4336F' },
      { name: 'text/chip/orange', value: '#F16923' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────

function Swatch({ name, value }: Token) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'grey.300',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          flexShrink: 0,
          border: '1px solid',
          borderColor: 'grey.300',
          background: value,
        }}
      />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" sx={{ display: 'block', fontWeight: 500, fontSize: 12, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function SubGroupBlock({ title, tokens }: SubGroup) {
  return (
    <Stack spacing={1}>
      <Typography variant="overline" color="text.secondary">{title}</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 1.5,
        }}
      >
        {tokens.map((t) => <Swatch key={t.name} {...t} />)}
      </Box>
    </Stack>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600 }}>{title}</Typography>
      <Stack spacing={3}>{children}</Stack>
    </Stack>
  );
}

export default function ColoursExample() {
  return (
    <Stack spacing={5}>
      <Stack spacing={1.5}>
        <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600 }}>Palette</Typography>
        <Typography variant="body2" color="text.secondary">
          Raw base-colour scales — the source of truth. 91 tokens: 9 colour ramps × 9 shades + Neutral (10 shades). Brand = Orange/600 (★).
        </Typography>
        <PaletteGrid />
      </Stack>

      <Group title="Background">
        {BACKGROUND.map((g) => <SubGroupBlock key={g.title} {...g} />)}
      </Group>

      <Group title="Border">
        {BORDER.map((g) => <SubGroupBlock key={g.title} {...g} />)}
      </Group>

      <Group title="Icon">
        {ICON.map((g) => <SubGroupBlock key={g.title} {...g} />)}
      </Group>

      <Group title="Text">
        {TEXT.map((g) => <SubGroupBlock key={g.title} {...g} />)}
      </Group>
    </Stack>
  );
}
