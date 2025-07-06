import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

const WhiteboardContainer = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: transparent;
  margin: 1.5rem;
  margin-left: 0;
  border-radius: 20px;
  padding: 1rem;
`;

function Whiteboard({ socket, roomId, initialDrawingData }) {
  const [currentTool, setCurrentTool] = useState('pen');
  const [strokeColor, setStrokeColor] = useState('#667eea');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [cursors, setCursors] = useState(new Map());

  useEffect(() => {
    if (!socket) return;

    // Listen for cursor movements
    socket.on('cursor-move', (data) => {
      setCursors(prev => new Map(prev.set(data.userId, {
        x: data.x,
        y: data.y,
        color: data.color,
        lastSeen: Date.now()
      })));
    });

    // Remove cursors of users who left
    socket.on('user-left', (data) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.delete(data.userId);
        return newCursors;
      });
    });

    // Cleanup inactive cursors periodically
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setCursors(prev => {
        const newCursors = new Map();
        prev.forEach((cursor, userId) => {
          if (now - cursor.lastSeen < 5000) { // 5 seconds timeout
            newCursors.set(userId, cursor);
          }
        });
        return newCursors;
      });
    }, 1000);

    return () => {
      socket.off('cursor-move');
      socket.off('user-left');
      clearInterval(cleanupInterval);
    };
  }, [socket]);

  const handleClearCanvas = () => {
    if (socket) {
      socket.emit('clear-canvas');
    }
  };

  const handleCursorMove = (x, y) => {
    if (socket) {
      socket.emit('cursor-move', { x, y });
    }
  };

  return (
    <WhiteboardContainer>
      <Toolbar
        currentTool={currentTool}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        onToolChange={setCurrentTool}
        onColorChange={setStrokeColor}
        onWidthChange={setStrokeWidth}
        onClearCanvas={handleClearCanvas}
      />
      
      <CanvasArea>
        <DrawingCanvas
          socket={socket}
          currentTool={currentTool}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          initialDrawingData={initialDrawingData}
          onCursorMove={handleCursorMove}
        />
        
        <UserCursors cursors={cursors} />
      </CanvasArea>
    </WhiteboardContainer>
  );
}

export default Whiteboard;
