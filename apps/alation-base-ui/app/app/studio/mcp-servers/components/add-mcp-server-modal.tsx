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
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { X, Plus, Trash2 } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

interface BasicAuth {
  username: string;
  password: string;
}

interface Header {
  name: string;
  value: string;
}

interface OAuth {
  flowType: "credentials" | "authorization_code";
  tokenUrl?: string;
  clientId: string;
  clientSecret?: string;
  authorizationUrl?: string;
  redirectUri?: string;
}

interface McpServerData {
  name: string;
  url: string;
  description?: string;
  basicAuth?: BasicAuth;
  headers?: Header[];
  oauth?: OAuth;
}

interface AddMcpServerModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (serverData: McpServerData) => void;
  serverToEdit?: {
    id: string;
    name: string;
    url: string;
    description?: string;
    basicAuth?: BasicAuth;
    headers?: Header[];
    oauth?: OAuth;
  } | null;
}

export function AddMcpServerModal({
  open,
  onClose,
  onAdd,
  serverToEdit,
}: AddMcpServerModalProps) {
  const theme = useTheme();
  const [serverName, setServerName] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [urlError, setUrlError] = useState("");
  const [urlTouched, setUrlTouched] = useState(false);
  const [authMethod, setAuthMethod] = useState<"basic" | "headers" | "oauth">("basic");
  const [headers, setHeaders] = useState<Header[]>([]);
  const [tokenUrl, setTokenUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [oauthFlowType, setOauthFlowType] = useState<"credentials" | "authorization_code">("credentials");
  const [authorizationUrl, setAuthorizationUrl] = useState("");
  const [redirectUri] = useState("https://app.example.com/oauth/callback");
  const [isTesting, setIsTesting] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (open) {
      if (serverToEdit) {
        setServerName(serverToEdit.name);
        setServerUrl(serverToEdit.url);
        setDescription(serverToEdit.description || "");
        setUsername(serverToEdit.basicAuth?.username || "");
        setPassword(serverToEdit.basicAuth?.password || "");
        setHeaders(serverToEdit.headers || []);
        setTokenUrl(serverToEdit.oauth?.tokenUrl || "");
        setClientId(serverToEdit.oauth?.clientId || "");
        setClientSecret(serverToEdit.oauth?.clientSecret || "");
        setOauthFlowType(serverToEdit.oauth?.flowType || "credentials");
        setAuthorizationUrl(serverToEdit.oauth?.authorizationUrl || "");
        // redirectUri is read-only with default value
        setAuthMethod(
          serverToEdit.basicAuth
            ? "basic"
            : serverToEdit.headers
            ? "headers"
            : serverToEdit.oauth
            ? "oauth"
            : "basic"
        );
      } else {
        setServerName("");
        setServerUrl("");
        setDescription("");
        setUsername("");
        setPassword("");
        setHeaders([]);
        setTokenUrl("");
        setClientId("");
        setClientSecret("");
        setOauthFlowType("credentials");
        setAuthorizationUrl("");
        // redirectUri is read-only with default value
        setAuthMethod("basic");
      }
      setUrlError("");
      setUrlTouched(false);
      setIsTesting(false);
      setAuthError("");
    }
  }, [open, serverToEdit]);

  useEffect(() => {
    if (urlTouched) {
      if (!serverUrl.trim()) {
        setUrlError("Server URL is required");
      } else {
        setUrlError("");
      }
    }
  }, [serverUrl, urlTouched]);

  const handleAdd = async () => {
    // Validate URL
    if (!serverUrl.trim()) {
      setUrlTouched(true);
      setUrlError("Server URL is required");
      return;
    }

    if (serverName.trim() && serverUrl.trim()) {
      setIsTesting(true);
      setAuthError("");

      // Simulate testing the connection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate auth failure (prototype)
      setAuthError("Authentication failed");
      setIsTesting(false);
      return;

      // Uncomment below when ready to actually create
      /*
      const basicAuth =
        authMethod === "basic" && username.trim() && password.trim()
          ? {
              username: username.trim(),
              password: password.trim(),
            }
          : undefined;

      const headersData =
        authMethod === "headers" && headers.length > 0
          ? headers.filter((h) => h.name.trim() && h.value.trim())
          : undefined;

      const oauthData =
        authMethod === "oauth"
          ? oauthFlowType === "credentials" &&
            tokenUrl.trim() &&
            clientId.trim() &&
            clientSecret.trim()
            ? {
                flowType: "credentials" as const,
                tokenUrl: tokenUrl.trim(),
                clientId: clientId.trim(),
                clientSecret: clientSecret.trim(),
              }
            : oauthFlowType === "authorization_code" &&
              authorizationUrl.trim() &&
              redirectUri.trim()
            ? {
                flowType: "authorization_code" as const,
                authorizationUrl: authorizationUrl.trim(),
                redirectUri: redirectUri.trim(),
              }
            : undefined
          : undefined;

      onAdd({
        name: serverName.trim(),
        url: serverUrl.trim(),
        description: description.trim() || undefined,
        basicAuth,
        headers: headersData,
        oauth: oauthData,
      });
      setServerName("");
      setServerUrl("");
      setDescription("");
      setUsername("");
      setPassword("");
      setHeaders([]);
      setTokenUrl("");
      setClientId("");
      setClientSecret("");
      setOauthFlowType("credentials");
      setAuthorizationUrl("");
      setAuthMethod("basic");
      setUrlError("");
      setUrlTouched(false);
      setIsTesting(false);
      setAuthError("");
      onClose();
      */
    }
  };

  const handleClose = () => {
      setServerName("");
      setServerUrl("");
      setDescription("");
      setUsername("");
      setPassword("");
      setHeaders([]);
      setTokenUrl("");
      setClientId("");
      setClientSecret("");
      setOauthFlowType("credentials");
      setAuthorizationUrl("");
      setAuthMethod("basic");
      setUrlError("");
      setUrlTouched(false);
      setIsTesting(false);
      setAuthError("");
      onClose();
  };

  const canAdd = serverName.trim().length > 0 && serverUrl.trim().length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "480px",
          maxWidth: "480px",
          borderRadius: "12px",
          boxShadow:
            "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "20px",
          pb: "12px",
          px: "20px",
        }}
      >
        <Typography variant="h2" component="span">
          {serverToEdit ? "Edit MCP server" : "Add MCP server"}
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ px: "20px", py: "12px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Server URL */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                mb: "8px",
              }}
            >
              Server URL
            </Typography>
            <TextField
              autoFocus
              fullWidth
              placeholder="https://example.com/mcp"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              onBlur={() => setUrlTouched(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdd) {
                  handleAdd();
                }
              }}
              error={!!urlError}
              helperText={urlError}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: urlError
                      ? theme.palette.error.main
                      : theme.palette.neutral[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: urlError
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                  },
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.error.main,
                  },
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: 0,
                  marginTop: "4px",
                },
              }}
            />
          </Box>

          {/* Name */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                mb: "8px",
              }}
            >
              Name
            </Typography>
            <TextField
              fullWidth
              placeholder="mcp server 1"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdd) {
                  handleAdd();
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

          {/* Description (optional) */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                mb: "8px",
              }}
            >
              Description
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  ml: "4px",
                }}
              >
                (optional)
              </Typography>
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
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

          {/* Authentication Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                mb: "8px",
              }}
            >
              Authentication
            </Typography>
            <ToggleButtonGroup
              value={authMethod}
              exclusive
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setAuthMethod(newValue);
                }
              }}
              size="small"
              sx={{
                backgroundColor: theme.palette.neutral[100],
                borderRadius: "6px",
                padding: "2px",
                gap: "2px",
                "& .MuiToggleButtonGroup-grouped": {
                  border: "none",
                  "&:not(:first-of-type)": {
                    borderRadius: "4px",
                    marginLeft: "0px",
                  },
                  "&:first-of-type": {
                    borderRadius: "4px",
                  },
                },
                "& .MuiToggleButton-root": {
                  padding: "4px 12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "none",
                  border: "none",
                  color: theme.palette.text.primary,
                  borderRadius: "4px",
                  "&.Mui-selected": {
                    backgroundColor: "#ffffff",
                    color: theme.palette.text.primary,
                    boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.33)",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                    },
                  },
                  "&:not(.Mui-selected):hover": {
                    backgroundColor: theme.palette.neutral[100],
                  },
                },
              }}
            >
              <ToggleButton value="basic">Basic</ToggleButton>
              <ToggleButton value="headers">Headers</ToggleButton>
              <ToggleButton value="oauth">OAuth</ToggleButton>
            </ToggleButtonGroup>
            {authMethod === "basic" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", mt: "16px" }}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.primary,
                      mb: "8px",
                    }}
                  >
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                      color: theme.palette.text.primary,
                      mb: "8px",
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            {authMethod === "headers" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", mt: "16px" }}>
                {headers.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      py: "8px",
                    }}
                  >
                    No custom headers configured
                  </Typography>
                ) : (
                  headers.map((header, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                        <TextField
                          fullWidth
                          placeholder="Header Name"
                          value={header.name}
                          onChange={(e) => {
                            const newHeaders = [...headers];
                            if (newHeaders[index]) {
                              newHeaders[index].name = e.target.value;
                              setHeaders(newHeaders);
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
                        <TextField
                          fullWidth
                          placeholder="Header Value"
                          value={header.value}
                          onChange={(e) => {
                            const newHeaders = [...headers];
                            if (newHeaders[index]) {
                              newHeaders[index].value = e.target.value;
                              setHeaders(newHeaders);
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
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newHeaders = headers.filter((_, i) => i !== index);
                          setHeaders(newHeaders);
                        }}
                        sx={{
                          mt: "4px",
                          padding: "4px",
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  ))
                )}
                <Button
                  variant="outlined"
                  startIcon={<Plus size={16} />}
                  onClick={() => {
                    setHeaders([...headers, { name: "", value: "" }]);
                  }}
                  sx={{
                    alignSelf: "flex-start",
                    textTransform: "none",
                  }}
                >
                  Add header
                </Button>
              </Box>
            )}
            {authMethod === "oauth" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", mt: "16px" }}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.primary,
                      mb: "8px",
                    }}
                  >
                    Type
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={oauthFlowType}
                      onChange={(e) =>
                        setOauthFlowType(
                          e.target.value as "credentials" | "authorization_code"
                        )
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
                      <MenuItem value="credentials">Credentials</MenuItem>
                      <MenuItem value="authorization_code">Authorization Code</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {oauthFlowType === "credentials" ? (
                  <>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Token URL
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter token URL"
                        value={tokenUrl}
                        onChange={(e) => setTokenUrl(e.target.value)}
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
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Client ID
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter client ID"
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
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Client Secret
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter client secret"
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
                  </>
                ) : (
                  <>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Authorization URL
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter authorization URL"
                        value={authorizationUrl}
                        onChange={(e) => setAuthorizationUrl(e.target.value)}
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
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Redirect URI
                      </Typography>
                      <TextField
                        fullWidth
                        value={redirectUri}
                        InputProps={{ readOnly: true }}
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: theme.palette.neutral[50],
                            "& fieldset": {
                              borderColor: theme.palette.neutral[200],
                            },
                            "& input": {
                              cursor: "default",
                              WebkitTextFillColor: theme.palette.text.primary,
                            },
                            "&:hover fieldset": {
                              borderColor: theme.palette.neutral[200],
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.neutral[200],
                            },
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          mt: "4px",
                          fontSize: "12px",
                        }}
                      >
                        Configure your OAuth provider to use this redirect URL
                      </Typography>
                    </Box>
                    <Box>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          // TODO: Implement authorization flow
                        }}
                        sx={{
                          alignSelf: "flex-start",
                          textTransform: "none",
                        }}
                      >
                        Authorize
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>
        {authError && (
          <Alert
            severity="error"
            sx={{
              mt: "16px",
              "& .MuiAlert-message": {
                fontSize: "13px",
              },
            }}
          >
            {authError}
          </Alert>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: "20px",
          pb: "20px",
          pt: "12px",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <Button onClick={handleClose} variant="text" color="inherit" disabled={isTesting}>
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!canAdd || isTesting}
          startIcon={isTesting ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {isTesting
            ? "Testing..."
            : serverToEdit
            ? "Save"
            : "Test and create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

