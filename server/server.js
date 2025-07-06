const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const roomRoutes = require('./routes/rooms');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collaborative-whiteboard';

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.log('❌ MongoDB connection error:', err.message);
  console.log('\n📋 To fix this issue:');
  console.log('1. Install and start MongoDB locally, OR');
  console.log('2. Update MONGODB_URI in server/.env with your MongoDB Atlas connection string');
  console.log('3. For quick setup, create a free MongoDB Atlas account at: https://www.mongodb.com/atlas');
  console.log('\n⚠️  Server will continue running but database features will not work.\n');
});

// Routes
app.use('/api/rooms', roomRoutes);

// Socket handling
socketHandler(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
