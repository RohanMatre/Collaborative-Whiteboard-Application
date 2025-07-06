import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${props => props.darkMode 
    ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    animation: float 20s infinite ease-in-out;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(1deg); }
  }
`;

const Card = styled.div`
  background: ${props => props.darkMode 
    ? 'linear-gradient(145deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.9))'
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))'
  };
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: ${props => props.darkMode ? '#e2e8f0' : '#2d3748'};
  padding: 3.5rem;
  border-radius: 24px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  max-width: 480px;
  width: 90%;
  position: relative;
  z-index: 2;
  border: 1px solid ${props => props.darkMode 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.3)'
  };
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 40px 80px rgba(0, 0, 0, 0.2),
      0 20px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  margin-bottom: 2.5rem;
  color: #718096;
  font-size: 1.1rem;
  font-weight: 500;
`;

const InputGroup = styled.div`
  margin-bottom: 2rem;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 700;
  color: #4a5568;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 
      0 0 0 3px rgba(102, 126, 234, 0.1),
      0 4px 12px rgba(102, 126, 234, 0.15);
    background: #ffffff;
    transform: translateY(-1px);
  }
  
  &::placeholder {
    text-transform: none;
    letter-spacing: normal;
    color: #a0aec0;
    font-weight: 500;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
  };
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
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
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary 
      ? '0 8px 25px rgba(102, 126, 234, 0.4)' 
      : '0 8px 25px rgba(160, 174, 192, 0.4)'
    };
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  }
  
  span {
    padding: 0 1.5rem;
    color: #a0aec0;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const ConnectionStatus = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.connected 
      ? 'linear-gradient(135deg, #68d391, #38a169)' 
      : 'linear-gradient(135deg, #fc8181, #f56565)'
    };
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fed7d7, #feb2b2);
  color: #742a2a;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid #fca5a5;
`;

const ThemeToggle = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 60px;
  height: 30px;
  border-radius: 15px;
  border: none;
  background: ${props => props.darkMode 
    ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)' 
    : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
  };
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.15);
  
  &::before {
    content: '${props => props.darkMode ? '🌙' : '☀️'}';
    position: absolute;
    top: 50%;
    left: ${props => props.darkMode ? '32px' : '6px'};
    transform: translateY(-50%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.9rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.darkMode ? '33px' : '3px'};
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 
      inset 0 2px 8px rgba(0, 0, 0, 0.15),
      0 6px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ParticleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

function RoomJoin({ onJoinRoom, onCreateRoom, isConnected }) {
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const result = await onJoinRoom(roomId.trim());
    
    if (!result.success) {
      setError(result.error || 'Failed to join room');
    }
    
    setIsLoading(false);
  };

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setError('');
    
    const result = await onCreateRoom();
    
    if (!result.success) {
      setError(result.error || 'Failed to create room');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    setRoomId(value);
    setError('');
  };

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <Container darkMode={darkMode}>
      <ConnectionStatus connected={isConnected}>
        {isConnected ? '🟢 Connected' : '🟡 Connecting...'}
      </ConnectionStatus>
      
      <ThemeToggle darkMode={darkMode} onClick={toggleTheme} />
      
      <Card darkMode={darkMode}>
        <Title>Collaborative Whiteboard</Title>
        <Subtitle>Join a room to start drawing together</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleJoinRoom}>
          <InputGroup>
            <Label htmlFor="roomId">Room Code</Label>
            <Input
              id="roomId"
              type="text"
              value={roomId}
              onChange={handleInputChange}
              placeholder="Enter room code (e.g., ABC123)"
              disabled={isLoading || !isConnected}
            />
          </InputGroup>
          
          <Button 
            type="submit" 
            primary
            disabled={isLoading || !isConnected || !roomId.trim()}
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </Button>
        </form>
        
        <Divider>
          <span>or</span>
        </Divider>
        
        <Button 
          type="button"
          onClick={handleCreateRoom}
          disabled={isLoading || !isConnected}
        >
          {isLoading ? 'Creating...' : 'Create New Room'}
        </Button>
      </Card>
      
      <ParticleCanvas />
    </Container>
  );
}

export default RoomJoin;
