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
  Select,
  MenuItem,
  FormControl,
  Divider,
  TextField,
  Switch,
} from "@mui/material";
import { X } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useMemo } from "react";
import { TypeBadge } from "../../../components/type-badge";

interface NewScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (schedule: {
    frequency: string;
    time: string;
    timezone: string;
    enabled: boolean;
    selectedDays?: string[];
    selectedDayOfMonth?: number;
    parameters: Record<string, string>;
  }) => void;
}

// Mock workflow parameters
interface WorkflowParameter {
  name: string;
  type: string;
  description?: string;
}

const mockParameters: WorkflowParameter[] = [
  {
    name: "query",
    type: "string",
    description: "Search query to execute",
  },
  {
    name: "maxResults",
    type: "number",
    description: "Maximum number of results to return",
  },
  {
    name: "enableCache",
    type: "boolean",
    description: "Whether to use cached results",
  },
  {
    name: "filters",
    type: "object",
    description: "JSON object containing filter criteria",
  },
  {
    name: "timeout",
    type: "number",
    description: "Request timeout in seconds",
  },
];

type FrequencyOption = "daily" | "weekly" | "monthly";

const frequencyOptions: { value: FrequencyOption; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

// Generate time options (00:00 to 23:59 in 30-minute intervals)
const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour.toString().padStart(2, "0");
      const m = minute.toString().padStart(2, "0");
      times.push(`${h}:${m}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

// Calculate next run date based on frequency and time
const calculateNextRun = (
  frequency: FrequencyOption,
  time: string,
  timezone: string
): string => {
  const now = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  
  // Create a date for today at the specified time
  const todayAtTime = new Date(now);
  todayAtTime.setUTCHours(hours || 0, minutes || 0, 0, 0);
  
  let nextRun = new Date(todayAtTime);
  
  if (frequency === "daily") {
    // If time has passed today, schedule for tomorrow
    if (now >= todayAtTime) {
      nextRun.setUTCDate(nextRun.getUTCDate() + 1);
    }
  } else if (frequency === "weekly") {
    // Schedule for next Monday
    const daysUntilMonday = (8 - now.getUTCDay()) % 7 || 7;
    nextRun.setUTCDate(nextRun.getUTCDate() + daysUntilMonday);
  } else if (frequency === "monthly") {
    // Schedule for 1st of next month
    nextRun.setUTCMonth(nextRun.getUTCMonth() + 1);
    nextRun.setUTCDate(1);
  } else {
    // For custom, just use tomorrow
    nextRun.setUTCDate(nextRun.getUTCDate() + 1);
  }
  
  // Format the date
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[nextRun.getUTCMonth()];
  const day = nextRun.getUTCDate();
  const year = nextRun.getUTCFullYear();
  const hour12 = nextRun.getUTCHours() % 12 || 12;
  const ampm = nextRun.getUTCHours() >= 12 ? "pm" : "am";
  const displayMinutes = (minutes || 0).toString().padStart(2, "0");
  
  return `${month} ${day}, ${year} at ${hour12}:${displayMinutes}${ampm} ${timezone}`;
};

// Day names mapping
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayFullNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Generate summary text
const generateSummary = (
  frequency: FrequencyOption,
  time: string,
  timezone: string,
  selectedDays?: string[],
  selectedDayOfMonth?: number
): string => {
  if (frequency === "daily") {
    return `Every day at ${time} ${timezone}`;
  } else if (frequency === "weekly") {
    if (selectedDays && selectedDays.length > 0) {
      const dayIndices = selectedDays.map((day) => dayNames.indexOf(day));
      const sortedDays = dayIndices
        .sort((a, b) => a - b)
        .map((idx) => dayFullNames[idx]);
      if (sortedDays.length === 1) {
        return `Weekly on ${sortedDays[0]} at ${time} ${timezone}`;
      } else if (sortedDays.length === 2) {
        return `Weekly on ${sortedDays[0]} and ${sortedDays[1]} at ${time} ${timezone}`;
      } else {
        const lastDay = sortedDays.pop();
        return `Weekly on ${sortedDays.join(", ")}, and ${lastDay} at ${time} ${timezone}`;
      }
    }
    return `Weekly at ${time} ${timezone}`;
  } else if (frequency === "monthly") {
    if (selectedDayOfMonth) {
      const daySuffix =
        selectedDayOfMonth === 1
          ? "st"
          : selectedDayOfMonth === 2
          ? "nd"
          : selectedDayOfMonth === 3
          ? "rd"
          : "th";
      return `Monthly on the ${selectedDayOfMonth}${daySuffix} at ${time} ${timezone}`;
    }
    return `Monthly on the 1st at ${time} ${timezone}`;
  }
  return "";
};

export function NewScheduleDialog({
  open,
  onClose,
  onSave,
}: NewScheduleDialogProps) {
  const theme = useTheme();
  const [frequency, setFrequency] = useState<FrequencyOption>("daily");
  const [time, setTime] = useState("19:00");
  const [timezone] = useState("PST");
  const [enabled, setEnabled] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<number>(1);
  const [parameterValues, setParameterValues] = useState<
    Record<string, string>
  >({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFrequency("daily");
      setTime("19:00");
      setEnabled(true);
      setSelectedDays([]);
      setSelectedDayOfMonth(1);
      // Initialize parameter values
      const initialValues: Record<string, string> = {};
      mockParameters.forEach((param) => {
        initialValues[param.name] = "";
      });
      setParameterValues(initialValues);
    }
  }, [open]);

  // Reset selected days when frequency changes away from weekly
  useEffect(() => {
    if (frequency !== "weekly") {
      setSelectedDays([]);
    }
  }, [frequency]);

  const nextRun = useMemo(
    () => calculateNextRun(frequency, time, timezone),
    [frequency, time, timezone]
  );

  const summary = useMemo(
    () =>
      generateSummary(
        frequency,
        time,
        timezone,
        selectedDays,
        selectedDayOfMonth
      ),
    [frequency, time, timezone, selectedDays, selectedDayOfMonth]
  );

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleParameterChange = (name: string, value: string) => {
    setParameterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave({
      frequency,
      time,
      timezone,
      enabled,
      selectedDays: frequency === "weekly" ? selectedDays : undefined,
      selectedDayOfMonth:
        frequency === "monthly" ? selectedDayOfMonth : undefined,
      parameters: parameterValues,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          New schedule
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ px: "20px", py: "20px", maxHeight: "70vh", overflowY: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Schedule Section */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                mb: "20px",
                color: theme.palette.text.primary,
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              Schedule
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Frequency Field */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: "8px",
                    color: theme.palette.text.primary,
                  }}
                >
                  Frequency
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={frequency}
                    onChange={(e) =>
                      setFrequency(e.target.value as FrequencyOption)
                    }
                    displayEmpty
                    sx={{
                      height: "36px",
                      fontSize: "13px",
                    }}
                  >
                    {frequencyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Weekly Day Selection */}
              {frequency === "weekly" && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: "8px",
                      color: theme.palette.text.primary,
                    }}
                  >
                    On
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "2px",
                      flexWrap: "wrap",
                    }}
                  >
                    {dayNames.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <Button
                          key={day}
                          variant={isSelected ? "contained" : "outlined"}
                          onClick={() => handleDayToggle(day)}
                          sx={{
                            minWidth: "auto",
                            px: "16px",
                            py: "8px",
                            height: "36px",
                            fontSize: "13px",
                            fontWeight: 500,
                            textTransform: "none",
                            borderColor: theme.palette.neutral[300],
                            color: isSelected
                              ? theme.palette.neutral[50]
                              : theme.palette.text.primary,
                            backgroundColor: isSelected
                              ? theme.palette.blue[600]
                              : "transparent",
                            "&:hover": {
                              backgroundColor: isSelected
                                ? theme.palette.blue[600]
                                : "rgba(0, 0, 0, 0.04)",
                              borderColor: isSelected
                                ? theme.palette.blue[600]
                                : theme.palette.neutral[400],
                            },
                            ...(isSelected && {
                              boxShadow: `0px 0px 0px 1px ${"#ffffff"}, 0px 0px 0px 3px ${theme.palette.blue[900]}`,
                            }),
                          }}
                        >
                          {day}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Monthly Day Selection */}
              {frequency === "monthly" && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: "8px",
                      color: theme.palette.text.primary,
                    }}
                  >
                    On
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: "120px" }}>
                    <Select
                      value={selectedDayOfMonth}
                      onChange={(e) =>
                        setSelectedDayOfMonth(Number(e.target.value))
                      }
                      sx={{
                        height: "36px",
                        fontSize: "13px",
                      }}
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => {
                          const daySuffix =
                            day === 1
                              ? "st"
                              : day === 2
                              ? "nd"
                              : day === 3
                              ? "rd"
                              : "th";
                          return (
                            <MenuItem key={day} value={day}>
                              {day}
                              {daySuffix}
                            </MenuItem>
                          );
                        }
                      )}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Time Field */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: "8px",
                    color: theme.palette.text.primary,
                  }}
                >
                  On time
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <Select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      displayEmpty
                      sx={{
                        height: "36px",
                        fontSize: "13px",
                      }}
                    >
                      {timeOptions.map((timeOption) => (
                        <MenuItem key={timeOption} value={timeOption}>
                          {timeOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      fontSize: "14px",
                    }}
                  >
                    PST
                  </Typography>
                </Box>
              </Box>

              {/* Next Run Display */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: "8px",
                    color: theme.palette.text.primary,
                    fontSize: "14px",
                  }}
                >
                  Next run
                </Typography>
                <Box
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      fontSize: "14px",
                    }}
                  >
                    {nextRun}
                  </Typography>
                </Box>
              </Box>

              {/* Summary Display */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: "8px",
                    color: theme.palette.text.primary,
                    fontSize: "14px",
                  }}
                >
                  Summary
                </Typography>
                <Box
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      fontSize: "14px",
                    }}
                  >
                    {summary}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Divider */}
          <Divider />

          {/* Runtime Parameters Section */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                mb: "20px",
                color: theme.palette.text.primary,
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              Runtime parameters
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {mockParameters.map((param) => (
                <Box key={param.name}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      mb: "8px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.primary,
                      }}
                    >
                      {param.name}
                    </Typography>
                    <TypeBadge type={param.type} />
                  </Box>
                  {param.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: "8px",
                        fontSize: "12px",
                      }}
                    >
                      {param.description}
                    </Typography>
                  )}
                  {param.type === "boolean" ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={parameterValues[param.name] || ""}
                        onChange={(e) =>
                          handleParameterChange(param.name, e.target.value)
                        }
                        displayEmpty
                        sx={{
                          height: "36px",
                          fontSize: "13px",
                        }}
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Typography
                                sx={{
                                  color: theme.palette.text.disabled,
                                  fontSize: "13px",
                                }}
                              >
                                Select
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
                  ) : (
                    <TextField
                      fullWidth
                      value={parameterValues[param.name] || ""}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // For number type, only allow numeric input
                        if (param.type === "number") {
                          if (
                            newValue === "" ||
                            /^-?\d*\.?\d*$/.test(newValue)
                          ) {
                            handleParameterChange(param.name, newValue);
                          }
                        } else {
                          handleParameterChange(param.name, newValue);
                        }
                      }}
                      placeholder={`Enter ${param.name}`}
                      size="small"
                      type={param.type === "number" ? "number" : "text"}
                      multiline={param.type === "object"}
                      rows={param.type === "object" ? 3 : 1}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: "20px",
          pt: "12px",
          pb: "20px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              fontSize: "13px",
            }}
          >
            Enable
          </Typography>
          <Switch
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Button variant="text" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

