import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
`;

const Header = styled.header`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(20px);
  padding: 1.25rem 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 600;
`;

const InfoBadge = styled.div`
  background: linear-gradient(135deg, #667eea20, #764ba220);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid #667eea30;
  
  strong {
    color: #667eea;
    font-weight: 700;
  }
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${props => props.connected 
    ? 'linear-gradient(135deg, #68d39120, #38a16920)' 
    : 'linear-gradient(135deg, #fc818120, #f5656520)'
  };
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.connected ? '#68d39130' : '#fc818130'};
  
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

const LeaveButton = styled.button`
  background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 101, 101, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
  text-align: center;
  animation: ${props => props.fadeOut ? 'fadeOut 1s ease-out forwards' : 'none'};
  
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: scale(1.1);
    }
  }
`;

const LoadingLogo = styled.div`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 2rem;
  animation: logoFloat 3s ease-in-out infinite;
  background: linear-gradient(45deg, #ffffff, #f0f9ff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  
  @keyframes logoFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
  }
`;

const LoadingSpinner2 = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 2rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.9;
  margin: 0;
  animation: textPulse 2s ease-in-out infinite;
  
  @keyframes textPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
`;

const WelcomeMessage = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(79, 172, 254, 0.3);
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.5s ease-out;
  display: ${props => props.show ? 'block' : 'none'};
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
`;

const Notification = styled.div`
  background: linear-gradient(135deg, ${props => 
    props.type === 'success' ? '#48bb78, #38a169' :
    props.type === 'error' ? '#f56565, #e53e3e' :
    props.type === 'warning' ? '#ed8936, #dd6b20' :
    '#4299e1, #3182ce'
  });
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  pointer-events: auto;
  transform: translateX(${props => props.show ? '0' : '100%'});
  opacity: ${props => props.show ? 1 : 0};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateX(0) scale(1.02);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
  }
`;

const NotificationIcon = styled.span`
  font-size: 1.2rem;
  animation: bounce 0.6s ease-in-out;
  
  @keyframes bounce {
    0%, 20%, 60%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
    80% { transform: translateY(-3px); }
  }
`;

function App() {
  const [socket, setSocket] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [drawingData, setDrawingData] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Initial loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      setShowWelcome(true);
      
      // Hide welcome message after 3 seconds
      setTimeout(() => setShowWelcome(false), 3000);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('room-info', (data) => {
      setUserCount(data.userCount);
    });

    newSocket.on('user-joined', (data) => {
      setUserCount(data.userCount);
      showNotification(`A new artist joined the room!`, 'success');
    });

    newSocket.on('user-left', (data) => {
      setUserCount(data.userCount);
      showNotification(`An artist left the room.`, 'error');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const showNotification = (message, type) => {
    const id = Date.now();
    setNotifications(notifications => [...notifications, { id, message, type, show: true }]);
    
    setTimeout(() => {
      setNotifications(notifications => 
        notifications.map(notification => 
          notification.id === id ? { ...notification, show: false } : notification
        )
      );
    }, 3000);
  };

  const joinRoom = async (roomId) => {
    setLoading(true);
    setFadeOut(false);
    try {
      // Join room via API to get drawing data
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      });

      if (!response.ok) {
        throw new Error('Failed to join room');
      }

      const roomData = await response.json();
      setCurrentRoom(roomData.roomId);
      setDrawingData(roomData.drawingData);

      // Join room via socket
      socket.emit('join-room', roomData.roomId);
      
      // Simulate loading time
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return { success: true, roomId: roomData.roomId };
    } catch (error) {
      console.error('Error joining room:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('leave-room', currentRoom);
    }
    setCurrentRoom(null);
    setUserCount(0);
    setDrawingData([]);
  };

  const createNewRoom = async () => {
    setLoading(true);
    setFadeOut(false);
    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const roomData = await response.json();
      return await joinRoom(roomData.roomId);
    } catch (error) {
      console.error('Error creating room:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return (
    <AppContainer>
      {/* Initial Loading Screen */}
      <LoadingScreen show={isInitialLoading}>
        <LoadingLogo>🎨 Whiteboard</LoadingLogo>
        <LoadingSpinner2 />
        <LoadingText>Initializing creative workspace...</LoadingText>
      </LoadingScreen>

      {/* Action Loading Screen */}
      <LoadingScreen show={loading} fadeOut={fadeOut}>
        <LoadingLogo>WB</LoadingLogo>
        <LoadingSpinner2 />
        <LoadingText>Processing request...</LoadingText>
      </LoadingScreen>

      {/* Welcome Message */}
      <WelcomeMessage show={showWelcome && !currentRoom}>
        🎉 Welcome to the most advanced collaborative whiteboard! Start creating amazing art together.
      </WelcomeMessage>

      {!currentRoom ? (
        <RoomJoin 
          onJoinRoom={joinRoom} 
          onCreateRoom={createNewRoom}
          isConnected={isConnected}
        />
      ) : (
        <>
          <Header>
            <Title>🎨 Collaborative Whiteboard</Title>
            <RoomInfo>
              <InfoBadge>Room: <strong>{currentRoom}</strong></InfoBadge>
              <InfoBadge>Artists: <strong>{userCount}</strong></InfoBadge>
              <ConnectionStatus connected={isConnected}>
                {isConnected ? '🟢 Live' : '🔴 Offline'}
              </ConnectionStatus>
              <LeaveButton onClick={leaveRoom}>
                ← Leave Room
              </LeaveButton>
            </RoomInfo>
          </Header>
          <Whiteboard 
            socket={socket} 
            roomId={currentRoom}
            initialDrawingData={drawingData}
          />
        </>
      )}

      {/* Notifications */}
      <NotificationContainer>
        {notifications.map(notification => (
          <Notification key={notification.id} type={notification.type} show={notification.show}>
            <NotificationIcon>ℹ️</NotificationIcon>
            {notification.message}
          </Notification>
        ))}
      </NotificationContainer>
    </AppContainer>
  );
}

export default App;
