"use client";
import { useState } from "react";
import { Box, Typography, TextField, Button, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Upload, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { SectionCard } from "../_components";

function Field({
  label,
  children,
  noMargin,
}: {
  label: string;
  children: React.ReactNode;
  noMargin?: boolean;
}) {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: "6px", mb: noMargin ? 0 : "24px" }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, color: "text.primary" }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default function ProfilePage() {
  const theme = useTheme();
  const [displayName, setDisplayName] = useState("server admin");
  const [title, setTitle] = useState("Server Admin");
  const [description, setDescription] = useState(
    "Where does it come from?\n\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
  );
  const [email, setEmail] = useState("admin@alation.com");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRetype, setShowRetype] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <SectionCard
      title="Profile"
      footer={
        <Button variant="contained" size="medium">
          Save
        </Button>
      }
    >
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, alignItems: "start", mb: "24px" }}>
        <Field label="Avatar" noMargin>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Avatar
              src="https://mockmind-api.uifaces.co/content/human/219.jpg"
              sx={{ width: 40, height: 40 }}
            />
            <Button variant="outlined" color="inherit" size="small" startIcon={<Upload size={16} />}>Upload new image</Button>
          </Box>
        </Field>
        <Field label="Username" noMargin>
          <Typography variant="body2">admin@alation.com</Typography>
        </Field>
        <Field label="Role" noMargin>
        <Box>
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: "10px",
              py: "3px",
              borderRadius: "12px",
              backgroundColor: theme.palette.blue[100],
              color: theme.palette.blue[600],
              fontSize: "13px",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            Server Admin
          </Box>
        </Box>
        </Field>
      </Box>
      <Field label="Display name">
        <TextField
          size="small"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
        />
      </Field>
      <Field label="Title">
        <TextField
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
      </Field>
      <Field label="Description">
        <TextField
          multiline
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
      </Field>
      <Field label="Email">
        <TextField
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
      </Field>
    </SectionCard>

    <SectionCard title="Password">
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Keep your account secure by using a strong, unique password.
        </Typography>
        <Button variant="outlined" onClick={() => setPasswordOpen(true)}>Edit</Button>
      </Box>
    </SectionCard>

    <Dialog open={passwordOpen} onClose={() => setPasswordOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pt: "20px", pb: "12px", px: "20px" }}>
        <Typography variant="h2" component="span">Change password</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: "20px !important", display: "flex", flexDirection: "column", gap: "20px" }}>
        {[
          { label: "Current password", placeholder: "Enter your current password", show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
          { label: "New password", placeholder: "Enter a new password", show: showNew, toggle: () => setShowNew((v) => !v) },
          { label: "Confirm your password", placeholder: "Re-enter your new password", show: showRetype, toggle: () => setShowRetype((v) => !v) },
        ].map(({ label, placeholder, show, toggle }) => (
          <Box key={label} sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>{label}</Typography>
              <IconButton size="small" onClick={toggle}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </IconButton>
            </Box>
            <TextField size="small" fullWidth type={show ? "text" : "password"} placeholder={placeholder} />
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={() => setPasswordOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => setPasswordOpen(false)}>Save</Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
}
