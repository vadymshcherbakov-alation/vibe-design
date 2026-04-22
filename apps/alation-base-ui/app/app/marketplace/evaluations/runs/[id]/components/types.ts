import { keyframes } from "@mui/material";

export interface Run {
  evalId: string;
  evalName: string;
  runAt: string;
  status: "completed" | "running" | "failed" | "pending";
  accuracy: number | null;
  averageDuration: number | null;
  numberOfQuestions: number;
  passedQuestions: number | null;
  agentId: string;
  createdBy: string;
}

export interface Question {
  id: string;
  question: string;
  dataProductId: string;
  sql: string;
  createdDate: string;
  agentId: string;
}

export interface EvalQuestion extends Question {
  passed: boolean;
}

export interface DataProduct {
  id: string;
  name: string;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  description: string;
}

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
`;

export const getStatusConfig = (status: Run["status"], theme: any) => {
  const statusConfig = {
    completed: {
      backgroundColor: theme.palette.green[200],
      color: theme.palette.success.main,
      dotColor: "#80CBC4",
      label: "Completed",
    },
    running: {
      backgroundColor: theme.palette.blue[200],
      color: theme.palette.info.main,
      dotColor: "#2196F3",
      label: "Running",
    },
    failed: {
      backgroundColor: theme.palette.red[200],
      color: theme.palette.error.main,
      dotColor: "#EF5350",
      label: "Failed",
    },
    pending: {
      backgroundColor: theme.palette.neutral[200],
      color: theme.palette.text.secondary,
      dotColor: "#9E9E9E",
      label: "Pending",
    },
  };
  return statusConfig[status];
};

// Helper function to format date and time
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${month}/${day}/${year}, ${displayHours}:${minutes}:${seconds} ${ampm}`;
};

export const formatDuration = (milliseconds: number | null) => {
  if (milliseconds === null) return null;
  const seconds = Math.round(milliseconds / 1000);
  return `${seconds} seconds`;
};

export const formatDateAndTime = (dateString: string) => {
  const date = new Date(dateString);
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Los_Angeles",
  });
  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
  };
};
