"use client";

import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Checkbox,
  Select,
  MenuItem,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Search, X, ArrowUp, Code } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { SelectAgentModal } from "./select-agent-modal";
import { EvalDetailsModal } from "./eval-details-modal";
import { CreateEvalRunStepper } from "./create-eval-run-stepper";

/* Types */
interface DataProduct {
  id: string;
  name: string;
}

interface Question {
  id: string;
  question: string;
  dataProductId: string;
  sql: string;
  createdDate: string;
  agentId: string;
  creator: string;
}

interface Run {
  evalId: string;
  evalName: string;
  runAt: string;
  status: string;
}

interface Agent {
  id: string;
  name: string;
  type: "Agent";
  description: string;
}

export interface CreateEvalRunModalProps {
  open: boolean;
  onClose: () => void;
  agents: Agent[];
  questions: Question[];
  dataProducts: DataProduct[];
  runs: Run[];
  onSuccess?: () => void;
  /** "canvas" = lay out all 4 steps on the page (no modals). Ignores open/onClose. */
  variant?: "modal" | "canvas";
}

/* Helpers */
function getInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "??";
  const parts = trimmed.split(" ").filter((p) => p.length > 0);
  if (parts.length >= 2) {
    const first = parts[0]?.[0];
    const last = parts[parts.length - 1]?.[0];
    if (first && last) return `${first}${last}`.toUpperCase();
  }
  return trimmed.substring(0, 2).toUpperCase();
}

function getUserColor(name: string) {
  const colors = [
    "#1976D2",
    "#388E3C",
    "#F57C00",
    "#7B1FA2",
    "#C2185B",
    "#00796B",
    "#5D4037",
    "#455A64",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatDateAndTime(dateString: string) {
  const date = new Date(dateString);
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
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
    timezone: "PST",
  };
}

export function CreateEvalRunModal({
  open,
  onClose,
  agents,
  questions,
  dataProducts,
  runs,
  onSuccess,
  variant = "modal",
}: CreateEvalRunModalProps) {
  const theme = useTheme();
  const isCanvas = variant === "canvas";

  /* Step visibility */
  const [step1Open, setStep1Open] = useState(false);
  const [step2Open, setStep2Open] = useState(false);
  const [step3Open, setStep3Open] = useState(false);

  /* Step 1 – Select Agent */
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [focusedAgentId, setFocusedAgentId] = useState<string | null>(null);
  const [isValidatingEval, setIsValidatingEval] = useState(false);
  const [dataProductsToValidate, setDataProductsToValidate] = useState<string[]>([]);
  const [validatedDataProducts, setValidatedDataProducts] = useState<Set<string>>(new Set());

  /* Step 2 – Select Questions */
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalSelectedDataProducts, setModalSelectedDataProducts] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sqlPopoverAnchor, setSqlPopoverAnchor] = useState<HTMLElement | null>(null);
  const [sqlPopoverQuestionId, setSqlPopoverQuestionId] = useState<string | null>(null);

  /* Step 3 & 4 – Eval details & Validate */
  const [evalName, setEvalName] = useState("");
  const [agentInputs, setAgentInputs] = useState<Record<string, string>>({});
  const [modalSelectedQuestions, setModalSelectedQuestions] = useState<Question[]>([]);
  const [isValidatingInModal, setIsValidatingInModal] = useState(false);
  const [validatedDataProductsStep4, setValidatedDataProductsStep4] = useState<Set<string>>(new Set());
  const [failedDataProducts, setFailedDataProducts] = useState<Set<string>>(new Set());
  const [preExecSqlMap, setPreExecSqlMap] = useState<Map<string, string>>(new Map());
  const [forceShowStep4, setForceShowStep4] = useState(false);

  const dataProductsMap = useMemo(() => {
    const map = new Map<string, string>();
    dataProducts.forEach((dp) => map.set(dp.id, dp.name));
    return map;
  }, [dataProducts]);

  const getDataProductName = (id: string) => dataProductsMap.get(id) || id;

  const filteredModalQuestions = useMemo(() => {
    let filtered = [...questions];
    if (modalSearchTerm.trim()) {
      const lower = modalSearchTerm.toLowerCase();
      filtered = filtered.filter((q) => q.question.toLowerCase().includes(lower));
    }
    if (modalSelectedDataProducts.length > 0) {
      filtered = filtered.filter((q) => modalSelectedDataProducts.includes(q.dataProductId));
    }
    return filtered;
  }, [questions, modalSearchTerm, modalSelectedDataProducts]);

  const isValidationComplete =
    (validatedDataProductsStep4.size + failedDataProducts.size === 8 ||
      validatedDataProductsStep4.size === 8) &&
    !isValidatingInModal;

  /* When parent open becomes true, show step 1 */
  useEffect(() => {
    if (open) {
      setStep1Open(true);
      setStep2Open(false);
      setStep3Open(false);
      setSelectedAgent(null);
      setEvalName("");
      setModalSearchTerm("");
      setModalSelectedDataProducts([]);
      setSelectedRows(new Set());
      setValidatedDataProducts(new Set());
      setValidatedDataProductsStep4(new Set());
      setFailedDataProducts(new Set());
      setPreExecSqlMap(new Map());
      setForceShowStep4(false);
      setModalSelectedQuestions([]);
      setDataProductsToValidate([]);
    }
  }, [open]);

  /* Default eval name when step 1 opens */
  useEffect(() => {
    if (open && step1Open) {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const d = String(today.getDate()).padStart(2, "0");
      const prefix = `${y}-${m}-${d}`;
      const existing = runs.filter((r) => r.evalName.startsWith(`eval-${prefix}-`));
      setEvalName(`eval-${prefix}-${existing.length + 1}`);
    }
  }, [open, step1Open, runs]);

  const handleClose = () => {
    if (!isValidatingInModal && !isValidatingEval) {
      setStep1Open(false);
      setStep2Open(false);
      setStep3Open(false);
      setSelectedAgent(null);
      setEvalName("");
      setValidatedDataProducts(new Set());
      setValidatedDataProductsStep4(new Set());
      setFailedDataProducts(new Set());
      setPreExecSqlMap(new Map());
      setModalSelectedQuestions([]);
      setDataProductsToValidate([]);
      onClose();
    }
  };

  const handleStep1Close = () => {
    if (!isValidatingEval) {
      setStep1Open(false);
      setSelectedAgent(null);
      setEvalName("");
      setValidatedDataProducts(new Set());
      setFailedDataProducts(new Set());
      setDataProductsToValidate([]);
      setPreExecSqlMap(new Map());
      onClose();
    }
  };

  const handleAgentSelect = (agentId: string) => {
    setFocusedAgentId(agentId);
    setSelectedAgent(agentId);
    setStep1Open(false);
    setStep2Open(true);
  };

  const handleStep2Close = () => {
    setStep2Open(false);
    setSelectedAgent(null);
    setModalSearchTerm("");
    setModalSelectedDataProducts([]);
    setSelectedRows(new Set());
  };

  const handleStep2Back = () => {
    setStep2Open(false);
    setModalSearchTerm("");
    setModalSelectedDataProducts([]);
    setStep1Open(true);
  };

  const handleStep2Continue = () => {
    const selected = questions.filter((q) => selectedRows.has(q.id));
    const uniqueDpIds = [...new Set(selected.map((q) => q.dataProductId))];
    setModalSelectedQuestions(selected);
    setDataProductsToValidate(uniqueDpIds);
    setValidatedDataProductsStep4(new Set());
    setFailedDataProducts(new Set());
    if (!evalName.trim()) {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const d = String(today.getDate()).padStart(2, "0");
      const prefix = `${y}-${m}-${d}`;
      const existing = runs.filter((r) => r.evalName.startsWith(`eval-${prefix}-`));
      setEvalName(`eval-${prefix}-${existing.length + 1}`);
    }
    setStep2Open(false);
    setStep3Open(true);
  };

  const handleStep3Close = () => {
    if (!isValidatingInModal) {
      setStep3Open(false);
      setForceShowStep4(false);
      setSelectedAgent(null);
      setModalSearchTerm("");
      setModalSelectedDataProducts([]);
      setModalSelectedQuestions([]);
      setValidatedDataProductsStep4(new Set());
      setFailedDataProducts(new Set());
      setPreExecSqlMap(new Map());
      setDataProductsToValidate([]);
      onClose();
    }
  };

  const handleStep3Back = () => {
    setStep3Open(false);
    setStep2Open(true);
  };

  const handleValidate = () => {
    setIsValidatingInModal(true);
    const products = dataProducts.slice(0, 8);
    products.forEach((dp, i) => {
      setTimeout(() => {
        setValidatedDataProductsStep4((prev) => {
          const next = new Set(prev);
          next.add(dp.id);
          if (next.size === products.length) {
            setTimeout(() => setIsValidatingInModal(false), 800);
          }
          return next;
        });
      }, (i + 1) * 1200);
    });
  };

  const handleConfirmAndRun = () => {
    setStep3Open(false);
    setSelectedAgent(null);
    setEvalName("");
    setValidatedDataProductsStep4(new Set());
    setFailedDataProducts(new Set());
    setModalSearchTerm("");
    setModalSelectedDataProducts([]);
    setModalSelectedQuestions([]);
    setPreExecSqlMap(new Map());
    setDataProductsToValidate([]);
    onSuccess?.();
    onClose();
  };

  const handleRemoveQuestions = () => {
    const toRemove = modalSelectedQuestions
      .filter((q) => failedDataProducts.has(q.dataProductId))
      .map((q) => q.id);
    setSelectedRows((prev) => {
      const next = new Set(prev);
      toRemove.forEach((id) => next.delete(id));
      return next;
    });
    setModalSelectedQuestions((prev) =>
      prev.filter((q) => !failedDataProducts.has(q.dataProductId))
    );
    setStep3Open(false);
    setStep2Open(true);
  };

  /* Step 2 body – reused in modal Dialog and on canvas */
  const step2Body = (
    <>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: "20px", pb: "12px", px: "20px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconButton size="small" onClick={handleStep2Back} sx={{ marginLeft: "-8px", color: theme.palette.text.secondary, "&:hover": { backgroundColor: theme.palette.neutral[100] } }}>
            <ArrowUp size={16} style={{ transform: "rotate(-90deg)" }} />
          </IconButton>
          <Typography variant="h2" component="span">Create eval run</Typography>
        </Box>
        <IconButton size="small" onClick={handleStep2Close} sx={{ marginRight: "-8px" }}><X size={16} /></IconButton>
      </DialogTitle>
      <CreateEvalRunStepper
        activeStep={1}
        onStepClick={(step) => {
          if (step === 0) handleStep2Back();
        }}
        disabledSteps={[2, 3]}
        showValidationIcon={isValidationComplete}
      />
      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <Box sx={{ px: "20px", pt: "12px", pb: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", borderBottom: `1px solid ${theme.palette.neutral[300]}` }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <TextField placeholder="Search questions" value={modalSearchTerm} onChange={(e) => setModalSearchTerm(e.target.value)} size="small" InputProps={{ startAdornment: <Box sx={{ display: "flex", alignItems: "center", color: "#666" }}><Search size={18} /></Box>, endAdornment: modalSearchTerm ? <IconButton size="small" onClick={() => setModalSearchTerm("")} sx={{ padding: "4px" }}><X size={16} /></IconButton> : undefined }} sx={{ minWidth: "280px" }} />
            <Select multiple value={modalSelectedDataProducts} onChange={(e) => { const v = e.target.value; setModalSelectedDataProducts(typeof v === "string" ? v.split(",") : v); }} size="small" displayEmpty renderValue={(selected) => { if (!selected?.length) return "All data products"; if (selected.length === 1) return getDataProductName(selected[0] as string); return `${selected.length} data products`; }} sx={{ minWidth: "180px" }} MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}>
              {dataProducts.map((dp) => <MenuItem key={dp.id} value={dp.id}><Checkbox checked={modalSelectedDataProducts.includes(dp.id)} size="small" sx={{ padding: "4px" }} />{dp.name}</MenuItem>)}
            </Select>
            {(modalSearchTerm || modalSelectedDataProducts.length > 0) && <Button variant="text" size="small" onClick={() => { setModalSearchTerm(""); setModalSelectedDataProducts([]); }} sx={{ minWidth: "auto", padding: "6px 12px", textTransform: "none", color: theme.palette.text.secondary }}>Clear filters</Button>}
          </Box>
          <Typography variant="body2" sx={{ fontSize: "13px", color: theme.palette.text.secondary, whiteSpace: "nowrap" }}>
            {selectedRows.size > 0 ? `${selectedRows.size} ${selectedRows.size === 1 ? "item" : "items"} selected` : `${filteredModalQuestions.length} ${filteredModalQuestions.length === 1 ? "question" : "questions"}`}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff", borderBottom: `1px solid ${"rgb(240, 240, 240)"}` }}>
              <tr>
                <th style={{ padding: "12px 12px 12px 20px", width: 32, minWidth: 32, textAlign: "left" }}>
                  <Checkbox checked={filteredModalQuestions.length > 0 && filteredModalQuestions.every((q) => selectedRows.has(q.id))} indeterminate={filteredModalQuestions.some((q) => selectedRows.has(q.id)) && !filteredModalQuestions.every((q) => selectedRows.has(q.id))} onChange={(e) => { const next = new Set(selectedRows); if (e.target.checked) filteredModalQuestions.forEach((q) => next.add(q.id)); else filteredModalQuestions.forEach((q) => next.delete(q.id)); setSelectedRows(next); }} size="small" />
                </th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: theme.palette.text.secondary }}>Question</th>
                <th style={{ padding: "12px", width: 100, textAlign: "left", fontSize: "13px", fontWeight: 500, color: theme.palette.text.secondary }}>SQL</th>
                <th style={{ padding: "12px", width: 250, textAlign: "left", fontSize: "13px", fontWeight: 500, color: theme.palette.text.secondary }}>Data Product</th>
                <th style={{ padding: "12px", width: 180, textAlign: "left", fontSize: "13px", fontWeight: 500, color: theme.palette.text.secondary }}>Creator</th>
                <th style={{ padding: "12px", width: 240, textAlign: "left", fontSize: "13px", fontWeight: 500, color: theme.palette.text.secondary }}>Created</th>
              </tr>
            </thead>
            <tbody style={{ cursor: "pointer" }}>
              {filteredModalQuestions.map((question) => (
                <tr key={question.id} onClick={() => { const next = new Set(selectedRows); if (next.has(question.id)) next.delete(question.id); else next.add(question.id); setSelectedRows(next); }}>
                  <td style={{ padding: "12px 12px 12px 20px", width: 32 }} onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selectedRows.has(question.id)} onChange={(e) => { const next = new Set(selectedRows); if (e.target.checked) next.add(question.id); else next.delete(question.id); setSelectedRows(next); }} size="small" onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td style={{ padding: "12px", fontSize: "13px", color: theme.palette.text.primary }}>{question.question}</td>
                  <td style={{ padding: "12px", width: 100 }}>
                    <Chip icon={<Code size={14} />} label="SQL" variant="outlined" size="small" onMouseEnter={(e) => { setSqlPopoverAnchor(e.currentTarget); setSqlPopoverQuestionId(question.id); }} onMouseLeave={() => { setSqlPopoverAnchor(null); setSqlPopoverQuestionId(null); }} sx={{ height: 20, fontSize: "11px", cursor: "pointer", "& .MuiChip-icon": { marginLeft: "8px" } }} />
                  </td>
                  <td style={{ padding: "12px", width: 250 }}><Chip label={getDataProductName(question.dataProductId)} size="small" sx={{ height: 20, fontSize: "11px", backgroundColor: "rgba(0,0,0,0.08)", color: theme.palette.text.secondary }} /></td>
                  <td style={{ padding: "12px", width: 180 }}><Tooltip title={question.creator} arrow><Avatar sx={{ width: 24, height: 24, backgroundColor: getUserColor(question.creator), fontSize: "11px", fontWeight: 500 }}>{getInitials(question.creator)}</Avatar></Tooltip></td>
                  <td style={{ padding: "12px", width: 240, fontSize: "13px", color: theme.palette.text.secondary, whiteSpace: "nowrap" }}>{formatDateAndTime(question.createdDate).date} {formatDateAndTime(question.createdDate).time} pst</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </DialogContent>
      <Box sx={{ px: "20px", pb: "20px", pt: "12px", display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: `1px solid ${theme.palette.neutral[300]}` }}>
        <Button onClick={handleStep2Back} variant="text" color="inherit">Back</Button>
        <Button variant="contained" disabled={selectedRows.size === 0} onClick={handleStep2Continue}>Continue</Button>
      </Box>
    </>
  );

  if (!open && !isCanvas) return null;

  if (isCanvas) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Create Eval Run – Design Canvas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: -2, mb: 1 }}>
          All four steps laid out for design review and debugging.
        </Typography>

        <SelectAgentModal
          embedded
          open
          onClose={() => {}}
          agents={agents}
          selectedAgent={selectedAgent}
          focusedAgentId={focusedAgentId}
          onAgentSelect={(id) => setFocusedAgentId(id)}
          onAgentFocus={setFocusedAgentId}
          isValidatingEval={false}
          dataProductsToValidate={[]}
          validatedDataProducts={new Set()}
          getDataProductName={getDataProductName}
        />

        <Box sx={{ width: "100%", maxWidth: "1440px", height: "70vh", maxHeight: "700px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {step2Body}
        </Box>

        <EvalDetailsModal
          embedded
          canvasStep={3}
          open
          onClose={() => {}}
          onBack={() => {}}
          evalName={evalName}
          onEvalNameChange={setEvalName}
          agentInputs={agentInputs}
          onAgentInputChange={(key, value) => setAgentInputs((prev) => ({ ...prev, [key]: value }))}
          dataProductsList={dataProducts}
          preExecSqlMap={preExecSqlMap}
          onPreExecSqlChange={(dpId, sql) => {
            const next = new Map(preExecSqlMap);
            if (sql.trim()) next.set(dpId, sql);
            else next.delete(dpId);
            setPreExecSqlMap(next);
          }}
          isValidatingInModal={false}
          isValidationComplete={false}
          validatedDataProducts={new Set()}
          failedDataProducts={new Set()}
          onValidate={() => {}}
          onConfirmAndRun={() => {}}
        />

        <EvalDetailsModal
          embedded
          canvasStep={4}
          open
          onClose={() => {}}
          onBack={() => {}}
          evalName={evalName}
          onEvalNameChange={setEvalName}
          agentInputs={agentInputs}
          onAgentInputChange={(key, value) => setAgentInputs((prev) => ({ ...prev, [key]: value }))}
          dataProductsList={dataProducts}
          preExecSqlMap={preExecSqlMap}
          onPreExecSqlChange={(dpId, sql) => {
            const next = new Map(preExecSqlMap);
            if (sql.trim()) next.set(dpId, sql);
            else next.delete(dpId);
            setPreExecSqlMap(next);
          }}
          isValidatingInModal={false}
          isValidationComplete={true}
          validatedDataProducts={new Set(dataProducts.slice(0, 5).map((d) => d.id))}
          failedDataProducts={new Set(dataProducts.slice(5, 8).map((d) => d.id))}
          onValidate={() => {}}
          onConfirmAndRun={() => {}}
        />

        <Popover
          open={Boolean(sqlPopoverAnchor)}
          anchorEl={sqlPopoverAnchor}
          onClose={() => { setSqlPopoverAnchor(null); setSqlPopoverQuestionId(null); }}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          disableRestoreFocus
          sx={{ pointerEvents: "none", "& .MuiPopover-paper": { pointerEvents: "auto", marginTop: "8px", maxWidth: 500 } }}
          onMouseLeave={() => { setSqlPopoverAnchor(null); setSqlPopoverQuestionId(null); }}
        >
          {sqlPopoverQuestionId && (
            <Box sx={{ p: "12px", maxHeight: 300, overflow: "auto" }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: "monospace", fontSize: "12px", lineHeight: 1.5, color: theme.palette.text.primary, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {questions.find((q) => q.id === sqlPopoverQuestionId)?.sql ?? ""}
              </Typography>
            </Box>
          )}
        </Popover>
      </Box>
    );
  }

  return (
    <>
      {/* Step 1: Select Agent */}
      <SelectAgentModal
        open={step1Open}
        onClose={handleStep1Close}
        agents={agents}
        selectedAgent={selectedAgent}
        focusedAgentId={focusedAgentId}
        onAgentSelect={handleAgentSelect}
        onAgentFocus={setFocusedAgentId}
        isValidatingEval={isValidatingEval}
        dataProductsToValidate={dataProductsToValidate}
        validatedDataProducts={validatedDataProducts}
        getDataProductName={getDataProductName}
      />

      {/* Step 2: Select Questions */}
      <Dialog
        open={step2Open}
        onClose={handleStep2Close}
        PaperProps={{
          sx: {
            width: "80vw",
            maxWidth: "1440px",
            height: "80vh",
            maxHeight: "80vh",
            borderRadius: "12px",
            boxShadow:
              "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        {step2Body}
      </Dialog>

      <Popover
        open={Boolean(sqlPopoverAnchor)}
        anchorEl={sqlPopoverAnchor}
        onClose={() => {
          setSqlPopoverAnchor(null);
          setSqlPopoverQuestionId(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableRestoreFocus
        sx={{ pointerEvents: "none", "& .MuiPopover-paper": { pointerEvents: "auto", marginTop: "8px", maxWidth: 500 } }}
        onMouseLeave={() => {
          setSqlPopoverAnchor(null);
          setSqlPopoverQuestionId(null);
        }}
      >
        {sqlPopoverQuestionId && (
          <Box sx={{ p: "12px", maxHeight: 300, overflow: "auto" }}>
            <Typography variant="body2" component="pre" sx={{ fontFamily: "monospace", fontSize: "12px", lineHeight: 1.5, color: theme.palette.text.primary, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {questions.find((q) => q.id === sqlPopoverQuestionId)?.sql ?? ""}
            </Typography>
          </Box>
        )}
      </Popover>

      {/* Step 3 & 4: Eval details / Validate and confirm */}
      <EvalDetailsModal
        open={step3Open}
        onClose={handleStep3Close}
        onBack={handleStep3Back}
        evalName={evalName}
        onEvalNameChange={setEvalName}
        agentInputs={agentInputs}
        onAgentInputChange={(key, value) => setAgentInputs((prev) => ({ ...prev, [key]: value }))}
        dataProductsList={dataProducts}
        preExecSqlMap={preExecSqlMap}
        onPreExecSqlChange={(dataProductId, sql) => {
          const next = new Map(preExecSqlMap);
          if (sql.trim()) next.set(dataProductId, sql);
          else next.delete(dataProductId);
          setPreExecSqlMap(next);
        }}
        isValidatingInModal={isValidatingInModal}
        isValidationComplete={isValidationComplete}
        validatedDataProducts={validatedDataProductsStep4}
        failedDataProducts={failedDataProducts}
        forceShowStep4={forceShowStep4}
        selectedQuestions={modalSelectedQuestions}
        onRemoveQuestions={handleRemoveQuestions}
        onValidate={handleValidate}
        onConfirmAndRun={handleConfirmAndRun}
      />
    </>
  );
}
