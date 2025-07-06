const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/Room');

// Generate random room ID
function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST /api/rooms/join - Join or create a room
router.post('/join', async (req, res) => {
  try {
    const { roomId } = req.body;
    
    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, using in-memory room');
      return res.json({
        roomId: roomId.toUpperCase(),
        drawingData: [],
        message: 'Joined room (in-memory mode - database not connected)'
      });
    }

    // Check if room exists
    let room = await Room.findOne({ roomId: roomId.toUpperCase() });
    
    if (!room) {
      // Create new room if it doesn't exist
      room = new Room({
        roomId: roomId.toUpperCase(),
        drawingData: []
      });
      await room.save();
    } else {
      // Update last activity
      room.lastActivity = new Date();
      await room.save();
    }

    res.json({
      roomId: room.roomId,
      drawingData: room.drawingData,
      message: room.drawingData.length === 0 ? 'New room created' : 'Joined existing room'
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/rooms/:roomId - Get room info
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const room = await Room.findOne({ roomId: roomId.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({
      roomId: room.roomId,
      createdAt: room.createdAt,
      lastActivity: room.lastActivity,
      drawingData: room.drawingData,
      activeUsers: room.activeUsers
    });
  } catch (error) {
    console.error('Error getting room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rooms/create - Create a new room with generated ID
router.post('/create', async (req, res) => {
  try {
    let roomId;
    let roomExists = true;
    
    // Generate unique room ID
    while (roomExists) {
      roomId = generateRoomId();
      const existingRoom = await Room.findOne({ roomId });
      roomExists = !!existingRoom;
    }
    
    const room = new Room({
      roomId,
      drawingData: []
    });
    
    await room.save();
    
    res.json({
      roomId: room.roomId,
      message: 'New room created'
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
