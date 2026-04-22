"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { X, Minus } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

interface Parameter {
  id: string;
  name: string;
  value: string;
}

interface ToolData {
  name: string;
  description: string;
  url?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  authMethod?: "oauth2" | "apiKey";
  clientId?: string;
  clientSecret?: string;
  apiKey?: string;
  sendQueryParams?: boolean;
  sendHeader?: boolean;
  sendBody?: boolean;
  queryParams?: Parameter[];
  headers?: Parameter[];
  bodyParams?: Parameter[];
  smtp_config?: {
    host: string;
    port: number;
    use_tls: boolean;
    sender_email: string;
  };
  auth?: {
    username: string;
    password: string;
  };
}

interface AddToolModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (toolData: ToolData) => void;
  toolToEdit?: (ToolData & { id: string; type?: "REST" | "SMTP" }) | null;
}

type ToolType = "REST" | "SMTP";

export function AddToolModal({
  open,
  onClose,
  onSave,
  toolToEdit,
}: AddToolModalProps) {
  const theme = useTheme();
  const [toolType, setToolType] = useState<ToolType>("REST");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE" | "PATCH">("GET");
  const [authMethod, setAuthMethod] = useState<"oauth2" | "apiKey">("oauth2");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [sendQueryParams, setSendQueryParams] = useState(false);
  const [sendHeader, setSendHeader] = useState(false);
  const [sendBody, setSendBody] = useState(false);
  const [queryParams, setQueryParams] = useState<Parameter[]>([]);
  const [headers, setHeaders] = useState<Parameter[]>([]);
  const [bodyParams, setBodyParams] = useState<Parameter[]>([]);
  
  // SMTP-specific state
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [smtpUseTls, setSmtpUseTls] = useState<boolean>(true);
  const [smtpSenderEmail, setSmtpSenderEmail] = useState("");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");

  useEffect(() => {
    if (open) {
      if (toolToEdit) {
        // Set tool type based on toolToEdit.type or presence of smtp_config
        if (toolToEdit.type) {
          setToolType(toolToEdit.type);
        } else if (toolToEdit.smtp_config) {
          setToolType("SMTP");
        } else {
          setToolType("REST");
        }
        setName(toolToEdit.name);
        setDescription(toolToEdit.description);
        setUrl(toolToEdit.url || "");
        setMethod(toolToEdit.method || "GET");
        setAuthMethod(toolToEdit.authMethod || "oauth2");
        setClientId(toolToEdit.clientId || "");
        setClientSecret(toolToEdit.clientSecret || "");
        setApiKey(toolToEdit.apiKey || "");
        setSendQueryParams(toolToEdit.sendQueryParams || false);
        setSendHeader(toolToEdit.sendHeader || false);
        setSendBody(toolToEdit.sendBody || false);
        setQueryParams(toolToEdit.queryParams || []);
        setHeaders(toolToEdit.headers || []);
        setBodyParams(toolToEdit.bodyParams || []);
        // Load SMTP fields if present
        if (toolToEdit.smtp_config) {
          setSmtpHost(toolToEdit.smtp_config.host);
          setSmtpPort(toolToEdit.smtp_config.port);
          setSmtpUseTls(toolToEdit.smtp_config.use_tls);
          setSmtpSenderEmail(toolToEdit.smtp_config.sender_email);
        }
        if (toolToEdit.auth) {
          setSmtpUsername(toolToEdit.auth.username);
          setSmtpPassword(toolToEdit.auth.password);
        }
      } else {
        // Reset to defaults
        setToolType("REST");
        setName("");
        setDescription("");
        setUrl("");
        setMethod("GET");
        setAuthMethod("oauth2");
        setClientId("");
        setClientSecret("");
        setApiKey("");
        setSendQueryParams(false);
        setSendHeader(false);
        setSendBody(false);
        setQueryParams([]);
        setHeaders([]);
        setBodyParams([]);
        // Reset SMTP fields
        setSmtpHost("");
        setSmtpPort(587);
        setSmtpUseTls(true);
        setSmtpSenderEmail("");
        setSmtpUsername("");
        setSmtpPassword("");
      }
    }
  }, [open, toolToEdit]);

  const handleSave = () => {
    const toolData: ToolData = {
      name: name.trim(),
      description: description.trim(),
      ...(toolType === "REST"
        ? {
            url: url.trim(),
            method,
            authMethod,
            sendQueryParams,
            sendHeader,
            sendBody,
            ...(authMethod === "oauth2"
              ? {
                  clientId: clientId.trim(),
                  clientSecret: clientSecret.trim(),
                }
              : {
                  apiKey: apiKey.trim(),
                }),
            ...(sendQueryParams && queryParams.length > 0
              ? { queryParams }
              : {}),
            ...(sendHeader && headers.length > 0 ? { headers } : {}),
            ...(sendBody && bodyParams.length > 0 ? { bodyParams } : {}),
          }
        : {
            smtp_config: {
              host: smtpHost.trim(),
              port: smtpPort,
              use_tls: smtpUseTls,
              sender_email: smtpSenderEmail.trim(),
            },
            auth: {
              username: smtpUsername.trim(),
              password: smtpPassword.trim(),
            },
          }),
    };

    onSave(toolData);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setUrl("");
    setMethod("GET");
    setAuthMethod("oauth2");
    setClientId("");
    setClientSecret("");
    setApiKey("");
    setSendQueryParams(false);
    setSendHeader(false);
    setSendBody(false);
    setQueryParams([]);
    setHeaders([]);
    setBodyParams([]);
    setSmtpHost("");
    setSmtpPort(587);
    setSmtpUseTls(true);
    setSmtpSenderEmail("");
    setSmtpUsername("");
    setSmtpPassword("");
    onClose();
  };

  const canSave =
    toolType === "REST"
      ? name.trim().length > 0 && url.trim().length > 0
      : name.trim().length > 0 &&
        smtpHost.trim().length > 0 &&
        smtpSenderEmail.trim().length > 0 &&
        smtpUsername.trim().length > 0 &&
        smtpPassword.trim().length > 0;

  const addParameter = (
    setParams: React.Dispatch<React.SetStateAction<Parameter[]>>
  ) => {
    setParams((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", value: "" },
    ]);
  };

  const removeParameter = (
    setParams: React.Dispatch<React.SetStateAction<Parameter[]>>,
    id: string
  ) => {
    setParams((prev) => prev.filter((p) => p.id !== id));
  };

  const updateParameter = (
    setParams: React.Dispatch<React.SetStateAction<Parameter[]>>,
    id: string,
    field: "name" | "value",
    value: string
  ) => {
    setParams((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const ParameterRow = ({
    param,
    onUpdate,
    onRemove,
  }: {
    param: Parameter;
    onUpdate: (field: "name" | "value", value: string) => void;
    onRemove: () => void;
  }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        py: "16px",
      }}
    >
      <TextField
        placeholder="Name"
        value={param.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        size="small"
        sx={{
          width: "220px",
          "& .MuiOutlinedInput-root": {
            height: "36px",
            fontSize: "13px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.neutral[400],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />
      <TextField
        placeholder="value"
        value={param.value}
        onChange={(e) => onUpdate("value", e.target.value)}
        size="small"
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            height: "36px",
            fontSize: "13px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.neutral[400],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />
      <IconButton
        size="small"
        onClick={onRemove}
        sx={{
          width: "28px",
          height: "28px",
          color: theme.palette.text.secondary,
          "&:hover": {
            backgroundColor: theme.palette.neutral[100],
          },
        }}
      >
        <Minus size={16} />
      </IconButton>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "768px",
          maxWidth: "768px",
          borderRadius: "16px",
          boxShadow:
            "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "22px",
          pb: "16px",
          px: "24px",
        }}
      >
        <Typography variant="h2" component="span">
          {toolToEdit ? "Edit tool" : "Add tool"}
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Tool Type Segment Control */}
      <Box sx={{ px: "24px", pb: "16px" }}>
        <ToggleButtonGroup
          value={toolType}
          exclusive
          onChange={(_, newValue) => {
            if (newValue !== null) {
              setToolType(newValue as ToolType);
            }
          }}
          size="small"
          sx={{
            backgroundColor: theme.palette.neutral[100],
            borderRadius: "6px",
            p: "2px",
            "& .MuiToggleButtonGroup-grouped": {
              border: "none",
              borderRadius: "4px",
              px: "16px",
              py: 0,
              height: "32px",
              "&.Mui-selected": {
                backgroundColor: "#ffffff",
                boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.33)",
                "&:hover": {
                  backgroundColor: "#ffffff",
                },
              },
              "&:not(.Mui-selected)": {
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.neutral[100],
                },
              },
            },
          }}
        >
          <ToggleButton value="REST">REST</ToggleButton>
          <ToggleButton value="SMTP">SMTP</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Dialog Content */}
      <DialogContent sx={{ px: "24px", py: "16px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Name Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                mb: "4px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.15px",
              }}
            >
              Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Name your tool"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSave) {
                  handleSave();
                }
              }}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.neutral[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Box>

          {/* Description Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                mb: "4px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.15px",
              }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Instruction for LLM"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.neutral[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Box>

          {/* REST-specific fields */}
          {toolType === "REST" && (
            <>
              {/* URL Field */}
              <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                mb: "4px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.15px",
              }}
            >
              URL
            </Typography>
            <TextField
              fullWidth
              placeholder="http://example.com/get_list"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSave) {
                  handleSave();
                }
              }}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.neutral[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Box>

          {/* Method Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                mb: "8px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.15px",
              }}
            >
              Method
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={method}
                onChange={(e) =>
                  setMethod(e.target.value as "GET" | "POST" | "PUT" | "DELETE" | "PATCH")
                }
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.neutral[300],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.neutral[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
                <MenuItem value="PATCH">PATCH</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Authentication Method */}
          <Box>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "16px",
                  fontWeight: 400,
                  mb: "8px",
                  "&.Mui-focused": {
                    color: theme.palette.text.secondary,
                  },
                }}
              >
                Authentication method
              </FormLabel>
              <RadioGroup
                value={authMethod}
                onChange={(e) => setAuthMethod(e.target.value as "oauth2" | "apiKey")}
                sx={{ gap: "8px" }}
              >
                <FormControlLabel
                  value="oauth2"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        "&.Mui-checked": {
                          color: theme.palette.blue[600],
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.text.primary,
                      }}
                    >
                      OAuth 2 API
                    </Typography>
                  }
                  sx={{ margin: 0 }}
                />
                <FormControlLabel
                  value="apiKey"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        "&.Mui-checked": {
                          color: theme.palette.blue[600],
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.text.primary,
                      }}
                    >
                      API Key
                    </Typography>
                  }
                  sx={{ margin: 0 }}
                />
              </RadioGroup>
            </FormControl>

            {/* OAuth 2 Fields */}
            {authMethod === "oauth2" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", mt: "24px" }}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.15px",
                    }}
                  >
                    Client ID
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="client id"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.neutral[400],
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.15px",
                    }}
                  >
                    Client Secret
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Client Secret"
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.neutral[400],
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* API Key Field */}
            {authMethod === "apiKey" && (
              <Box sx={{ mt: "24px" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.15px",
                  }}
                >
                  API key
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter API key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.neutral[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Send Query Parameters Toggle */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                py: "8px",
              }}
            >
              <Switch
                checked={sendQueryParams}
                onChange={(e) => setSendQueryParams(e.target.checked)}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase": {
                    "&.Mui-checked": {
                      color: theme.palette.blue[600],
                      "& + .MuiSwitch-track": {
                        backgroundColor: theme.palette.blue[600],
                      },
                    },
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: theme.palette.neutral[500],
                  },
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.15px",
                }}
              >
                Send Query Parameters
              </Typography>
            </Box>
            {sendQueryParams && (
              <Box sx={{ mt: "4px" }}>
                {queryParams.map((param) => (
                  <ParameterRow
                    key={param.id}
                    param={param}
                    onUpdate={(field, value) =>
                      updateParameter(setQueryParams, param.id, field, value)
                    }
                    onRemove={() => removeParameter(setQueryParams, param.id)}
                  />
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addParameter(setQueryParams)}
                  sx={{
                    textTransform: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    height: "36px",
                    px: "16px",
                    color: "inherit",
                    borderColor: theme.palette.neutral[300],
                    "&:hover": {
                      borderColor: theme.palette.neutral[400],
                      backgroundColor: theme.palette.neutral[100],
                    },
                  }}
                >
                  Add parameter
                </Button>
              </Box>
            )}
          </Box>

          {/* Send Header Toggle */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                py: "8px",
              }}
            >
              <Switch
                checked={sendHeader}
                onChange={(e) => setSendHeader(e.target.checked)}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase": {
                    "&.Mui-checked": {
                      color: theme.palette.blue[600],
                      "& + .MuiSwitch-track": {
                        backgroundColor: theme.palette.blue[600],
                      },
                    },
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: theme.palette.neutral[500],
                  },
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.15px",
                }}
              >
                Send Header
              </Typography>
            </Box>
            {sendHeader && (
              <Box sx={{ mt: "4px" }}>
                {headers.map((param) => (
                  <ParameterRow
                    key={param.id}
                    param={param}
                    onUpdate={(field, value) =>
                      updateParameter(setHeaders, param.id, field, value)
                    }
                    onRemove={() => removeParameter(setHeaders, param.id)}
                  />
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addParameter(setHeaders)}
                  sx={{
                    textTransform: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    height: "36px",
                    px: "16px",
                    color: "inherit",
                    borderColor: theme.palette.neutral[300],
                    "&:hover": {
                      borderColor: theme.palette.neutral[400],
                      backgroundColor: theme.palette.neutral[100],
                    },
                  }}
                >
                  Add parameter
                </Button>
              </Box>
            )}
          </Box>

          {/* Send Body Toggle */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                py: "8px",
              }}
            >
              <Switch
                checked={sendBody}
                onChange={(e) => setSendBody(e.target.checked)}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase": {
                    "&.Mui-checked": {
                      color: theme.palette.blue[600],
                      "& + .MuiSwitch-track": {
                        backgroundColor: theme.palette.blue[600],
                      },
                    },
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: theme.palette.neutral[500],
                  },
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.15px",
                }}
              >
                Send Body
              </Typography>
            </Box>
            {sendBody && (
              <Box sx={{ mt: "4px" }}>
                {bodyParams.map((param) => (
                  <ParameterRow
                    key={param.id}
                    param={param}
                    onUpdate={(field, value) =>
                      updateParameter(setBodyParams, param.id, field, value)
                    }
                    onRemove={() => removeParameter(setBodyParams, param.id)}
                  />
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addParameter(setBodyParams)}
                  sx={{
                    textTransform: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    height: "36px",
                    px: "16px",
                    color: "inherit",
                    borderColor: theme.palette.neutral[300],
                    "&:hover": {
                      borderColor: theme.palette.neutral[400],
                      backgroundColor: theme.palette.neutral[100],
                    },
                  }}
                >
                  Add parameter
                </Button>
              </Box>
            )}
          </Box>
            </>
          )}

          {/* SMTP-specific fields */}
          {toolType === "SMTP" && (
            <>
              {/* SMTP Host Field */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.15px",
                  }}
                >
                  SMTP Host
                </Typography>
                <TextField
                  fullWidth
                  placeholder="smtp.example.com"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.neutral[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>

              {/* SMTP Port and Use TLS */}
              <Box sx={{ display: "flex", gap: "16px" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.15px",
                    }}
                  >
                    Port
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.neutral[400],
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", pt: "28px" }}>
                  <Switch
                    checked={smtpUseTls}
                    onChange={(e) => setSmtpUseTls(e.target.checked)}
                    size="small"
                    sx={{
                      "& .MuiSwitch-switchBase": {
                        "&.Mui-checked": {
                          color: theme.palette.blue[600],
                          "& + .MuiSwitch-track": {
                            backgroundColor: theme.palette.blue[600],
                          },
                        },
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: theme.palette.neutral[500],
                      },
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.15px",
                    }}
                  >
                    Use TLS
                  </Typography>
                </Box>
              </Box>

              {/* Sender Email Field */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.15px",
                  }}
                >
                  Sender Email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="sender@example.com"
                  value={smtpSenderEmail}
                  onChange={(e) => setSmtpSenderEmail(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.neutral[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>

              {/* Username Field */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.15px",
                  }}
                >
                  Username
                </Typography>
                <TextField
                  fullWidth
                  placeholder="SMTP username"
                  value={smtpUsername}
                  onChange={(e) => setSmtpUsername(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.neutral[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.15px",
                  }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="SMTP password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.neutral[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: "24px",
          pb: "24px",
          pt: "24px",
          justifyContent: "flex-end",
          gap: "8px",
          minHeight: "84px",
          alignItems: "flex-end",
        }}
      >
        <Button
          onClick={handleClose}
          variant="text"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            height: "36px",
            px: "16px",
            color: "inherit",
            "&:hover": {
              backgroundColor: theme.palette.neutral[100],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!canSave}
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            height: "36px",
            px: "16px",
            backgroundColor: theme.palette.blue[600],
            color: "#ffffff",
            "&:hover": {
              backgroundColor: theme.palette.blue[700],
            },
            "&:disabled": {
              backgroundColor: theme.palette.neutral[50],
              color: theme.palette.text.disabled,
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

