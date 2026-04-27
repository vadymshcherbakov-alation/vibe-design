import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { ChevronDown, Edit3, Pencil } from 'lucide-react';

// Production helpers from @alation/fabric-ui — re-implemented inline here so
// the example is portable. In production code, import them:
//   import { MuiAccordionSummaryHeader, MuiAccordionSummaryAction } from '@alation/fabric-ui';
//   import { ChevronDownIcon } from '@alation/icons-neo';
function MuiAccordionSummaryHeader({
  primary,
  iconComponent,
  variant = 'subtitle1',
  children,
}: {
  readonly primary: React.ReactNode;
  readonly iconComponent?: React.ComponentType<React.ComponentProps<'svg'>>;
  readonly variant?: 'subtitle1' | 'subtitle2' | 'h4';
  readonly children?: React.ReactNode;
}) {
  return (
    <Box
      className="MuiAccordionSummary-headerContent"
      sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}
    >
      <Typography
        component="h2"
        noWrap
        sx={iconComponent ? { display: 'inline-flex', alignItems: 'center', gap: 0.75 } : undefined}
        variant={variant}
      >
        {iconComponent && <SvgIcon component={iconComponent} fontSize="small" />}
        {primary}
      </Typography>
      {children}
    </Box>
  );
}

function MuiAccordionSummaryAction({ children }: { readonly children: React.ReactNode }) {
  return (
    <Box
      className="MuiAccordionSummary-actionContent"
      sx={{ display: 'flex', flexDirection: 'row-reverse', flexGrow: 1, mr: 2 }}
    >
      {children}
    </Box>
  );
}

const faqs = [
  { id: 'connect',  question: 'How do I connect a data source?',     answer: 'Open Settings → Connections, pick the connector that matches your warehouse, then follow the auth flow.' },
  { id: 'product',  question: 'What is a data product?',             answer: 'A curated, governed bundle of datasets, definitions, and contracts that downstream consumers depend on.' },
  { id: 'lineage',  question: 'How are object trails resolved?',     answer: 'The catalog walks the otype graph from the leaf object up to the root datasource, dedup-ing where polyhierarchy applies.' },
];

export default function AccordionExample() {
  const [openId, setOpenId] = useState<string | null>('connect');

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      {/* Variant — End-led group · multi-expand · uncontrolled */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          End-led (default) · multi-expand group · uncontrolled
        </Typography>
        <Box>
          <Accordion defaultExpanded>
            <AccordionSummary
              id="overview-summary"
              aria-controls="overview-details"
              expandIcon={<ChevronDown size={20} aria-hidden="true" />}
            >
              <MuiAccordionSummaryHeader primary="Overview" />
            </AccordionSummary>
            <AccordionDetails id="overview-details">
              <Typography variant="body2">
                Plain-language definition of this object. Auto-generated when the catalog
                first ingests it; editors may rewrite at any time.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              id="schema-summary"
              aria-controls="schema-details"
              expandIcon={<ChevronDown size={20} aria-hidden="true" />}
            >
              <MuiAccordionSummaryHeader primary="Schema" />
            </AccordionSummary>
            <AccordionDetails id="schema-details">
              <Typography variant="body2">Field-level schema, types, and nullability.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              id="lineage-summary"
              aria-controls="lineage-details"
              expandIcon={<ChevronDown size={20} aria-hidden="true" />}
            >
              <MuiAccordionSummaryHeader primary="Lineage" />
            </AccordionSummary>
            <AccordionDetails id="lineage-details">
              <Typography variant="body2">Upstream sources and downstream dependencies.</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Stack>

      {/* Variant — Rich summary · heading + blurb + trailing action */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Rich summary · heading + blurb + trailing action
        </Typography>
        <Accordion>
          <AccordionSummary
            id="standard-summary"
            aria-controls="standard-details"
            expandIcon={<ChevronDown size={20} aria-hidden="true" />}
          >
            <MuiAccordionSummaryHeader primary="Data quality standard" />
            <Box className="MuiAccordionSummary-blurbContent" sx={{ color: 'text.secondary' }}>
              3 fields · Updated 2h ago
            </Box>
            <MuiAccordionSummaryAction>
              <IconButton
                aria-label="Edit standard"
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                <SvgIcon component={Edit3 as never} fontSize="small" />
              </IconButton>
            </MuiAccordionSummaryAction>
          </AccordionSummary>
          <AccordionDetails id="standard-details">
            <Typography variant="body2">
              Required fields, allowed values, and approval workflow for this standard.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Stack>

      {/* Variant — Single-expand · controlled · FAQ pattern */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Single-expand · controlled · only one panel open at a time (FAQ pattern)
        </Typography>
        <Box>
          {faqs.map((faq) => (
            <Accordion
              key={faq.id}
              expanded={openId === faq.id}
              onChange={(_, isOpen) => setOpenId(isOpen ? faq.id : null)}
            >
              <AccordionSummary
                id={`${faq.id}-summary`}
                aria-controls={`${faq.id}-details`}
                expandIcon={<ChevronDown size={20} aria-hidden="true" />}
              >
                <MuiAccordionSummaryHeader primary={faq.question} />
              </AccordionSummary>
              <AccordionDetails id={`${faq.id}-details`}>
                <Typography variant="body2">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Stack>

      {/* Variant — Disabled */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Disabled · the panel is not available yet (e.g. no source connected)
        </Typography>
        <Accordion disabled>
          <AccordionSummary
            id="lineage-disabled-summary"
            aria-controls="lineage-disabled-details"
            expandIcon={<SvgIcon component={Pencil as never} fontSize="small" />}
          >
            <MuiAccordionSummaryHeader primary="Lineage" />
          </AccordionSummary>
          <AccordionDetails id="lineage-disabled-details">
            <Typography variant="body2">Connect a source to see lineage.</Typography>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Stack>
  );
}
