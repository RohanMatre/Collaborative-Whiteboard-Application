import React from 'react';
import styled from 'styled-components';

const CursorsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
`;

const Cursor = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  pointer-events: none;
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(${props => props.x}px, ${props => props.y}px);
  z-index: 10;
`;

const CursorIcon = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid ${props => props.color};
  border-right: 10px solid transparent;
  border-bottom: 14px solid ${props => props.color};
  border-top: 10px solid transparent;
  transform: rotate(-45deg);
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    width: 0;
    height: 0;
    border-left: 8px solid rgba(255, 255, 255, 0.9);
    border-right: 8px solid transparent;
    border-bottom: 12px solid rgba(255, 255, 255, 0.9);
    border-top: 8px solid transparent;
  }
`;

const CursorLabel = styled.div`
  position: absolute;
  top: 24px;
  left: 8px;
  background: ${props => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 8px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid ${props => props.color};
  }
`;

function UserCursors({ cursors }) {
  return (
    <CursorsContainer>
      {Array.from(cursors.entries()).map(([userId, cursor]) => (
        <Cursor key={userId} x={cursor.x} y={cursor.y}>
          <CursorIcon color={cursor.color} />
          <CursorLabel color={cursor.color}>
            User {userId.slice(-4)}
          </CursorLabel>
        </Cursor>
      ))}
    </CursorsContainer>
  );
}

export default UserCursors;
