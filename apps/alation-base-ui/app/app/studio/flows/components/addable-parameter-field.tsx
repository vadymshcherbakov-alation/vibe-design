"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { X, Variable, Copy } from "lucide-react";
import { TypeBadge } from "./type-badge";

interface AddableParameterFieldProps {
  paramId: string;
  name: string;
  type: string;
  value: string;
  onNameChange: (paramId: string, name: string) => void;
  onTypeChange: (paramId: string, type: string) => void;
  onValueChange: (paramId: string, value: string) => void;
  onDelete: (paramId: string) => void;
  currentNodeId?: string;
}

const PARAMETER_TYPES = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "bool", label: "Boolean" },
  { value: "object", label: "Object" },
];

export function AddableParameterField({
  paramId,
  name,
  type,
  value,
  onNameChange,
  onTypeChange,
  onValueChange,
  onDelete,
  currentNodeId,
}: AddableParameterFieldProps) {
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState("");
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [copyToast, setCopyToast] = useState<{
    open: boolean;
    message: string;
    reference?: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-clear error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [errorMessage]);

  const renderValueInput = () => {
    if (type === "bool" || type === "boolean" || type === "Boolean") {
      return (
        <FormControl size="small" sx={{ flex: 1 }}>
          <Select
            value={value}
            onChange={(e) => onValueChange(paramId, e.target.value)}
            displayEmpty
            sx={{ height: "36px" }}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.disabled }}
                  >
                    Select default value
                  </Typography>
                );
              }
              return selected;
            }}
          >
            <MenuItem value="true">true</MenuItem>
            <MenuItem value="false">false</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (type === "number" || type === "Number") {
            if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
              onValueChange(paramId, newValue);
            }
          } else {
            onValueChange(paramId, newValue);
          }
        }}
        placeholder="Default value"
        size="small"
        fullWidth
        type={type === "number" || type === "Number" ? "number" : "text"}
      />
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      {/* Column 1 - Variable Icon (Copy on hover) */}
      <Tooltip title="Copy reference" arrow placement="top">
        <IconButton
          size="small"
          onMouseEnter={() => setIsIconHovered(true)}
          onMouseLeave={() => setIsIconHovered(false)}
          onClick={() => {
            if (!name) {
              setCopyToast({
                open: true,
                message: "Please enter a parameter name first",
                severity: "error",
              });
              return;
            }
            const reference = `{{start.${name}}}`;
            navigator.clipboard.writeText(reference);
            setCopyToast({
              open: true,
              message: "copied",
              reference: reference,
              severity: "success",
            });
          }}
          sx={{
            width: "36px",
            height: "36px",
            flexShrink: 0,
          }}
        >
          {isIconHovered ? (
            <Copy size={16} />
          ) : (
            <Variable size={16} color={theme.palette.text.secondary} />
          )}
        </IconButton>
      </Tooltip>

      {/* Column 2 - Input fields */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        {/* Row 1 - Name + Type (connected controls) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Name Input */}
          <TextField
            value={name}
            onChange={(e) => {
              let newValue = e.target.value;

              // Convert spaces to underscores
              newValue = newValue.replace(/ /g, "_");

              // Remove any characters that are not letters, numbers, or underscores
              const invalidChars = newValue.match(/[^a-zA-Z0-9_]/g);
              if (invalidChars) {
                setErrorMessage(
                  "Only letters, numbers, and underscores are allowed"
                );
                newValue = newValue.replace(/[^a-zA-Z0-9_]/g, "");
              }

              // Check if the name starts with a number
              if (newValue.length > 0 && /^\d/.test(newValue)) {
                setErrorMessage("Can't start with a number");
                // Remove leading numbers
                newValue = newValue.replace(/^\d+/, "");
              }

              // Limit to 30 characters
              if (newValue.length > 30) {
                setErrorMessage("Limited to 30 characters");
                newValue = newValue.slice(0, 30);
              }

              onNameChange(paramId, newValue);
            }}
            placeholder="Name"
            size="small"
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                height: "36px",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                "&.Mui-focused": {
                  zIndex: 1,
                },
              },
            }}
          />

          {/* Type Selector */}
          <FormControl size="small">
            <Select
              value={type}
              onChange={(e) => onTypeChange(paramId, e.target.value)}
              displayEmpty
              sx={{
                height: "36px",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                marginLeft: "-1px",
              }}
            >
              {PARAMETER_TYPES.map((typeOption) => (
                <MenuItem key={typeOption.value} value={typeOption.value}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <TypeBadge type={typeOption.value} />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Row 2 - Value Input */}
        <Box>{renderValueInput()}</Box>

        {/* Inline Error Message */}
        {errorMessage && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.error.main,
            }}
          >
            {errorMessage}
          </Typography>
        )}
      </Box>

      {/* Column 3 - Delete Button */}
      <Tooltip title="Delete parameter" arrow placement="top">
        <IconButton
          size="small"
          onClick={() => onDelete(paramId)}
          sx={{
            marginTop: "4px",
          }}
        >
          <X size={16} />
        </IconButton>
      </Tooltip>

      {/* Copy Toast */}
      <Snackbar
        open={copyToast.open}
        autoHideDuration={2000}
        onClose={() => setCopyToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCopyToast((prev) => ({ ...prev, open: false }))}
          severity={copyToast.severity}
          variant="filled"
        >
          {copyToast.reference ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box
                component="span"
                sx={{
                  color: theme.palette.green[300],
                  fontWeight: 500,
                }}
              >
                {copyToast.reference}
              </Box>
              <span>{copyToast.message}</span>
            </Box>
          ) : (
            copyToast.message
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
}
