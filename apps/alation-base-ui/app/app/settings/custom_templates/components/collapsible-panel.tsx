import React, { ReactNode, useState, useCallback, useRef, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

interface CollapsiblePanelProps {
  children: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  toggleButtonTop?: string | number;
  backgroundColor?: string;
  borderRight?: boolean;
  onWidthChange?: (width: number) => void;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  children,
  isExpanded,
  onToggle,
  defaultWidth = 320,
  minWidth = 240,
  maxWidth = 600,
  toggleButtonTop = '56px',
  backgroundColor,
  borderRight = true,
  onWidthChange
}) => {
  const theme = useTheme();
  const defaultBgColor = backgroundColor || theme.palette.neutral[50] || '#f9f9f9';

  const [currentWidth, setCurrentWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; width: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isExpanded) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      width: currentWidth
    });
  }, [isExpanded, currentWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const deltaX = e.clientX - dragStart.x;
    const newWidth = Math.min(maxWidth, Math.max(minWidth, dragStart.width + deltaX));

    setCurrentWidth(newWidth);
    onWidthChange?.(newWidth);
  }, [isDragging, dragStart, minWidth, maxWidth, onWidthChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      <Box
        ref={panelRef}
        sx={{
          width: isExpanded ? `${currentWidth}px` : '24px',
          minWidth: isExpanded ? `${currentWidth}px` : '24px',
          maxWidth: isExpanded ? `${currentWidth}px` : '24px',
          height: '100%',
          borderRight: borderRight ? '1px solid' : 'none',
          borderColor: 'divider',
          overflow: 'hidden',
          transition: isDragging ? 'none' : 'all 0.2s',
          backgroundColor: defaultBgColor,
          flexShrink: 0
        }}
      >
        <Box sx={{
          width: '100%',
          height: '100%',
          visibility: isExpanded ? 'visible' : 'hidden',
          overflow: 'hidden'
        }}>
          {children}
        </Box>
      </Box>

      {/* Blue accent line with resize handle and toggle button */}
      <Box
        sx={{
          height: '100%',
          position: 'absolute',
          width: isExpanded ? '6px' : '2px',
          zIndex: theme.zIndex.appBar + 1,
          left: isExpanded ? `${currentWidth - 3}px` : '22px', // Position at right edge when collapsed (24px - 2px)
          transition: isDragging ? 'none' : 'left 0.2s',
          cursor: isExpanded ? 'col-resize' : 'default',
          display: 'flex',
          alignItems: 'stretch',
        }}
        onMouseDown={isExpanded ? handleMouseDown : undefined} // Only draggable when expanded
      >
        {/* Visible blue line with hover effect */}
        <Box
          sx={{
            width: '2px',
            height: '100%',
            backgroundColor: theme.palette.primary.main,
            marginLeft: isExpanded ? '2px' : '0',
            transition: 'background-color 0.15s, box-shadow 0.15s',
            '&:hover': isExpanded ? {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
            } : {},
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: toggleButtonTop,
            left: isExpanded ? '50%' : '-11px', // Center on line when expanded, centered on blue line when collapsed (1px - 12px = -11px)
            transform: isExpanded ? 'translateX(-50%)' : 'none',
            pointerEvents: 'auto',
            zIndex: 1,
          }}
        >
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              borderRadius: '4px !important',
              height: '24px',
              width: '24px',
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                borderRadius: '4px !important',
              },
            }}
          >
            {isExpanded ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </IconButton>
        </Box>
      </Box>
    </>
  );
};