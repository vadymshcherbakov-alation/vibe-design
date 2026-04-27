import { Box, Breadcrumbs, Link, Stack, SvgIcon, Typography } from '@mui/material';
import { ChevronLeft, Database, Folder, Home, Table2 } from 'lucide-react';

// Production usage prefers React Router's Link via `component={RouterLink}` and
// `to="…"`. This example uses MUI Link with `href` so the demo is portable
// outside an app router context.

export default function BreadcrumbExample() {
  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      {/* Shape — Trail · default · sits above a Page Header */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Trail shape · default · 2+ levels deep · sits above a Page Header
        </Typography>
        <Breadcrumbs aria-label="Settings trail" sx={{ mb: 1 }}>
          <Link href="#" underline="hover">Settings</Link>
          <Link href="#" underline="hover">Notifications</Link>
          <Typography color="text.primary" aria-current="page">Email</Typography>
        </Breadcrumbs>
        <Typography variant="h1">Email</Typography>
      </Stack>

      {/* Shape — Back to parent · single-step · parent name only */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Back-to-parent shape · single-step hierarchy · parent name only ("&lt; Settings", never "&lt; Back to Settings")
        </Typography>
        <Box component="nav" aria-label="Back to settings" sx={{ mb: 1 }}>
          <Link
            href="#"
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Settings
          </Link>
        </Box>
        <Typography variant="h1">Notification preferences</Typography>
      </Stack>

      {/* Trail · wrapper choice — ObjectBreadcrumbs shape (catalog otype walk) */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Trail · wrapper · ObjectBreadcrumbs · catalog otype walk · long names truncate via noWrap + tooltip
        </Typography>
        <Breadcrumbs aria-label="Object trail">
          <Link href="#" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <SvgIcon component={Database as never} fontSize="small" />
            Datasources
          </Link>
          <Link href="#" underline="hover">finance_prod</Link>
          <Link href="#" underline="hover">public</Link>
          <Link href="#" underline="hover">orders</Link>
          <Typography color="text.primary" aria-current="page">customer_id</Typography>
        </Breadcrumbs>
      </Stack>

      {/* Collapse behaviour — past maxItems */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Collapse to ellipsis menu · trail exceeds <code>maxItems</code> (production wires the menu via StandardBreadcrumbs)
        </Typography>
        <Breadcrumbs
          aria-label="Deep settings trail"
          maxItems={4}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={2}
        >
          <Link href="#" underline="hover">Admin</Link>
          <Link href="#" underline="hover">Roles & Permissions</Link>
          <Link href="#" underline="hover">Custom roles</Link>
          <Link href="#" underline="hover">Read-only</Link>
          <Link href="#" underline="hover">Inheritance</Link>
          <Typography color="text.primary" aria-current="page">Overrides</Typography>
        </Breadcrumbs>
      </Stack>

      {/* Per-item content — leading icon on first item */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Per-item content · leading icon on the first item
        </Typography>
        <Breadcrumbs aria-label="Folder trail">
          <Link href="#" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <SvgIcon component={Home as never} fontSize="small" />
            Home
          </Link>
          <Link href="#" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <SvgIcon component={Folder as never} fontSize="small" />
            Catalog
          </Link>
          <Link href="#" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <SvgIcon component={Table2 as never} fontSize="small" />
            Tables
          </Link>
          <Typography color="text.primary" aria-current="page">orders</Typography>
        </Breadcrumbs>
      </Stack>

      {/* Per-item content — disabled-link mode (read-only preview) */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Disabled-link mode · read-only preview (e.g. inside a Move dialog)
        </Typography>
        <Breadcrumbs aria-label="Move target preview">
          <Typography color="text.secondary">finance_prod</Typography>
          <Typography color="text.secondary">public</Typography>
          <Typography color="text.primary" aria-current="page">orders</Typography>
        </Breadcrumbs>
      </Stack>
    </Stack>
  );
}
