import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
  }
`;

const toolHover = keyframes`
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-2px) scale(1.02); }
  100% { transform: translateY(0) scale(1); }
`;

const ToolbarContainer = styled.div`
  width: 340px;
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 252, 0.95) 50%,
    rgba(237, 242, 247, 0.92) 100%
  );
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  padding: 2.5rem;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  z-index: 10;
  border-radius: 0 28px 28px 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe);
    background-size: 400% 100%;
    animation: gradient 4s ease infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(245, 87, 108, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
  
  @keyframes gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const ToolSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
  
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, #667eea20, transparent);
    border-radius: 1px;
  }
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ToolButton = styled.button`
  width: 100%;
  height: 60px;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  };
  color: ${props => props.active ? 'white' : '#4a5568'};
  border: 2px solid ${props => props.active ? '#667eea' : 'transparent'};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  position: relative;
  overflow: hidden;
  
  &.tool-hover {
    animation: ${toolHover} 0.6s ease-in-out;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: ${props => props.active 
      ? '0 12px 32px rgba(102, 126, 234, 0.4)' 
      : '0 12px 32px rgba(0, 0, 0, 0.15)'
    };
    border-color: #667eea;
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.01);
  }
  
  span {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
  }
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ColorButton = styled.button`
  width: 100%;
  height: 55px;
  border: 3px solid ${props => props.selected ? '#667eea' : 'rgba(255, 255, 255, 0.6)'};
  border-radius: 16px;
  background: ${props => props.color};
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  transform: ${props => props.selected ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)'};
  
  &.color-pulse {
    animation: ${pulse} 1s ease-in-out infinite;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &::after {
    content: '${props => props.selected ? '✓' : ''}';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 1.2rem;
    font-weight: 900;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.2),
      0 0 0 4px rgba(102, 126, 234, 0.3);
    border-color: #667eea;
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.03);
  }
  
  ${props => props.selected && `
    box-shadow: 
      0 0 0 4px #667eea, 
      0 12px 32px rgba(102, 126, 234, 0.4),
      inset 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  `}
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SliderLabel = styled.label`
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #e2e8f0, #cbd5e0);
  outline: none;
  -webkit-appearance: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(to right, #cbd5e0, #a0aec0);
  }
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 
      0 4px 12px rgba(102, 126, 234, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 
      0 6px 20px rgba(102, 126, 234, 0.4),
      0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 
      0 4px 12px rgba(102, 126, 234, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const StrokePreview = styled.div`
  height: 40px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #cbd5e0;
    background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  }
`;

const StrokeLine = styled.div`
  width: 80%;
  height: ${props => props.width}px;
  background: linear-gradient(90deg, ${props => props.color}, ${props => props.color}99);
  border-radius: ${props => props.width / 2}px;
  min-height: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${float} 3s ease-in-out infinite;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${props => props.danger 
    ? 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)' 
    : props.primary 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
  };
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.danger 
      ? '0 8px 25px rgba(245, 101, 101, 0.4)' 
      : props.primary 
        ? '0 8px 25px rgba(102, 126, 234, 0.4)'
        : '0 8px 25px rgba(113, 128, 150, 0.4)'
    };
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ShimmerButton = styled(ActionButton)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  background-size: 200% 200%;
  animation: ${shimmer} 3s ease-in-out infinite;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #2d3748;
  }
`;

const ToolWrapper = styled.div`
  position: relative;
  
  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-4px);
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
`;

const UndoRedoContainer = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const UndoRedoButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: ${props => props.disabled 
    ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)' 
    : 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)'
  };
  color: ${props => props.disabled ? '#a0aec0' : 'white'};
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(56, 161, 105, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
  }
`;

const FeatureTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeatureDescription = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #718096;
  line-height: 1.4;
`;

const colors = [
  { name: 'Midnight', value: '#2d3748' },
  { name: 'Crimson', value: '#e53e3e' },
  { name: 'Ocean', value: '#3182ce' },
  { name: 'Emerald', value: '#38a169' },
  { name: 'Sunset', value: '#dd6b20' },
  { name: 'Purple', value: '#805ad5' },
  { name: 'Pink', value: '#d53f8c' },
  { name: 'Teal', value: '#319795' },
  { name: 'Gold', value: '#f6e05e' },
  { name: 'Coral', value: '#ff7a7a' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Lime', value: '#84cc16' }
];

const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-4px) scale(1.1);
    box-shadow: 
      0 12px 48px rgba(102, 126, 234, 0.6),
      0 8px 24px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }
  
  &:active {
    transform: translateY(-2px) scale(1.05);
  }
`;

const QuickToolsMenu = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: ${props => props.show ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)'};
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  min-width: 200px;
`;

const QuickTool = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
    color: #667eea;
    transform: translateX(4px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ShortcutsPanel = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
`;

const ShortcutItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ShortcutKey = styled.kbd`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ShortcutLabel = styled.span`
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
`;

function Toolbar({ 
  currentTool, 
  strokeColor, 
  strokeWidth, 
  onToolChange, 
  onColorChange, 
  onWidthChange, 
  onClearCanvas 
}) {
  const [hoveredTool, setHoveredTool] = useState(null);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [activeTime, setActiveTime] = useState(0);
  const [showQuickTools, setShowQuickTools] = useState(false);

  // Simulate usage stats
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    setStrokeCount(prev => prev + 1);
  }, [currentTool]);

  const tools = [
    { id: 'pen', name: 'Pen', icon: '✏️', description: 'Precise drawing tool' },
    { id: 'brush', name: 'Brush', icon: '🖌️', description: 'Artistic painting brush' },
    { id: 'marker', name: 'Marker', icon: '🖊️', description: 'Bold highlighting marker' },
    { id: 'eraser', name: 'Eraser', icon: '🧽', description: 'Remove unwanted strokes' }
  ];

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <>
      <ToolbarContainer>
        <ToolSection>
          <SectionTitle>Session Stats</SectionTitle>
          <StatsBar>
            <StatItem>
              <StatNumber>{strokeCount}</StatNumber>
              <StatLabel>Strokes</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{formatTime(activeTime)}</StatNumber>
              <StatLabel>Time</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{tools.length}</StatNumber>
              <StatLabel>Tools</StatLabel>
            </StatItem>
          </StatsBar>
        </ToolSection>

        <ToolSection>
          <SectionTitle>Drawing Tools</SectionTitle>
          <ToolGrid>
            {tools.map((tool) => (
              <ToolWrapper key={tool.id}>
                <ToolButton
                  active={currentTool === tool.id}
                  onClick={() => onToolChange(tool.id)}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  className={hoveredTool === tool.id ? 'tool-hover' : ''}
                >
                  <span style={{ fontSize: '1.8rem' }}>{tool.icon}</span>
                  <span>{tool.name}</span>
                </ToolButton>
                <Tooltip show={hoveredTool === tool.id}>
                  {tool.description}
                </Tooltip>
              </ToolWrapper>
            ))}
          </ToolGrid>
        </ToolSection>

        <ToolSection>
          <SectionTitle>Color Palette</SectionTitle>
          <ColorPalette>
            {colors.map((color) => (
              <ColorButton
                key={color.value}
                color={color.value}
                selected={strokeColor === color.value}
                onClick={() => onColorChange(color.value)}
                onMouseEnter={() => setHoveredColor(color.value)}
                onMouseLeave={() => setHoveredColor(null)}
                title={color.name}
                className={hoveredColor === color.value ? 'color-pulse' : ''}
              />
            ))}
          </ColorPalette>
        </ToolSection>

        <ToolSection>
          <SectionTitle>Stroke Settings</SectionTitle>
          <SliderContainer>
            <SliderLabel>
              <span>Width</span>
              <span style={{ 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '800'
              }}>
                {strokeWidth}px
              </span>
            </SliderLabel>
            <Slider
              type="range"
              min="1"
              max="30"
              value={strokeWidth}
              onChange={(e) => onWidthChange(parseInt(e.target.value))}
            />
            <StrokePreview>
              <StrokeLine 
                width={strokeWidth} 
                color={strokeColor}
              />
            </StrokePreview>
          </SliderContainer>
        </ToolSection>

        <ToolSection>
          <SectionTitle>Canvas Actions</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <UndoRedoContainer>
              <UndoRedoButton disabled={true}>
                ↶ Undo
              </UndoRedoButton>
              <UndoRedoButton disabled={true}>
                ↷ Redo
              </UndoRedoButton>
            </UndoRedoContainer>
            
            <ShimmerButton primary>
              💾 Save Canvas
            </ShimmerButton>
            <ActionButton 
              danger 
              onClick={onClearCanvas}
            >
              🗑️ Clear Canvas
            </ActionButton>
          </div>
        </ToolSection>

        <ToolSection>
          <SectionTitle>Pro Features</SectionTitle>
          <FeatureCard>
            <FeatureTitle>🎨 Advanced Brushes</FeatureTitle>
            <FeatureDescription>
              Professional-grade brushes with pressure sensitivity and texture options
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureTitle>🔄 Version History</FeatureTitle>
            <FeatureDescription>
              Auto-save and restore previous versions of your artwork
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureTitle>👥 Team Collaboration</FeatureTitle>
            <FeatureDescription>
              Real-time collaboration with up to 50 users simultaneously
            </FeatureDescription>
          </FeatureCard>
        </ToolSection>

        <ToolSection>
          <SectionTitle>⌨️ Shortcuts</SectionTitle>
          <ShortcutsPanel>
            <ShortcutItem>
              <ShortcutLabel>Pen Tool</ShortcutLabel>
              <ShortcutKey>P</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Brush Tool</ShortcutLabel>
              <ShortcutKey>B</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Eraser</ShortcutLabel>
              <ShortcutKey>E</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Clear Canvas</ShortcutLabel>
              <ShortcutKey>⌘ + Del</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Undo</ShortcutLabel>
              <ShortcutKey>⌘ + Z</ShortcutKey>
            </ShortcutItem>
          </ShortcutsPanel>
        </ToolSection>

        <ToolSection>
          <SectionTitle>Keyboard Shortcuts</SectionTitle>
          <ShortcutsPanel>
            <ShortcutItem>
              <ShortcutLabel>Pen Tool</ShortcutLabel>
              <ShortcutKey>V</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Brush Tool</ShortcutLabel>
              <ShortcutKey>B</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Marker Tool</ShortcutLabel>
              <ShortcutKey>M</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Eraser Tool</ShortcutLabel>
              <ShortcutKey>E</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Save Canvas</ShortcutLabel>
              <ShortcutKey>Ctrl + S</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Clear Canvas</ShortcutLabel>
              <ShortcutKey>Ctrl + N</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Undo</ShortcutLabel>
              <ShortcutKey>Ctrl + Z</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutLabel>Redo</ShortcutLabel>
              <ShortcutKey>Ctrl + Y</ShortcutKey>
            </ShortcutItem>
          </ShortcutsPanel>
        </ToolSection>
      </ToolbarContainer>

      <FloatingButton onClick={() => setShowQuickTools(prev => !prev)}>
        {showQuickTools ? '−' : '+'}
      </FloatingButton>

      <QuickToolsMenu show={showQuickTools}>
        <QuickTool onClick={() => onToolChange('pen')}>
          <span>✏️</span>
          <span>Pen</span>
        </QuickTool>
        <QuickTool onClick={() => onToolChange('brush')}>
          <span>🖌️</span>
          <span>Brush</span>
        </QuickTool>
        <QuickTool onClick={() => onToolChange('marker')}>
          <span>🖊️</span>
          <span>Marker</span>
        </QuickTool>
        <QuickTool onClick={() => onToolChange('eraser')}>
          <span>🧽</span>
          <span>Eraser</span>
        </QuickTool>
        <QuickTool onClick={onClearCanvas} style={{ color: '#e53e3e' }}>
          <span>🗑️</span>
          <span>Clear Canvas</span>
        </QuickTool>
      </QuickToolsMenu>
    </>
  );
}

export default Toolbar;
