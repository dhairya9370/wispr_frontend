import { Box, useTheme } from '@mui/material';
import { useState, useRef } from 'react';

export default function ResizableSplit({ left, right, chatActive }) {
  const [leftWidth, setLeftWidth] = useState(400); // default sidebar width
  const resizerRef = useRef();
  
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setLeftWidth(Math.max(200, Math.min(500, newWidth))); // limit min/max width
    };
    
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const theme=useTheme();
  
  return (
    <div className="split-container" style={{ height: "100%", display: "flex" }}>
      {chatActive ? (
        <Box
          className="split-left"
          sx={{ 
            width: leftWidth,
            display: { xs: "none", sm: "none", md: "none", lg: "block" },
            flexShrink: 0
          }}
        >
          {left}
        </Box>
      ) : (
        <Box
          className="split-left"
          sx={{
            width: { xs: "100%", sm: "100%", md: leftWidth },
            display: "block",
            flexShrink: 0
          }}
        >
          {left}
        </Box>
      )}

      <Box
        className="split-resizer"
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        sx={{
          width: 8,
          backgroundColor: theme.palette.action.hover,
          cursor: "col-resize",
          flexShrink: 0,
          "&:hover": {
            backgroundColor:theme.palette.action.selected
          },
          display: chatActive
            ? { xs: "none", sm: "none", md: "none", lg: "block" }
            : { xs: "none", sm: "none", md: "block" }
        }}
      />
      
      <Box
        className="split-right"
        sx={{
          flex: 1,
          minWidth: chatActive ? "auto" : 300,
          overflow: "hidden",
          display: chatActive
            ? "block"
            : { xs: "none", sm: "none", md: "block" }
        }}
      >
        {right}
      </Box>
    </div>
  );
}