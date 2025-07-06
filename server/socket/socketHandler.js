const Room = require('../models/Room');
const mongoose = require('mongoose');

const activeRooms = new Map(); // roomId -> Set of socketIds
const userCursors = new Map(); // socketId -> {roomId, x, y, color}

// Generate random color for user cursor
function generateUserColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Throttle function to limit cursor updates
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Assign a color to the user
    const userColor = generateUserColor();
    
    // Join room
    socket.on('join-room', async (roomId) => {
      try {
        if (!roomId) return;
        
        const normalizedRoomId = roomId.toUpperCase();
        socket.join(normalizedRoomId);
        
        // Track active rooms and users
        if (!activeRooms.has(normalizedRoomId)) {
          activeRooms.set(normalizedRoomId, new Set());
        }
        activeRooms.get(normalizedRoomId).add(socket.id);
        
        // Update user cursor info
        userCursors.set(socket.id, {
          roomId: normalizedRoomId,
          x: 0,
          y: 0,
          color: userColor
        });
        
        // Update room user count in database (if connected)
        if (mongoose.connection.readyState === 1) {
          try {
            const room = await Room.findOne({ roomId: normalizedRoomId });
            if (room) {
              room.activeUsers = activeRooms.get(normalizedRoomId).size;
              await room.save();
            }
          } catch (error) {
            console.error('Error updating room user count:', error);
          }
        }
        
        // Notify room of new user
        socket.to(normalizedRoomId).emit('user-joined', {
          userId: socket.id,
          userCount: activeRooms.get(normalizedRoomId).size,
          color: userColor
        });
        
        // Send current user count to the joining user
        socket.emit('room-info', {
          userCount: activeRooms.get(normalizedRoomId).size,
          userId: socket.id,
          color: userColor
        });
        
        console.log(`User ${socket.id} joined room ${normalizedRoomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });
    
    // Handle cursor movement with throttling
    const throttledCursorMove = throttle((data) => {
      const userCursor = userCursors.get(socket.id);
      if (userCursor) {
        userCursor.x = data.x;
        userCursor.y = data.y;
        
        socket.to(userCursor.roomId).emit('cursor-move', {
          userId: socket.id,
          x: data.x,
          y: data.y,
          color: userCursor.color
        });
      }
    }, 16); // ~60fps
    
    socket.on('cursor-move', throttledCursorMove);
    
    // Handle drawing events
    socket.on('draw-start', async (data) => {
      const userCursor = userCursors.get(socket.id);
      if (!userCursor) return;
      
      const drawingCommand = {
        type: 'stroke',
        data: {
          action: 'start',
          x: data.x,
          y: data.y,
          color: data.color,
          lineWidth: data.lineWidth
        },
        timestamp: new Date()
      };
      
      // Broadcast to room
      socket.to(userCursor.roomId).emit('draw-start', drawingCommand.data);
      
      try {
        // Save to database (if connected)
        if (mongoose.connection.readyState === 1) {
          const room = await Room.findOne({ roomId: userCursor.roomId });
          if (room) {
            room.drawingData.push(drawingCommand);
            await room.save();
          }
        }
      } catch (error) {
        console.error('Error saving draw-start:', error);
      }
    });
    
    socket.on('draw-move', async (data) => {
      const userCursor = userCursors.get(socket.id);
      if (!userCursor) return;
      
      const drawingCommand = {
        type: 'stroke',
        data: {
          action: 'move',
          x: data.x,
          y: data.y
        },
        timestamp: new Date()
      };
      
      // Broadcast to room
      socket.to(userCursor.roomId).emit('draw-move', drawingCommand.data);
      
      try {
        // Save to database (if connected)
        if (mongoose.connection.readyState === 1) {
          const room = await Room.findOne({ roomId: userCursor.roomId });
          if (room) {
            room.drawingData.push(drawingCommand);
            await room.save();
          }
        }
      } catch (error) {
        console.error('Error saving draw-move:', error);
      }
    });
    
    socket.on('draw-end', async () => {
      const userCursor = userCursors.get(socket.id);
      if (!userCursor) return;
      
      const drawingCommand = {
        type: 'stroke',
        data: {
          action: 'end'
        },
        timestamp: new Date()
      };
      
      // Broadcast to room
      socket.to(userCursor.roomId).emit('draw-end', drawingCommand.data);
      
      try {
        // Save to database (if connected)
        if (mongoose.connection.readyState === 1) {
          const room = await Room.findOne({ roomId: userCursor.roomId });
          if (room) {
            room.drawingData.push(drawingCommand);
            await room.save();
          }
        }
      } catch (error) {
        console.error('Error saving draw-end:', error);
      }
    });
    
    // Handle clear canvas
    socket.on('clear-canvas', async () => {
      const userCursor = userCursors.get(socket.id);
      if (!userCursor) return;
      
      const clearCommand = {
        type: 'clear',
        data: {},
        timestamp: new Date()
      };
      
      // Broadcast to room
      socket.to(userCursor.roomId).emit('clear-canvas');
      
      try {
        // Clear drawing data in database (if connected)
        if (mongoose.connection.readyState === 1) {
          const room = await Room.findOne({ roomId: userCursor.roomId });
          if (room) {
            room.drawingData = [clearCommand];
            await room.save();
          }
        }
      } catch (error) {
        console.error('Error clearing canvas:', error);
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      const userCursor = userCursors.get(socket.id);
      if (userCursor) {
        const roomId = userCursor.roomId;
        
        // Remove from active rooms
        if (activeRooms.has(roomId)) {
          activeRooms.get(roomId).delete(socket.id);
          
          const remainingUsers = activeRooms.get(roomId).size;
          
          // Update database (if connected)
          if (mongoose.connection.readyState === 1) {
            try {
              const room = await Room.findOne({ roomId });
              if (room) {
                room.activeUsers = remainingUsers;
                await room.save();
              }
            } catch (error) {
              console.error('Error updating user count:', error);
            }
          }
          
          // Notify remaining users
          socket.to(roomId).emit('user-left', {
            userId: socket.id,
            userCount: remainingUsers
          });
          
          // Clean up empty rooms
          if (remainingUsers === 0) {
            activeRooms.delete(roomId);
          }
        }
        
        // Remove cursor info
        userCursors.delete(socket.id);
      }
    });
  });
  
  // Cleanup old rooms every hour (only if MongoDB is connected)
  setInterval(async () => {
    if (mongoose.connection.readyState === 1) {
      try {
        const result = await Room.cleanupOldRooms();
        if (result.deletedCount > 0) {
          console.log(`Cleaned up ${result.deletedCount} old rooms`);
        }
      } catch (error) {
        console.error('Error cleaning up old rooms:', error);
      }
    }
  }, 60 * 60 * 1000); // 1 hour
};
