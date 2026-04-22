"use client";

// Skip static prerendering — the Morpheus theme has React elements in its
// component overrides that are not compatible with Next.js static generation.
export const dynamic = "force-dynamic";

import { useState } from "react";

// Layout
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

// Typography & Divider
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// Buttons
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import ButtonGroup from "@mui/material/ButtonGroup";

// Inputs
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";

// Selection controls
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Rating from "@mui/material/Rating";
import Slider from "@mui/material/Slider";

// Chips & Badges
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

// Data display
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Feedback
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";

// Surfaces
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

// Navigation
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Pagination from "@mui/material/Pagination";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Overlays
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";

// Icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MailIcon from "@mui/icons-material/Mail";

const tableRows = [
  { name: "Cupcake", calories: 305, fat: 3.7 },
  { name: "Donut", calories: 452, fat: 25.0 },
  { name: "Eclair", calories: 262, fat: 16.0 },
  { name: "Frozen yoghurt", calories: 159, fat: 6.0 },
];

const autocompleteOptions = ["Option A", "Option B", "Option C", "Option D"];

const stepperSteps = ["Select data source", "Configure settings", "Confirm"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );
}

export default function ShowcasePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [stepperStep, setStepperStep] = useState(0);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("option1");
  const [switchChecked, setSwitchChecked] = useState(true);
  const [toggleValue, setToggleValue] = useState<string | null>("left");
  const [ratingValue, setRatingValue] = useState<number | null>(3);
  const [sliderValue, setSliderValue] = useState(40);
  const [selectValue, setSelectValue] = useState("option1");
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>(null);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h2" gutterBottom>
        MUI Morpheus Showcase
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
        All major MUI components rendered under the Alation Morpheus design system.
      </Typography>

      {/* ── 1. Typography ── */}
      <Section title="Typography">
        <Stack gap={1}>
          {(
            [
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "subtitle1",
              "subtitle2",
              "body1",
              "body2",
            ] as const
          ).map((variant) => (
            <Typography key={variant} variant={variant}>
              {variant} — The quick brown fox jumps over the lazy dog
            </Typography>
          ))}
          <Typography variant="caption" display="block">
            caption — The quick brown fox jumps over the lazy dog
          </Typography>
          <Typography variant="overline" display="block">
            overline — The quick brown fox jumps over the lazy dog
          </Typography>
          <Typography variant="button" display="block">
            button — The quick brown fox jumps over the lazy dog
          </Typography>
        </Stack>
      </Section>

      {/* ── 2. Buttons ── */}
      <Section title="Buttons">
        <Stack gap={3}>
          {/* Contained */}
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Contained
            </Typography>
            {(
              [
                "primary",
                "secondary",
                "error",
                "warning",
                "success",
              ] as const
            ).map((color) => (
              <Button key={color} variant="contained" color={color}>
                {color}
              </Button>
            ))}
            <Button variant="contained" disabled>
              disabled
            </Button>
          </Stack>

          {/* Outlined */}
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Outlined
            </Typography>
            {(
              [
                "primary",
                "secondary",
                "error",
                "warning",
                "success",
              ] as const
            ).map((color) => (
              <Button key={color} variant="outlined" color={color}>
                {color}
              </Button>
            ))}
            <Button variant="outlined" disabled>
              disabled
            </Button>
          </Stack>

          {/* Text */}
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Text
            </Typography>
            {(
              [
                "primary",
                "secondary",
                "error",
                "warning",
                "success",
              ] as const
            ).map((color) => (
              <Button key={color} variant="text" color={color}>
                {color}
              </Button>
            ))}
            <Button variant="text" disabled>
              disabled
            </Button>
          </Stack>

          {/* With icons & sizes */}
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Icons & Sizes
            </Typography>
            <Button variant="contained" startIcon={<SendIcon />}>
              Send
            </Button>
            <Button variant="outlined" endIcon={<DeleteIcon />} color="error">
              Delete
            </Button>
            <Button variant="contained" size="small">
              Small
            </Button>
            <Button variant="contained" size="large">
              Large
            </Button>
            <IconButton color="primary">
              <MailIcon />
            </IconButton>
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
            <Fab color="primary" size="medium">
              <AddIcon />
            </Fab>
            <Fab color="secondary" size="small">
              <AddIcon />
            </Fab>
          </Stack>

          {/* ButtonGroup */}
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Button Group
            </Typography>
            <ButtonGroup variant="contained">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
            <ButtonGroup variant="outlined" color="secondary">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </Stack>
        </Stack>
      </Section>

      {/* ── 3. Inputs ── */}
      <Section title="Inputs">
        <Stack gap={4}>
          {/* TextField variants */}
          <Stack direction="row" flexWrap="wrap" gap={3} alignItems="flex-start">
            <TextField label="Standard" variant="standard" />
            <TextField label="Outlined" variant="outlined" />
            <TextField label="Filled" variant="filled" />
          </Stack>

          {/* TextField states */}
          <Stack direction="row" flexWrap="wrap" gap={3} alignItems="flex-start">
            <TextField
              label="With helper text"
              helperText="Some helpful information"
            />
            <TextField
              label="Error state"
              error
              helperText="This field is required"
            />
            <TextField label="Disabled" disabled value="Disabled value" />
            <TextField label="Multiline" multiline rows={3} sx={{ minWidth: 240 }} />
          </Stack>

          {/* Select */}
          <Stack direction="row" flexWrap="wrap" gap={3} alignItems="flex-start">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select option</InputLabel>
              <Select
                value={selectValue}
                label="Select option"
                onChange={(e) => setSelectValue(e.target.value)}
              >
                <MenuItem value="option1">Option 1</MenuItem>
                <MenuItem value="option2">Option 2</MenuItem>
                <MenuItem value="option3">Option 3</MenuItem>
              </Select>
            </FormControl>

            {/* Autocomplete */}
            <Autocomplete
              options={autocompleteOptions}
              value={autocompleteValue}
              onChange={(_, v) => setAutocompleteValue(v)}
              renderInput={(params) => (
                <TextField {...params} label="Autocomplete" />
              )}
              sx={{ width: 280 }}
            />
          </Stack>
        </Stack>
      </Section>

      {/* ── 4. Selection Controls ── */}
      <Section title="Selection Controls">
        <Stack gap={4}>
          {/* Checkboxes */}
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Checkbox
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                />
              }
              label="Checked"
            />
            <FormControlLabel
              control={<Checkbox checked={false} onChange={() => {}} />}
              label="Unchecked"
            />
            <FormControlLabel
              control={<Checkbox indeterminate />}
              label="Indeterminate"
            />
            <FormControlLabel
              control={<Checkbox disabled />}
              label="Disabled"
            />
            <FormControlLabel
              control={<Checkbox color="secondary" checked />}
              label="Secondary"
            />
          </Stack>

          {/* Radio */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 1 }}>
              Radio Group
            </Typography>
            <FormControl>
              <FormLabel>Radio options</FormLabel>
              <RadioGroup
                row
                value={radioValue}
                onChange={(e) => setRadioValue(e.target.value)}
              >
                <FormControlLabel
                  value="option1"
                  control={<Radio />}
                  label="Option 1"
                />
                <FormControlLabel
                  value="option2"
                  control={<Radio />}
                  label="Option 2"
                />
                <FormControlLabel
                  value="option3"
                  control={<Radio />}
                  label="Option 3"
                />
                <FormControlLabel
                  value="option4"
                  control={<Radio disabled />}
                  label="Disabled"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Switch */}
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Switch
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                />
              }
              label={switchChecked ? "On" : "Off"}
            />
            <FormControlLabel
              control={<Switch color="secondary" checked />}
              label="Secondary"
            />
            <FormControlLabel
              control={<Switch disabled />}
              label="Disabled off"
            />
            <FormControlLabel
              control={<Switch disabled checked />}
              label="Disabled on"
            />
          </Stack>

          {/* Toggle Buttons */}
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Toggle Button Group
            </Typography>
            <ToggleButtonGroup
              value={toggleValue}
              exclusive
              onChange={(_, v) => setToggleValue(v)}
            >
              <ToggleButton value="left">
                <FormatAlignLeftIcon />
              </ToggleButton>
              <ToggleButton value="center">
                <FormatAlignCenterIcon />
              </ToggleButton>
              <ToggleButton value="right">
                <FormatAlignRightIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {/* Rating & Slider */}
          <Stack gap={3}>
            <Box>
              <Typography variant="overline" display="block" sx={{ mb: 1 }}>
                Rating
              </Typography>
              <Rating
                value={ratingValue}
                onChange={(_, v) => setRatingValue(v)}
              />
            </Box>
            <Box>
              <Typography variant="overline" display="block" sx={{ mb: 1 }}>
                Slider
              </Typography>
              <Slider
                value={sliderValue}
                onChange={(_, v) => setSliderValue(v as number)}
                sx={{ width: 300 }}
                valueLabelDisplay="auto"
              />
            </Box>
          </Stack>
        </Stack>
      </Section>

      {/* ── 5. Chips & Badges ── */}
      <Section title="Chips & Badges">
        <Stack gap={4}>
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Chips
            </Typography>
            <Chip label="Default" />
            <Chip label="Clickable" onClick={() => {}} />
            <Chip label="Deletable" onDelete={() => {}} />
            <Chip label="Outlined" variant="outlined" />
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Error" color="error" />
            <Chip label="Warning" color="warning" />
            <Chip label="With Avatar" avatar={<Avatar>M</Avatar>} />
            <Chip label="With Icon" icon={<MailIcon />} />
            <Chip label="Disabled" disabled />
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={4} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Badges
            </Typography>
            <Badge badgeContent={4} color="primary">
              <MailIcon />
            </Badge>
            <Badge badgeContent={99} color="error">
              <MailIcon />
            </Badge>
            <Badge badgeContent={0} showZero color="secondary">
              <MailIcon />
            </Badge>
            <Badge variant="dot" color="success">
              <MailIcon />
            </Badge>
            <Badge variant="dot" color="error">
              <MailIcon />
            </Badge>
          </Stack>
        </Stack>
      </Section>

      {/* ── 6. Data Display ── */}
      <Section title="Data Display">
        <Stack gap={4}>
          {/* Avatars */}
          <Stack direction="row" flexWrap="wrap" gap={3} alignItems="center">
            <Typography variant="overline" sx={{ width: "100%" }}>
              Avatars
            </Typography>
            <Avatar>AB</Avatar>
            <Avatar sx={{ bgcolor: "primary.main" }}>R</Avatar>
            <Avatar sx={{ bgcolor: "secondary.main" }}>M</Avatar>
            <Avatar sx={{ bgcolor: "error.main" }}>K</Avatar>
            <AvatarGroup max={4}>
              <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
              <Avatar sx={{ bgcolor: "secondary.main" }}>B</Avatar>
              <Avatar sx={{ bgcolor: "success.main" }}>C</Avatar>
              <Avatar sx={{ bgcolor: "warning.main" }}>D</Avatar>
              <Avatar sx={{ bgcolor: "error.main" }}>E</Avatar>
            </AvatarGroup>
          </Stack>

          {/* List */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 1 }}>
              List
            </Typography>
            <Paper sx={{ maxWidth: 400 }}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <MailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Inbox" secondary="12 new messages" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      <SendIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Sent" secondary="4 sent today" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "error.main" }}>
                      <DeleteIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Trash" secondary="3 items" />
                </ListItem>
              </List>
            </Paper>
          </Box>

          {/* Table */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 1 }}>
              Table
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Dessert</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat (g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Section>

      {/* ── 7. Feedback ── */}
      <Section title="Feedback">
        <Stack gap={4}>
          {/* Alerts */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 1 }}>
              Alerts
            </Typography>
            <Stack gap={2} sx={{ maxWidth: 600 }}>
              <Alert severity="success">Success — operation completed.</Alert>
              <Alert severity="info">Info — here is some information.</Alert>
              <Alert severity="warning">Warning — please review this.</Alert>
              <Alert severity="error">Error — something went wrong.</Alert>
              <Alert severity="success" variant="outlined">
                Outlined success
              </Alert>
              <Alert severity="info" variant="filled">
                Filled info
              </Alert>
              <Alert severity="warning" variant="filled">
                Filled warning
              </Alert>
              <Alert severity="error" variant="outlined">
                Outlined error
              </Alert>
            </Stack>
          </Box>

          {/* Progress */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Circular Progress
            </Typography>
            <Stack direction="row" gap={4} alignItems="center">
              <CircularProgress />
              <CircularProgress color="secondary" />
              <CircularProgress color="success" size={48} />
              <CircularProgress color="error" />
              <CircularProgress variant="determinate" value={60} />
            </Stack>
          </Box>

          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Linear Progress
            </Typography>
            <Stack gap={2} sx={{ maxWidth: 500 }}>
              <LinearProgress />
              <LinearProgress color="secondary" />
              <LinearProgress color="success" />
              <LinearProgress variant="determinate" value={70} />
            </Stack>
          </Box>

          {/* Skeleton */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Skeleton
            </Typography>
            <Stack gap={1} sx={{ maxWidth: 400 }}>
              <Skeleton variant="text" sx={{ fontSize: "1.6rem" }} />
              <Stack direction="row" gap={2} alignItems="center">
                <Skeleton variant="circular" width={40} height={40} />
                <Stack flex={1} gap={0.5}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="80%" />
                </Stack>
              </Stack>
              <Skeleton variant="rectangular" width={400} height={80} />
              <Skeleton variant="rounded" width={400} height={60} />
            </Stack>
          </Box>
        </Stack>
      </Section>

      {/* ── 8. Surfaces ── */}
      <Section title="Surfaces">
        <Stack gap={4}>
          {/* Paper */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Paper — Elevations
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={3} alignItems="center">
              {[0, 1, 2, 4, 8, 16].map((elevation) => (
                <Paper
                  key={elevation}
                  elevation={elevation}
                  sx={{ p: 3, width: 110, textAlign: "center" }}
                >
                  <Typography variant="body2">elevation</Typography>
                  <Typography variant="h6">{elevation}</Typography>
                </Paper>
              ))}
            </Stack>
          </Box>

          {/* Cards */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Cards
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={3}>
              <Card sx={{ maxWidth: 280 }}>
                <Box
                  sx={{
                    height: 140,
                    bgcolor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h4" color="primary.contrastText">
                    Card Image
                  </Typography>
                </Box>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Elevated Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A card with media area, content, and action buttons rendered
                    under the Morpheus theme.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                  <Button size="small" color="error">
                    Delete
                  </Button>
                </CardActions>
              </Card>

              <Card variant="outlined" sx={{ maxWidth: 280 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Outlined Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A card with the outlined variant — no shadow, uses a border
                    instead.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained">
                    Action
                  </Button>
                  <Button size="small">Cancel</Button>
                </CardActions>
              </Card>
            </Stack>
          </Box>

          {/* Accordion */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Accordion
            </Typography>
            <Box sx={{ maxWidth: 600 }}>
              {["Accordion Panel 1", "Accordion Panel 2", "Accordion Panel 3"].map(
                (label, i) => (
                  <Accordion key={label} disabled={i === 2}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{label}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Content for {label.toLowerCase()}. This area expands to
                        reveal additional details when the accordion is opened.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                )
              )}
            </Box>
          </Box>
        </Stack>
      </Section>

      {/* ── 9. Navigation ── */}
      <Section title="Navigation">
        <Stack gap={4}>
          {/* Tabs */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 1 }}>
              Tabs
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
              >
                <Tab label="Tab One" />
                <Tab label="Tab Two" />
                <Tab label="Tab Three" />
                <Tab label="Disabled" disabled />
              </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography>Content for Tab {tabValue + 1}</Typography>
            </Box>
          </Box>

          {/* Breadcrumbs */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 1 }}>
              Breadcrumbs
            </Typography>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Link color="inherit" href="#" underline="hover">
                Home
              </Link>
              <Link color="inherit" href="#" underline="hover">
                Catalog
              </Link>
              <Link color="inherit" href="#" underline="hover">
                Schemas
              </Link>
              <Typography color="text.primary">Table Detail</Typography>
            </Breadcrumbs>
          </Box>

          {/* Pagination */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Pagination
            </Typography>
            <Stack gap={2}>
              <Pagination count={10} />
              <Pagination count={10} color="primary" />
              <Pagination count={10} color="secondary" />
              <Pagination count={10} disabled />
            </Stack>
          </Box>

          {/* Stepper */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Stepper
            </Typography>
            <Box sx={{ maxWidth: 600 }}>
              <Stepper activeStep={stepperStep}>
                {stepperSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Stack direction="row" gap={2} sx={{ mt: 3 }}>
                <Button
                  disabled={stepperStep === 0}
                  onClick={() => setStepperStep((s) => s - 1)}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() =>
                    setStepperStep((s) => Math.min(s + 1, stepperSteps.length - 1))
                  }
                  disabled={stepperStep === stepperSteps.length - 1}
                >
                  Next
                </Button>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Section>

      {/* ── 10. Overlays ── */}
      <Section title="Overlays">
        <Stack gap={4}>
          {/* Dialog */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Dialog
            </Typography>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Open Dialog
            </Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This is a sample dialog using the Morpheus theme. Are you sure
                  you want to proceed with this action?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={() => setDialogOpen(false)}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* Tooltip */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Tooltips
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
              <Tooltip title="Default tooltip">
                <Button variant="outlined">Hover me</Button>
              </Tooltip>
              <Tooltip title="Top placement" placement="top">
                <Button variant="outlined">Top</Button>
              </Tooltip>
              <Tooltip title="Right placement" placement="right">
                <Button variant="outlined">Right</Button>
              </Tooltip>
              <Tooltip title="Bottom placement" placement="bottom">
                <Button variant="outlined">Bottom</Button>
              </Tooltip>
              <Tooltip title="Arrow tooltip" arrow>
                <Button variant="outlined">With arrow</Button>
              </Tooltip>
            </Stack>
          </Box>

          {/* Snackbar */}
          <Box>
            <Typography variant="overline" display="block" sx={{ mb: 2 }}>
              Snackbar
            </Typography>
            <Button variant="contained" onClick={() => setSnackbarOpen(true)}>
              Show Snackbar
            </Button>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              message="Action completed successfully"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setSnackbarOpen(false)}
                >
                  Dismiss
                </Button>
              }
            />
          </Box>
        </Stack>
      </Section>
    </Container>
  );
}
