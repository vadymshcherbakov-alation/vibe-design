"use client";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterCheckboxListProps {
  options: FilterOption[];
  selectedValues: Set<string>;
  onChange: (value: string) => void;
  searchPlaceholder?: string;
}

export function FilterCheckboxList({
  options,
  selectedValues,
  onChange,
  searchPlaceholder = "Search",
}: FilterCheckboxListProps) {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;
    const lower = searchValue.toLowerCase();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(lower)
    );
  }, [options, searchValue]);

  const handleSelectAll = () => {
    filteredOptions.forEach((opt) => {
      if (!selectedValues.has(opt.value)) {
        onChange(opt.value);
      }
    });
  };

  const handleUnselectAll = () => {
    filteredOptions.forEach((opt) => {
      if (selectedValues.has(opt.value)) {
        onChange(opt.value);
      }
    });
  };

  return (
    <Box>
      <TextField
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={searchPlaceholder}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 1,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
          },
        }}
      />
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Button size="small" onClick={handleSelectAll}>
          Select all
        </Button>
        <Button size="small" onClick={handleUnselectAll}>
          Unselect all
        </Button>
      </Box>
      <Box sx={{ maxHeight: "300px", overflowY: "auto", ml: -1 }}>
        {filteredOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={selectedValues.has(option.value)}
                onChange={() => onChange(option.value)}
              />
            }
            label={option.label}
            sx={{
              display: "flex",
              my: 0.5,
              ml: 0,
              gap: "16px", // Figma spec: itemSpacing between checkbox and label
              "& .MuiFormControlLabel-label": {
                fontSize: "13px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
