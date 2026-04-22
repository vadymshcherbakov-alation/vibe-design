import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, IconButton, ToggleButton, ToggleButtonGroup, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MoreVertical, X, Plus, Edit, Eye, EyeOff, Check } from 'lucide-react';
import { FieldTypeIcon } from './field-types';

interface Field {
  id: string;
  label: string;
  ftype: string;
}

interface FieldGroup {
  id: string;
  group: true;
  label: string;
  fields: Field[];
  expandedByDefault?: boolean;
}

type TemplateItem = Field | FieldGroup;

interface Template {
  main: TemplateItem[];
  side: TemplateItem[];
}

interface TemplateCanvasProps {
  template: Template;
  onTemplateChange: (template: Template) => void;
  addZone: 'main' | 'side';
  onAddZoneChange: (zone: 'main' | 'side') => void;
  mode: 'build' | 'preview';
  onModeChange: (mode: 'build' | 'preview') => void;
  onCreateGroup: (zone: 'main' | 'side', type: 'empty' | 'from-fields', fields?: any[]) => void;
  fieldsPanelOpen: boolean;
  onAddField: (field: any) => void;
  onGroupSelectionChange?: (group: { id: string; zone: 'main' | 'side'; label: string } | null) => void;
  selectedGroup?: { id: string; zone: 'main' | 'side'; label: string } | null;
}

const GripIcon = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
    <circle cx="2.5" cy="2.5" r="1.4"/>
    <circle cx="7.5" cy="2.5" r="1.4"/>
    <circle cx="2.5" cy="7" r="1.4"/>
    <circle cx="7.5" cy="7" r="1.4"/>
    <circle cx="2.5" cy="11.5" r="1.4"/>
    <circle cx="7.5" cy="11.5" r="1.4"/>
  </svg>
);


export const TemplateCanvas: React.FC<TemplateCanvasProps> = ({
  template,
  onTemplateChange,
  addZone,
  onAddZoneChange,
  mode,
  onModeChange,
  onCreateGroup,
  fieldsPanelOpen,
  onAddField,
  onGroupSelectionChange,
  selectedGroup: externalSelectedGroup
}) => {
  const theme = useTheme();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null); // Track field being hovered for group creation
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null); // Track type of dragged field
  const [groupMenuAnchor, setGroupMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({});
  const [editingGroup, setEditingGroup] = useState<{ id: string; label: string } | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [keyboardActiveField, setKeyboardActiveField] = useState<string | null>(null);
  const [internalSelectedGroup, setInternalSelectedGroup] = useState<{ id: string; zone: 'main' | 'side' } | null>(null);
  const [keyboardError, setKeyboardError] = useState<{ fieldType: string; targetZone: 'main' | 'side' } | null>(null);

  // Use external selectedGroup if provided, otherwise use internal state
  const selectedGroup = externalSelectedGroup ? { id: externalSelectedGroup.id, zone: externalSelectedGroup.zone } : internalSelectedGroup;
  const srcRef = useRef<any>(null);
  const phRef = useRef<HTMLElement | null>(null);
  const gripClickedRef = useRef<boolean>(false);

  // Handle adding fields - respects group selection
  const handleAddFieldToCanvas = (field: any) => {
    if (selectedGroup) {
      // Add field to selected group
      const newTemplate = { ...template };
      const groupIndex = newTemplate[selectedGroup.zone].findIndex(item => item.id === selectedGroup.id);
      if (groupIndex !== -1) {
        const group = newTemplate[selectedGroup.zone][groupIndex] as FieldGroup;
        const newField = {
          id: `f-${Date.now()}`,
          label: field.label,
          ftype: field.ftype
        };
        group.fields.push(newField);
        onTemplateChange(newTemplate);
      }
    } else {
      // Add field to zone (existing behavior)
      onAddField(field);
    }
  };

  // Handle group selection
  const handleGroupSelect = (groupId: string, zone: 'main' | 'side') => {
    // Find the group to get its label
    const group = template[zone].find(item => item.id === groupId) as FieldGroup;
    const groupInfo = group ? { id: groupId, zone, label: group.label } : null;

    if (!externalSelectedGroup) {
      setInternalSelectedGroup({ id: groupId, zone });
    }
    setKeyboardActiveField(null); // Clear field selection when selecting group
    onGroupSelectionChange?.(groupInfo);

    // Match zone behavior: set add zone and trigger focus
    onAddZoneChange(zone);
  };

  // Clear group selection
  const clearGroupSelection = () => {
    if (!externalSelectedGroup) {
      setInternalSelectedGroup(null);
    }
    onGroupSelectionChange?.(null);
  };

  // Create placeholder element
  useEffect(() => {
    const el = document.createElement('div');
    Object.assign(el.style, {
      height: '46px',
      margin: '0 0 6px 0', // Remove side margins to match full width
      backgroundColor: '#f1f5f9',
      border: '2px dashed #cbd5e1',
      borderRadius: '5px',
      opacity: '0.6',
      boxSizing: 'border-box',
      flexShrink: '0'
    });

    // Ensure no content is added
    el.innerHTML = '';

    phRef.current = el;
    return () => {
      try { el.remove(); } catch (_) {}
    };
  }, []);

  // Placeholder management
  const ph = () => phRef.current;
  const removePh = () => {
    const el = ph();
    if (el?.parentElement) el.remove();
  };
  const isInPh = (el: any) => {
    const p = ph();
    return p && (el === p || p.contains(el));
  };
  const movePh = (container: Element, before?: Element | null) => {
    const p = ph();
    if (!p) return;
    const ref = before ?? null;
    if (p.parentElement === container && p.nextSibling === ref) return;

    // Always clear content and reset styling when moving
    p.innerHTML = '';
    p.textContent = '';
    Object.assign(p.style, {
      height: '46px',
      margin: '0 0 6px 0',
      backgroundColor: '#f1f5f9',
      border: '2px dashed #cbd5e1',
      borderRadius: '5px',
      opacity: '0.6',
      boxSizing: 'border-box',
      flexShrink: '0'
    });

    ref ? container.insertBefore(p, ref) : container.appendChild(p);
  };

  // Helper to find parent with data attribute
  const up = (el: any, key: string, scope?: Element): Element | null => {
    let c = el;
    while (c && c !== scope && c !== document.body) {
      if (c.dataset?.[key] !== undefined) return c;
      c = c.parentElement;
    }
    return null;
  };

  // Drag event handlers
  const onFieldOver = (e: React.DragEvent, zone: 'main' | 'side') => {
    e.preventDefault();
    e.stopPropagation();
    if (isInPh(e.target)) return;

    // Handle only internal drags (fields panel uses click-to-add now)
    if (!srcRef.current) return;

    // Check zone compatibility for internal drags
    if (srcRef.current && srcRef.current.itemId) {
      const fieldType = getFieldType(srcRef.current.itemId);
      if (fieldType && !isFieldCompatibleWithZone(fieldType, zone)) {
        return; // Don't show any hover effects for incompatible zones
      }
    }

    // External drags no longer supported - using click-to-add functionality

    const row = e.currentTarget as HTMLElement;
    if (srcRef.current && row.dataset.fieldId === srcRef.current?.itemId) return;

    const rect = row.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const centerX = rect.left + rect.width / 2;
    const threshold = 16; // pixels from center to trigger group creation

    // Check if we're hovering near the center of the field for group creation
    const isNearCenter = Math.abs(e.clientY - centerY) < threshold &&
                        Math.abs(e.clientX - centerX) < rect.width / 3;

    // Only allow group creation for single fields, not existing groups
    const targetFieldId = row.dataset.fieldId;
    const isValidGroupTarget = targetFieldId && srcRef.current && !srcRef.current.isGroup;

    if (isNearCenter && isValidGroupTarget) {
      // Show group creation indicator
      setHoverTarget(targetFieldId);
      removePh(); // Remove placeholder when showing group creation
      return;
    }

    // Clear group creation hover if not hovering over center
    setHoverTarget(null);

    // Normal reordering logic
    const inTop = e.clientY < rect.top + rect.height / 2;
    let ref = inTop ? row : row.nextSibling as Element;
    if (ref === ph()) ref = (ref?.nextSibling ?? null) as Element;

    const container = row.parentElement!;
    const srcEl = srcRef.current ? Array.from(container.children).find(c =>
      (c as any).dataset?.fieldId === srcRef.current?.itemId ||
      (c as any).dataset?.groupId === srcRef.current?.itemId
    ) as Element : null;

    if (srcEl) {
      // Don't show placeholder if it would result in no actual reordering
      if (ref === srcEl || srcEl.nextSibling === ref) return;

      // Also check if we're trying to place at the very end when source is already last
      if (!ref && srcEl.nextSibling === null) return;
    }

    movePh(container, ref ?? null);
  };

  const onGroupBodyOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInPh(e.target) || (srcRef.current?.isGroup)) return;

    // Handle only internal drags (fields panel uses click-to-add now)
    if (!srcRef.current) return;

    const body = e.currentTarget as HTMLElement;
    const zone = body.dataset.groupBody as 'main' | 'side';

    // Check zone compatibility for internal drags
    if (srcRef.current && srcRef.current.itemId) {
      const fieldType = getFieldType(srcRef.current.itemId);
      if (fieldType && !isFieldCompatibleWithZone(fieldType, zone)) {
        return; // Don't show any hover effects for incompatible zones
      }
    }

    // External drags no longer supported - using click-to-add functionality

    const rowEl = up(e.target, 'groupFieldId', body);

    if (rowEl) {
      if (srcRef.current && (rowEl as HTMLElement).dataset.groupFieldId === srcRef.current?.itemId) return;
      const rect = rowEl.getBoundingClientRect();
      const inTop = e.clientY < rect.top + rect.height / 2;
      let ref = inTop ? rowEl : rowEl.nextSibling as Element;
      if (ref === ph()) ref = (ref?.nextSibling ?? null) as Element;

      // Check if this would result in no actual reordering
      const srcEl = srcRef.current ? Array.from(body.children).find(c =>
        (c as any).dataset?.groupFieldId === srcRef.current?.itemId
      ) as Element : null;

      if (srcEl) {
        // Don't show if adjacent to source
        if (ref === srcEl || srcEl.nextSibling === ref) return;

        // Don't show if trying to place at end when source is already last
        if (!ref && srcEl.nextSibling === null) return;
      }

      movePh(body, ref ?? null);
    } else {
      // Dragging over empty space in group
      const rect = body.getBoundingClientRect();
      const y = e.clientY - rect.top;

      // Check if source is already in this group and is the only/last item
      const srcEl = srcRef.current ? Array.from(body.children).find(c =>
        (c as any).dataset?.groupFieldId === srcRef.current?.itemId
      ) as Element : null;

      if (y < rect.height * 0.3 && body.children.length > 0) {
        // Don't show if source is already first
        if (srcEl && srcEl === body.firstElementChild) return;
        movePh(body, body.firstElementChild);
      } else {
        // Don't show if source is already last (and alone would mean no change)
        if (srcEl && srcEl.nextSibling === null) return;
        movePh(body, null); // At end
      }
    }
  };

  const onZoneOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isInPh(e.target)) return;

    const container = e.currentTarget as HTMLElement;
    const zone = container.dataset.zone as 'main' | 'side';

    // Check zone compatibility for internal drags
    if (srcRef.current && srcRef.current.itemId) {
      const fieldType = getFieldType(srcRef.current.itemId);
      if (fieldType && !isFieldCompatibleWithZone(fieldType, zone)) {
        return; // Don't show any hover effects for incompatible zones
      }
    }

    // External drags no longer supported - using click-to-add functionality

    // Show placeholder for internal drags only
    if (srcRef.current) {
      const rect = container.getBoundingClientRect();
      const y = e.clientY - rect.top;

      const srcEl = srcRef.current ? Array.from(container.children).find(c =>
        (c as any).dataset?.fieldId === srcRef.current?.itemId ||
        (c as any).dataset?.groupId === srcRef.current?.itemId
      ) as Element : null;

      if (y < rect.height * 0.3 && container.children.length > 0) {
        // Don't show if source is already first
        if (srcEl && srcEl === container.firstElementChild) return;
        movePh(container, container.firstElementChild);
      } else {
        // Don't show if source is already last
        if (srcEl && srcEl.nextSibling === null) return;
        movePh(container, null); // At end
      }
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    let src = srcRef.current;
    const p = ph();

    // Note: External drops from fields panel are no longer supported - using click-to-add instead

    // Check if we're creating a group by dropping on another field
    if (hoverTarget && src && src.type !== 'new-field') {
      handleGroupCreation(src, hoverTarget);
      endDrag();
      return;
    }

    if (!src || !p?.parentElement) {
      endDrag();
      return;
    }

    const parent = p.parentElement;
    let tgt: any = null;

    // Determine drop target and validate zone compatibility
    if (parent.dataset.groupBody !== undefined) {
      const zone = parent.dataset.groupBody as 'main' | 'side';
      const grpId = parent.dataset.groupId;
      const arr = template[zone];
      const gi = arr.findIndex(i => i.id === grpId);

      // Validate zone compatibility for internal moves
      let fieldType: string | null = null;
      if (src.itemId) {
        fieldType = getFieldType(src.itemId);
      }

      if (fieldType && !isFieldCompatibleWithZone(fieldType, zone)) {
        endDrag(); // Reject the drop
        return;
      }

      if (gi !== -1) {
        let fi = 0;
        for (const c of parent.children) {
          if (c === p) break;
          if ((c as any).dataset?.groupFieldId !== undefined) fi++;
        }
        tgt = { type: 'groupField', zone, groupIdx: gi, fieldIdx: fi };
      }
    } else if (parent.dataset.zone !== undefined) {
      const zone = parent.dataset.zone as 'main' | 'side';

      // Validate zone compatibility for internal moves
      let fieldType: string | null = null;
      if (src.itemId) {
        fieldType = getFieldType(src.itemId);
      }

      if (fieldType && !isFieldCompatibleWithZone(fieldType, zone)) {
        endDrag(); // Reject the drop
        return;
      }

      let idx = 0;
      for (const c of parent.children) {
        if (c === p) break;
        if ((c as any).dataset?.fieldId !== undefined || (c as any).dataset?.groupId !== undefined) idx++;
      }
      tgt = { type: 'zone', zone, idx };
    }

    removePh();
    if (tgt) execDrop(src, tgt);
    srcRef.current = null;
    setDraggedItem(null);
  };

  const handleGroupCreation = (src: any, targetFieldId: string) => {
    // Find the source field
    let srcField: any = null;
    for (const zone of ['main', 'side'] as const) {
      const items = template[zone];
      for (const item of items) {
        if ('group' in item) {
          const field = item.fields.find(f => f.id === src.itemId);
          if (field) {
            srcField = field;
            break;
          }
        } else if (item.id === src.itemId) {
          srcField = item;
          break;
        }
      }
      if (srcField) break;
    }

    // Find the target field
    let targetField: any = null;
    let targetZone: 'main' | 'side' | null = null;
    for (const zone of ['main', 'side'] as const) {
      const item = template[zone].find(item => !('group' in item) && item.id === targetFieldId);
      if (item) {
        targetField = item;
        targetZone = zone;
        break;
      }
    }

    if (!srcField || !targetField || !targetZone) return;

    // Open group creation modal with both fields
    const fields = [targetField, srcField];
    onCreateGroup(targetZone, 'from-fields', fields);
  };

  const execDrop = (src: any, tgt: any) => {
    const newTemplate = { ...template };
    let item: any;

    // Handle existing items (new fields are added via click-to-add now)
    if (src.type !== 'new-field') {
      // Remove item from source for existing items
      if (src.type === 'zone') {
        [item] = (newTemplate as any)[src.zone].splice(src.idx, 1);
      } else {
        [item] = ((newTemplate as any)[src.zone][src.groupIdx] as FieldGroup).fields.splice(src.fieldIdx, 1);
        // Clean up empty groups
        const group = (newTemplate as any)[src.zone][src.groupIdx] as FieldGroup;
        if (group.fields.length === 0) {
          (newTemplate as any)[src.zone].splice(src.groupIdx, 1);
        }
      }
    }

    if (!item || (item.group && tgt.type !== 'zone')) return;

    // Insert item at target
    if (tgt.type === 'zone') {
      const arr = (newTemplate as any)[tgt.zone];
      let ins = tgt.idx;
      if (src.type === 'zone' && src.zone === tgt.zone && src.idx < ins) ins--;
      arr.splice(Math.max(0, Math.min(ins, arr.length)), 0, item);
    } else {
      let gi = tgt.groupIdx;
      if (src.type === 'zone' && src.zone === tgt.zone && src.idx <= gi) gi--;
      const grp = (newTemplate as any)[tgt.zone][gi] as FieldGroup;
      if (!grp) return;
      let fi = tgt.fieldIdx;
      if (src.type === 'groupField' && src.zone === tgt.zone &&
          src.groupIdx === gi && src.fieldIdx < fi) fi--;
      grp.fields.splice(Math.max(0, Math.min(fi, grp.fields.length)), 0, item);
    }

    onTemplateChange(newTemplate);
  };

  const startDrag = (e: React.DragEvent, src: any) => {
    e.stopPropagation();
    srcRef.current = src;
    e.dataTransfer.effectAllowed = 'move';

    // Track the field type being dragged
    const fieldType = getFieldType(src.itemId);
    setDraggedFieldType(fieldType);

    requestAnimationFrame(() => setDraggedItem(src.itemId));
  };

  const endDrag = () => {
    removePh();
    srcRef.current = null;
    setDraggedItem(null);
    setHoverTarget(null);
    setDraggedFieldType(null);
  };

  // Helper function to check if a field is compatible with a zone
  const isFieldCompatibleWithZone = (ftype: string, zone: 'main' | 'side'): boolean => {
    // Main-body-only field types
    const mainOnlyTypes = ['Table', 'Code'];

    if (mainOnlyTypes.includes(ftype) && zone === 'side') {
      return false;
    }

    return true;
  };

  // Helper to get field type from template data
  const getFieldType = (fieldId: string): string | null => {
    for (const zone of ['main', 'side'] as const) {
      for (const item of template[zone]) {
        if ('group' in item) {
          const field = item.fields.find(f => f.id === fieldId);
          if (field) return field.ftype;
        } else if (item.id === fieldId) {
          return item.ftype;
        }
      }
    }
    return null;
  };

  const handleGroupMenuOpen = (event: React.MouseEvent<HTMLElement>, groupId: string) => {
    event.stopPropagation();
    setGroupMenuAnchor({ ...groupMenuAnchor, [groupId]: event.currentTarget });
  };

  const handleGroupMenuClose = (groupId: string) => {
    setGroupMenuAnchor({ ...groupMenuAnchor, [groupId]: null });
  };

  const handleEditGroupTitle = (groupId: string, currentLabel: string) => {
    setEditingGroup({ id: groupId, label: currentLabel });
    setEditGroupName(currentLabel);
    handleGroupMenuClose(groupId);
  };

  const handleSaveGroupTitle = () => {
    if (!editingGroup || !editGroupName.trim()) return;

    const newTemplate = { ...template };
    for (const zone of ['main', 'side'] as const) {
      const groupIndex = newTemplate[zone].findIndex(item => item.id === editingGroup.id);
      if (groupIndex !== -1) {
        const group = newTemplate[zone][groupIndex] as FieldGroup;
        newTemplate[zone][groupIndex] = { ...group, label: editGroupName.trim() };
        break;
      }
    }
    onTemplateChange(newTemplate);
    setEditingGroup(null);
    setEditGroupName('');
  };

  const handleToggleGroupExpanded = (groupId: string) => {
    const newTemplate = { ...template };
    for (const zone of ['main', 'side'] as const) {
      const groupIndex = newTemplate[zone].findIndex(item => item.id === groupId);
      if (groupIndex !== -1) {
        const group = newTemplate[zone][groupIndex] as FieldGroup;
        newTemplate[zone][groupIndex] = {
          ...group,
          expandedByDefault: !group.expandedByDefault
        };
        break;
      }
    }
    onTemplateChange(newTemplate);
    handleGroupMenuClose(groupId);
  };

  // Keyboard navigation logic
  const handleKeyboardNavigation = (e: React.KeyboardEvent, fieldId: string) => {
    // Handle Space key activation when not in keyboard mode
    if (e.key === ' ' && keyboardActiveField !== fieldId) {
      e.preventDefault();
      setKeyboardActiveField(fieldId);
      return;
    }

    if (!keyboardActiveField || keyboardActiveField !== fieldId) return;

    const { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Escape } = {
      ArrowUp: 'ArrowUp',
      ArrowDown: 'ArrowDown',
      ArrowLeft: 'ArrowLeft',
      ArrowRight: 'ArrowRight',
      Escape: 'Escape'
    };

    if (![ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Escape, ' '].includes(e.key)) return;

    e.preventDefault();

    if (e.key === Escape) {
      setKeyboardActiveField(null);
      return;
    }

    // Space key deactivates keyboard mode when already active
    if (e.key === ' ') {
      setKeyboardActiveField(null);
      return;
    }

    // Find current field position
    let currentZone: 'main' | 'side' | null = null;
    let currentIndex = -1;
    let isInGroup = false;
    let currentGroupIndex = -1;
    let currentFieldIndex = -1;

    for (const zone of ['main', 'side'] as const) {
      // Check top-level items first
      const topLevelIndex = template[zone].findIndex(item => item.id === fieldId);
      if (topLevelIndex !== -1) {
        currentZone = zone;
        currentIndex = topLevelIndex;
        break;
      }

      // Check within groups
      for (let groupIndex = 0; groupIndex < template[zone].length; groupIndex++) {
        const item = template[zone][groupIndex];
        if ('group' in item) {
          const fieldIndex = item.fields.findIndex(field => field.id === fieldId);
          if (fieldIndex !== -1) {
            currentZone = zone;
            isInGroup = true;
            currentGroupIndex = groupIndex;
            currentFieldIndex = fieldIndex;
            break;
          }
        }
      }
      if (currentZone) break;
    }

    if (!currentZone) return;

    const newTemplate = { ...template };

    // Handle zone switching (left/right arrows)
    if (e.key === ArrowLeft || e.key === ArrowRight) {
      // Left arrow moves to main body (left side), right arrow moves to sidebar (right side)
      const targetZone = e.key === ArrowLeft ? 'main' : 'side';

      // Don't move if already in the target zone
      if (currentZone === targetZone) {
        return;
      }

      // Check zone compatibility before moving
      const fieldType = getFieldType(fieldId);
      if (fieldType && !isFieldCompatibleWithZone(fieldType, targetZone)) {
        // Show error feedback for incompatible keyboard navigation
        setKeyboardError({ fieldType, targetZone });
        setTimeout(() => setKeyboardError(null), 3000); // Clear error after 3 seconds
        return; // Don't move if incompatible
      }

      // Remove from current position
      let itemToMove: any;
      if (isInGroup) {
        const group = newTemplate[currentZone][currentGroupIndex] as FieldGroup;
        [itemToMove] = group.fields.splice(currentFieldIndex, 1);

        // Clean up empty group
        if (group.fields.length === 0) {
          newTemplate[currentZone].splice(currentGroupIndex, 1);
        }
      } else {
        [itemToMove] = newTemplate[currentZone].splice(currentIndex, 1);
      }

      // Add to target zone at the end
      newTemplate[targetZone].push(itemToMove);
      onTemplateChange(newTemplate);

      // Ensure the field remains keyboard active after the move
      // Re-focus the element after the DOM update
      setTimeout(() => {
        const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`) as HTMLElement;
        if (fieldElement) {
          fieldElement.focus();
        }
      }, 0);
      return;
    }

    // Handle up/down movement within same zone
    if (e.key === ArrowUp || e.key === ArrowDown) {
      const isMovingUp = e.key === ArrowUp;
      let itemToMove: Field;

      if (isInGroup) {
        // Currently in a group
        const group = newTemplate[currentZone][currentGroupIndex] as FieldGroup;

        if (isMovingUp && currentFieldIndex > 0) {
          // Move up within group
          const [item] = group.fields.splice(currentFieldIndex, 1);
          group.fields.splice(currentFieldIndex - 1, 0, item);
          onTemplateChange(newTemplate);
        } else if (!isMovingUp && currentFieldIndex < group.fields.length - 1) {
          // Move down within group
          const [item] = group.fields.splice(currentFieldIndex, 1);
          group.fields.splice(currentFieldIndex + 1, 0, item);
          onTemplateChange(newTemplate);
        } else if (isMovingUp && currentFieldIndex === 0) {
          // Exit group upward (to above the group)
          [itemToMove] = group.fields.splice(currentFieldIndex, 1);

          // Clean up empty group
          if (group.fields.length === 0) {
            newTemplate[currentZone].splice(currentGroupIndex, 1);
            newTemplate[currentZone].splice(Math.max(0, currentGroupIndex - 1), 0, itemToMove);
          } else {
            newTemplate[currentZone].splice(currentGroupIndex, 0, itemToMove);
          }
          onTemplateChange(newTemplate);
        } else if (!isMovingUp && currentFieldIndex === group.fields.length - 1) {
          // Exit group downward (to below the group)
          [itemToMove] = group.fields.splice(currentFieldIndex, 1);

          // Clean up empty group
          if (group.fields.length === 0) {
            newTemplate[currentZone].splice(currentGroupIndex, 1);
            newTemplate[currentZone].splice(Math.min(currentGroupIndex, newTemplate[currentZone].length), 0, itemToMove);
          } else {
            newTemplate[currentZone].splice(currentGroupIndex + 1, 0, itemToMove);
          }
          onTemplateChange(newTemplate);
        }
      } else {
        // Currently at top level
        if (isMovingUp && currentIndex > 0) {
          const prevItem = newTemplate[currentZone][currentIndex - 1];

          if ('group' in prevItem && prevItem.group) {
            // Moving up into a group - enter at the bottom
            const removedItems = newTemplate[currentZone].splice(currentIndex, 1);
            const itemToMove = removedItems[0];
            // Only allow moving Field items into groups, not other FieldGroups
            if ('ftype' in itemToMove) {
              prevItem.fields.push(itemToMove as Field);
              onTemplateChange(newTemplate);
            } else {
              // If it's a group, put it back and don't move
              newTemplate[currentZone].splice(currentIndex, 0, itemToMove);
            }
          } else {
            // Normal top-level movement
            const [item] = newTemplate[currentZone].splice(currentIndex, 1);
            newTemplate[currentZone].splice(currentIndex - 1, 0, item);
            onTemplateChange(newTemplate);
          }
        } else if (!isMovingUp && currentIndex < newTemplate[currentZone].length - 1) {
          const nextItem = newTemplate[currentZone][currentIndex + 1];

          if ('group' in nextItem && nextItem.group) {
            // Moving down into a group - enter at the top
            const removedItems = newTemplate[currentZone].splice(currentIndex, 1);
            const itemToMove = removedItems[0];
            // Only allow moving Field items into groups, not other FieldGroups
            if ('ftype' in itemToMove) {
              nextItem.fields.unshift(itemToMove as Field);
              onTemplateChange(newTemplate);
            } else {
              // If it's a group, put it back and don't move
              newTemplate[currentZone].splice(currentIndex, 0, itemToMove);
            }
          } else {
            // Normal top-level movement
            const [item] = newTemplate[currentZone].splice(currentIndex, 1);
            newTemplate[currentZone].splice(currentIndex + 1, 0, item);
            onTemplateChange(newTemplate);
          }
        }
      }

      // Re-focus the element after DOM update
      setTimeout(() => {
        const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`) as HTMLElement;
        if (fieldElement) {
          fieldElement.focus();
        }
      }, 0);
    }
  };

  const handleGripFocus = (fieldId: string) => {
    setKeyboardActiveField(fieldId);
  };

  const handleGripBlur = () => {
    // Don't clear if we just clicked (prevents click from being overridden by blur)
    if (gripClickedRef.current) {
      gripClickedRef.current = false;
      return;
    }
    // Clear keyboard active field when truly losing focus
    setKeyboardActiveField(null);
  };

  const handleGripClick = (fieldId: string) => {
    // Mark that we just clicked to prevent blur from clearing
    gripClickedRef.current = true;
    // Always activate keyboard mode on click - don't toggle
    setKeyboardActiveField(fieldId);

    // Clear the flag after a short delay to allow normal blur behavior later
    setTimeout(() => {
      gripClickedRef.current = false;
    }, 100);
  };



  const removeField = (zone: 'main' | 'side', index: number) => {
    const newTemplate = { ...template };
    newTemplate[zone] = [...newTemplate[zone]];
    newTemplate[zone].splice(index, 1);
    onTemplateChange(newTemplate);
  };

  const removeGroupField = (zone: 'main' | 'side', groupIndex: number, fieldIndex: number) => {
    const newTemplate = { ...template };
    const group = { ...newTemplate[zone][groupIndex] } as FieldGroup;
    group.fields = [...group.fields];
    group.fields.splice(fieldIndex, 1);
    newTemplate[zone] = [...newTemplate[zone]];
    newTemplate[zone][groupIndex] = group;
    onTemplateChange(newTemplate);
  };

  const renderField = (
    item: Field,
    zone: 'main' | 'side',
    index: number,
    isInGroup = false,
    groupIndex?: number,
    fieldIndex?: number
  ) => {
    const isGhost = item.id === draggedItem;
    const isGroupTarget = hoverTarget === item.id;
    const src = isInGroup
      ? { type: 'groupField', zone, groupIdx: groupIndex!, fieldIdx: fieldIndex!, itemId: item.id, isGroup: false }
      : { type: 'zone', zone, idx: index, itemId: item.id, isGroup: false };

    return (
      <Box
        key={item.id}
        data-field-id={!isInGroup ? item.id : undefined}
        data-group-field-id={isInGroup ? item.id : undefined}
        draggable
        onDragStart={(e) => startDrag(e, src)}
        onDragEnd={endDrag}
        onDragOver={isInGroup ? undefined : (e) => onFieldOver(e, zone)}
        onDragLeave={() => setHoverTarget(null)}
        onClick={(e) => {
          e.stopPropagation();
          handleGripClick(item.id);
        }}
        onFocus={() => setKeyboardActiveField(item.id)}
        onKeyDown={(e) => handleKeyboardNavigation(e, item.id)}
        tabIndex={0}
        sx={{
          pb: 0.75,
          opacity: isGhost ? 0.3 : 1,
          cursor: 'grab',
          position: 'relative',
          '&:active': {
            cursor: 'grabbing'
          },
          '&:focus': {
            outline: 'none' // Remove default focus outline since we have custom styling
          }
        }}
      >
        {/* Group creation indicator */}
        {isGroupTarget && (
          <>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 115, 221, 0.1)',
                border: '2px solid #0073DD',
                borderRadius: 1.25,
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />
            {/* Group creation label positioned well above the field */}
            <Box
              sx={{
                position: 'absolute',
                top: -48, // Float well above the field
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#0073DD',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 1,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                zIndex: 99999, // Even higher z-index
                pointerEvents: 'none',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2), 0px 2px 6px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #0073DD'
                }
              }}
            >
              Create Group
            </Box>
          </>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: '8px 12px',
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: keyboardActiveField === item.id ? 'primary.main' : 'divider',
            borderRadius: 1.25,
            boxShadow: keyboardActiveField === item.id ? '0 0 0 2px rgba(0, 115, 221, 0.2)' : 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          <Box
            sx={{
              minWidth: 'auto',
              p: '2px 3px',
              color: keyboardActiveField === item.id ? '#0073DD' : '#B7B7C1',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none', // Make it non-interactive
              transition: 'color 0.2s ease'
            }}
          >
            <GripIcon />
          </Box>

          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <FieldTypeIcon ftype={item.ftype} />
          </Box>

          <Typography
            variant="body1"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {item.label}
          </Typography>

          <IconButton
            size="small"
            onClick={() =>
              isInGroup
                ? removeGroupField(zone, groupIndex!, fieldIndex!)
                : removeField(zone, index)
            }
            sx={{
              width: 28,
              height: 28,
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                color: '#CA334A',
                backgroundColor: '#FFF0F0'
              }
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const renderGroup = (item: FieldGroup, zone: 'main' | 'side', index: number) => {
    const isGhost = item.id === draggedItem;
    const isSelected = selectedGroup?.id === item.id;
    const src = { type: 'zone', zone, idx: index, itemId: item.id, isGroup: true };

    return (
      <Box
        key={item.id}
        data-group-id={item.id}
        draggable
        onDragStart={(e) => startDrag(e, src)}
        onDragEnd={endDrag}
        onDragOver={(e) => onFieldOver(e, zone)}
        onClick={(e) => {
          e.stopPropagation();
          handleGroupSelect(item.id, zone);
        }}
        sx={{
          pb: 0.75,
          opacity: isGhost ? 0.3 : 1,
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing'
          }
        }}
      >
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              border: (keyboardActiveField === item.id || isSelected) ? '1px solid #0073DD' : '1px solid #E8EDF1',
              borderLeft: '3px solid #0073DD',
              borderRadius: 1.25,
              overflow: 'hidden',
              boxShadow: (keyboardActiveField === item.id || isSelected) ? '0 0 0 2px rgba(0, 115, 221, 0.2)' : 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              ...(isSelected && {
                backgroundColor: 'rgba(0, 115, 221, 0.02)'
              })
            }}
          >
            {/* Group header */}
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleGripClick(item.id);
              }}
              onFocus={() => setKeyboardActiveField(item.id)}
              onKeyDown={(e) => handleKeyboardNavigation(e, item.id)}
              tabIndex={0}
              data-field-id={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: '7px 9px',
                borderBottom: '1px solid #E8EDF1',
                backgroundColor: '#F9F9FB',
                cursor: 'pointer',
                '&:focus': {
                  outline: 'none' // Remove focus outline from header
                }
              }}
            >
              <Box
                sx={{
                  minWidth: 'auto',
                  p: '2px 3px',
                  color: keyboardActiveField === item.id ? '#0073DD' : '#B7B7C1',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s ease'
                }}
              >
                <GripIcon />
              </Box>

              <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, fontSize: 13, color: 'text.primary' }}>
                {item.label}
              </Typography>

              {/* Add fields/Adding here button for groups */}
              {isSelected && fieldsPanelOpen ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: '#0072dd',
                    mr: 0.5,
                    px: 1,
                    py: 0.25,
                    height: '24px'
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#0072dd'
                    }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '11px' }}>
                    Adding here
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGroupSelect(item.id, zone);
                  }}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: 'background.paper',
                    color: 'text.secondary',
                    borderColor: 'divider',
                    minWidth: 'auto',
                    mr: 0.5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main'
                    }
                  }}
                >
                  Add fields
                </Button>
              )}

              <IconButton
                size="small"
                onClick={(e) => handleGroupMenuOpen(e, item.id)}
                sx={{
                  width: 28,
                  height: 28,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    backgroundColor: 'grey.100'
                  }
                }}
              >
                <MoreVertical size={16} />
              </IconButton>

              <Menu
                anchorEl={groupMenuAnchor[item.id]}
                open={Boolean(groupMenuAnchor[item.id])}
                onClose={() => handleGroupMenuClose(item.id)}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                  sx: { minWidth: 200 }
                }}
              >
                <MenuItem onClick={() => handleEditGroupTitle(item.id, item.label)}>
                  <Edit size={16} style={{ marginRight: 8 }} />
                  Edit title
                </MenuItem>
                <MenuItem onClick={() => handleToggleGroupExpanded(item.id)}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.expandedByDefault}
                        size="small"
                        sx={{
                          p: 0,
                          mr: 1,
                          '& .MuiSvgIcon-root': {
                            fontSize: 16
                          }
                        }}
                      />
                    }
                    label="Expand group by default"
                    sx={{
                      margin: 0,
                      width: '100%',
                      '& .MuiFormControlLabel-label': {
                        fontSize: 14,
                        lineHeight: 1.43
                      }
                    }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    removeField(zone, index);
                    handleGroupMenuClose(item.id);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <X size={16} style={{ marginRight: 8 }} />
                  Delete group
                </MenuItem>
              </Menu>
            </Box>

            {/* Group body */}
            <Box
              data-group-body={zone}
              data-group-id={item.id}
              onDragOver={onGroupBodyOver}
              onDrop={onDrop}
              sx={{
                p: '5px 9px 7px',
                minHeight: 32
              }}
            >
              {item.fields.length === 0 ? (
                <Box
                  sx={{
                    border: 1,
                    borderStyle: 'dashed',
                    borderColor: isSelected ? 'primary.main' : 'grey.400',
                    borderRadius: 1,
                    p: 1.75,
                    textAlign: 'center',
                    color: isSelected ? 'primary.main' : 'text.secondary',
                    fontSize: 12,
                    backgroundColor: isSelected ? 'rgba(0, 115, 221, 0.05)' : 'grey.50',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSelected ? 'Add fields from the panel' : 'Drop a field here'}
                </Box>
              ) : (
                item.fields.map((field, fieldIndex) =>
                  renderField(field, zone, index, true, index, fieldIndex)
                )
              )}
            </Box>
          </Box>
      </Box>
    );
  };

  const renderZone = (zone: 'main' | 'side') => {
    const items = template[zone];

    // Check if current drag is incompatible with this zone
    const isDragIncompatible = draggedFieldType && !isFieldCompatibleWithZone(draggedFieldType, zone);

    // Check if keyboard navigation error should be shown for this zone
    const isKeyboardError = keyboardError && keyboardError.targetZone === zone;

    // Show error state if either drag incompatible or keyboard error
    const showErrorState = isDragIncompatible || isKeyboardError;

    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 1.25,
          border: 1,
          borderColor: showErrorState ? 'error.main' : 'divider',
          overflow: 'hidden',
          position: 'relative',
          opacity: showErrorState ? 0.6 : 1,
          transition: 'all 0.2s ease',
          boxShadow: addZone === zone && fieldsPanelOpen ? '0px 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
          transform: addZone === zone && fieldsPanelOpen ? 'translateY(-1px)' : 'none',
          '&:hover': {
            boxShadow: addZone === zone && fieldsPanelOpen ? '0px 4px 12px rgba(0, 0, 0, 0.08)' : '0px 2px 8px rgba(0, 0, 0, 0.04)',
            transform: addZone === zone && fieldsPanelOpen ? 'translateY(-1px)' : 'translateY(-0.5px)',
          }
        }}
      >
        {/* Incompatible operation overlay */}
        {showErrorState && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 0, 0, 0.05)',
              zIndex: 2,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                backgroundColor: 'error.main',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 1,
                fontSize: 12,
                fontWeight: 500,
                textAlign: 'center',
                boxShadow: 2
              }}
            >
              {(() => {
                const fieldType = draggedFieldType || keyboardError?.fieldType || '';
                const fieldName = fieldType === 'Table' ? 'Tables' : fieldType === 'Code' ? 'Code fields' : 'This field';
                return `${fieldName} can only be placed in Main Body`;
              })()}
            </Box>
          </Box>
        )}
        <Box
          onClick={() => {
            onAddZoneChange(zone);
            clearGroupSelection(); // Clear group selection when zone is selected
          }}
          sx={{
            p: '9px 12px',
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            backgroundColor: 'grey.50',
            cursor: 'pointer'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1">
              {zone === 'main' ? 'Main Body' : 'Sidebar'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {addZone === zone && fieldsPanelOpen && !selectedGroup ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: '#0072dd'
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#0072dd'
                  }}
                />
                <Typography variant="caption">
                  Adding here
                </Typography>
              </Box>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onAddZoneChange(zone)}
                sx={{
                  textTransform: 'none',
                  backgroundColor: 'background.paper',
                  color: 'text.secondary',
                  borderColor: 'divider',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main'
                  }
                }}
              >
                Add fields
              </Button>
            )}

            <Button
              variant="outlined"
              size="small"
              onClick={() => onCreateGroup(zone, 'empty')}
              sx={{
                textTransform: 'none',
                backgroundColor: 'background.paper',
                color: 'text.secondary',
                borderColor: 'divider',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }
              }}
            >
              Add group
            </Button>
          </Box>
        </Box>

        <Box
          data-zone={zone}
          onDragOver={onZoneOver}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              removePh();
            }
          }}
          onDrop={onDrop}
          onClick={(e) => {
            // Clear focus and group selection when clicking on zone background or empty area
            const target = e.target as HTMLElement;
            const isEmptyArea = target === e.currentTarget ||
                               target.classList.contains('empty-zone') ||
                               target.closest('[data-empty-zone]');

            if (isEmptyArea || e.target === e.currentTarget) {
              setKeyboardActiveField(null);
              clearGroupSelection();
            }
          }}
          sx={{
            p: 2.25,
            minHeight: 50
          }}
        >
          {items.length === 0 ? (
            <Box
              data-empty-zone
              sx={{
                border: 1,
                borderStyle: 'dashed',
                borderColor: 'grey.400',
                borderRadius: 1.25,
                p: 4,
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: 13,
                backgroundColor: 'grey.50'
              }}
            >
              No fields yet — add from the panel
            </Box>
          ) : (
            items.map((item, index) =>
              'group' in item
                ? renderGroup(item, zone, index)
                : renderField(item, zone, index)
            )
          )}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box
        onClick={(e) => {
          // Clear focus when clicking on canvas background areas
          const target = e.target as HTMLElement;
          const isBackgroundClick = target === e.currentTarget ||
                                   target.closest('.template-canvas-bg');
          if (isBackgroundClick) {
            setKeyboardActiveField(null);
          }
        }}
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'grey.50',
          overflowY: 'auto',
          overflowX: 'hidden',
          pt: `${"16px"}px`,
          px: `${"24px"}px`,
          pb: `${"24px"}px`, // Bottom padding so content isn't clipped
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
        className="template-canvas-bg"
        // External drags no longer supported - simplified to internal drags only
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, justifyContent: 'flex-start' }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, val) => val && onModeChange(val)}
            size="small"
            sx={{
              backgroundColor: theme.palette.neutral[100] || 'grey.100',
              borderRadius: '6px',
              p: '2px',
              '& .MuiToggleButtonGroup-grouped': {
                border: 'none',
                borderRadius: '4px',
                px: '12px',
                py: 0,
                height: '32px',
                fontSize: '13px',
                fontWeight: 500,
                textTransform: 'none',
                '&.Mui-selected': {
                  backgroundColor: "#ffffff",
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.33)',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: "#ffffff"
                  }
                },
                '&:not(.Mui-selected)': {
                  backgroundColor: 'transparent',
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.neutral[100]
                  }
                }
              }
            }}
          >
            <ToggleButton value="build">Build</ToggleButton>
            <ToggleButton value="preview">Preview</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {mode === 'build' ? (
          <Box
            onClick={(e) => {
              // Clear focus when clicking in empty space between zones or on any background area
              if (e.target === e.currentTarget) {
                setKeyboardActiveField(null);
              }
            }}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr', // Stack on very narrow screens
                lg: 'minmax(320px, 1fr) minmax(320px, 400px)' // Main body flexible, sidebar max 400px
              },
              gridAutoRows: 'min-content',
              gap: 2.5,
              alignItems: 'start',
              width: '100%',
              maxWidth: '100%',
              // When stacked, ensure main body comes first
              '& > :first-of-type': {
                order: 1
              },
              '& > :last-of-type': {
                order: 2
              }
            }}
          >
            {renderZone('main')}
            {renderZone('side')}
          </Box>
        ) : (
          <Box sx={{
            width: '100%',
            flex: 1,
            minHeight: 0
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Preview coming soon...
            </Typography>
          </Box>
        )}

        {/* Instructions at bottom - only show in Build mode */}
        {mode === 'build' && (
          <Box sx={{ mt: 2.5, pt: 2.5, borderTop: 1, borderColor: 'divider' }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                color: keyboardActiveField ? 'primary.main' : 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'center',
                textAlign: 'center',
                backgroundColor: keyboardActiveField ? 'primary.50' : 'transparent',
                px: keyboardActiveField ? 2 : 0,
                py: keyboardActiveField ? 1 : 0,
                borderRadius: keyboardActiveField ? 1 : 0,
                border: keyboardActiveField ? '1px solid' : 'none',
                borderColor: keyboardActiveField ? 'primary.200' : 'transparent',
                transition: 'all 0.2s ease-in-out',
                fontWeight: keyboardActiveField ? 500 : 400
              }}
            >
              Drag rows to reorder • Tab or click to focus fields, then ↑↓ to move within zone, ←→ to switch zones, Esc to exit
            </Typography>
          </Box>
        )}
      </Box>

      {/* Edit Group Title Modal */}
      <Dialog
        open={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            fontSize: 18,
            fontWeight: 600,
            lineHeight: 1.2
          }}
        >
          Edit Group Title
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 3 }}>
          <Box sx={{ mb: 1 }}>
            <Typography
              component="label"
              variant="body2"
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: 'text.primary',
                mb: 1,
                display: 'block'
              }}
            >
              Group Title
            </Typography>
            <TextField
              autoFocus
              fullWidth
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && editGroupName.trim()) {
                  handleSaveGroupTitle();
                }
              }}
              placeholder="e.g., Classification Information"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 40,
                  fontSize: 14,
                  '& fieldset': {
                    borderColor: 'divider'
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.600'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 1
                  }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setEditingGroup(null)}
            color="inherit"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveGroupTitle}
            variant="contained"
            disabled={!editGroupName.trim()}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};