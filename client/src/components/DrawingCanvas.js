import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: ${props => 
    props.tool === 'eraser' ? 'grab' :
    props.tool === 'brush' ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'8\' fill=\'none\' stroke=\'%23667eea\' stroke-width=\'2\'/%3E%3C/svg%3E"), crosshair' :
    props.tool === 'marker' ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 16 16\'%3E%3Crect x=\'2\' y=\'2\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%23667eea\' stroke-width=\'2\'/%3E%3C/svg%3E"), crosshair' :
    'crosshair'
  };
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 16px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, 
    ${props => 
      props.tool === 'eraser' ? '#ff6b6b, #feca57' :
      props.tool === 'brush' ? '#667eea, #764ba2' :
      props.tool === 'marker' ? '#f093fb, #f5576c' :
      '#667eea, #764ba2'
    }
  );
  padding: 6px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 40px 80px rgba(0, 0, 0, 0.15),
      0 20px 40px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
`;

const Canvas = styled.canvas`
  display: block;
  background: ${props => {
    const toolBackgrounds = {
      pen: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      brush: 'linear-gradient(135deg, #fef5e7 0%, #fed7aa 20%, #ffffff 100%)',
      marker: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 20%, #ffffff 100%)',
      eraser: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 20%, #ffffff 100%)'
    };
    return toolBackgrounds[props.tool] || toolBackgrounds.pen;
  }};
  border-radius: 16px;
  width: 100%;
  height: 100%;
  box-shadow: 
    inset 0 2px 12px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:hover {
    box-shadow: 
      inset 0 2px 16px rgba(0, 0, 0, 0.12),
      inset 0 0 0 2px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    box-shadow: 
      inset 0 2px 20px rgba(0, 0, 0, 0.15),
      inset 0 0 0 3px rgba(102, 126, 234, 0.5);
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.1);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 16px;
  backdrop-filter: blur(4px);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PerformanceMonitor = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 0.5rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  line-height: 1.2;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 120px;
`;

function DrawingCanvas({ socket, currentTool, strokeColor, strokeWidth, initialDrawingData, onCursorMove }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  // eslint-disable-next-line 
  const [lastPoint, setLastPoint] = useState(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fps, setFps] = useState(60);
  const [strokeCount, setStrokeCount] = useState(0);

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
  }, []);

  // Tool switching animation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [currentTool]);

  // Redraw canvas from drawing data
  const redrawCanvas = useCallback(() => {
    const context = contextRef.current;
    if (!context || !initialDrawingData) return;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    let currentPath = null;
    
    initialDrawingData.forEach(command => {
      if (command.type === 'clear') {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        currentPath = null;
      } else if (command.type === 'stroke') {
        const { action, x, y, color, lineWidth } = command.data;
        
        if (action === 'start') {
          context.strokeStyle = color || '#000000';
          context.lineWidth = lineWidth || 2;
          context.beginPath();
          context.moveTo(x, y);
          currentPath = { x, y };
        } else if (action === 'move' && currentPath) {
          context.lineTo(x, y);
          context.stroke();
          currentPath = { x, y };
        } else if (action === 'end') {
          currentPath = null;
        }
      }
    });
  }, [initialDrawingData]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.imageSmoothingEnabled = true;
      contextRef.current = context;
      
      // Redraw from initial data
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [redrawCanvas]);

  // Redraw when initial data changes
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('draw-start', (data) => {
      const context = contextRef.current;
      if (!context) return;
      
      // Apply tool-specific settings
      const toolSettings = getToolSettings(data.tool || 'pen');
      Object.assign(context, toolSettings);
      
      context.strokeStyle = data.tool === 'eraser' ? '#000000' : (data.color || '#000000');
      context.lineWidth = data.tool === 'eraser' ? (data.lineWidth || 2) * 2 : (data.lineWidth || 2);
      context.beginPath();
      context.moveTo(data.x, data.y);
    });

    socket.on('draw-move', (data) => {
      const context = contextRef.current;
      if (!context) return;
      
      context.lineTo(data.x, data.y);
      context.stroke();
    });

    socket.on('draw-end', () => {
      // End the current path
    });

    socket.on('clear-canvas', () => {
      const context = contextRef.current;
      if (!context) return;
      
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    });

    return () => {
      socket.off('draw-start');
      socket.off('draw-move');
      socket.off('draw-end');
      socket.off('clear-canvas');
    };
  }, [socket]);

  // Get canvas coordinates from mouse event
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Get tool-specific drawing settings
  const getToolSettings = (tool) => {
    switch (tool) {
      case 'pen':
        return {
          lineCap: 'round',
          lineJoin: 'round',
          globalCompositeOperation: 'source-over',
          globalAlpha: 1
        };
      case 'brush':
        return {
          lineCap: 'round',
          lineJoin: 'round',
          globalCompositeOperation: 'source-over',
          globalAlpha: 0.8
        };
      case 'marker':
        return {
          lineCap: 'square',
          lineJoin: 'miter',
          globalCompositeOperation: 'multiply',
          globalAlpha: 0.7
        };
      case 'eraser':
        return {
          lineCap: 'round',
          lineJoin: 'round',
          globalCompositeOperation: 'destination-out',
          globalAlpha: 1
        };
      default:
        return {
          lineCap: 'round',
          lineJoin: 'round',
          globalCompositeOperation: 'source-over',
          globalAlpha: 1
        };
    }
  };

  // Drawing event handlers
  const startDrawing = (e) => {
    const coords = getCanvasCoordinates(e);
    const context = contextRef.current;
    
    if (!context) return;

    setIsDrawing(true);
    setLastPoint(coords);
    setStrokeCount(prev => prev + 1);
    
    // Apply tool-specific settings
    const toolSettings = getToolSettings(currentTool);
    Object.assign(context, toolSettings);
    
    context.strokeStyle = currentTool === 'eraser' ? '#000000' : strokeColor;
    context.lineWidth = currentTool === 'eraser' ? strokeWidth * 2 : strokeWidth;
    context.beginPath();
    context.moveTo(coords.x, coords.y);
    
    // Emit to socket
    if (socket) {
      socket.emit('draw-start', {
        x: coords.x,
        y: coords.y,
        color: strokeColor,
        lineWidth: strokeWidth,
        tool: currentTool
      });
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const coords = getCanvasCoordinates(e);
    const context = contextRef.current;
    
    if (!context) return;

    context.lineTo(coords.x, coords.y);
    context.stroke();
    
    setLastPoint(coords);
    
    // Emit to socket
    if (socket) {
      socket.emit('draw-move', {
        x: coords.x,
        y: coords.y
      });
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setLastPoint(null);
    
    // Emit to socket
    if (socket) {
      socket.emit('draw-end');
    }
  };

  // Handle mouse movement for cursor tracking
  const handleMouseMove = (e) => {
    const coords = getCanvasCoordinates(e);
    
    // Send cursor position
    if (onCursorMove) {
      onCursorMove(coords.x, coords.y);
    }
    
    // Draw if currently drawing
    if (isDrawing) {
      draw(e);
    }
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    handleMouseMove(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  return (
    <CanvasContainer ref={containerRef} tool={currentTool}>
      <Canvas
        ref={canvasRef}
        tool={currentTool}
        onMouseDown={startDrawing}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <LoadingOverlay show={isLoading}>
        <LoadingSpinner />
      </LoadingOverlay>
      <PerformanceMonitor>
        FPS: {fps}<br/>
        Strokes: {strokeCount}<br/>
        Tool: {currentTool.toUpperCase()}
      </PerformanceMonitor>
    </CanvasContainer>
  );
}

export default DrawingCanvas;
