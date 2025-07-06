# Collaborative Whiteboard Application

A real-time collaborative whiteboard application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.io for live collaboration.

## Features

### 🎨 Premium Drawing Experience
- **Advanced Drawing Tools**: Pen, Brush, Marker, and Eraser with unique visual styles
- **Extensive Color Palette**: 12+ carefully curated colors with animated selection
- **Adjustable Stroke Width**: Fine-tuned control from 1px to 20px
- **Tool-Specific Canvas Backgrounds**: Dynamic visual feedback for each drawing tool
- **Smooth Drawing**: Optimized canvas rendering with 60fps performance monitoring

### 🚀 Real-time Collaboration
- **Live Multi-user Drawing**: Seamless real-time synchronization across all users
- **Room-based System**: Join rooms using simple alphanumeric codes (6-8 characters)
- **Live Cursor Tracking**: See other users' cursor positions with elegant animated cursors
- **User Presence**: Real-time display of active users in each room
- **Persistent Drawing**: Canvas state automatically saved and restored

### 💎 Premium UI/UX
- **Glassmorphism Design**: Modern frosted glass effects throughout the interface
- **Advanced Animations**: Shimmer effects, floating animations, and smooth transitions
- **Dark/Light Mode**: Elegant theme switcher with animated transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Touch Support**: Full touch and gesture support for mobile drawing

### 📊 Professional Tools
- **Session Statistics**: Track stroke count, session time, and tool usage
- **Performance Monitor**: Real-time FPS counter and performance metrics
- **Floating Action Button**: Quick access to essential tools
- **Keyboard Shortcuts**: Pro-level shortcuts for rapid tool switching
- **Undo/Redo System**: (Coming soon) Full drawing history management

### 🎯 Advanced Features
- **Quick Tools Menu**: Rapid tool switching with animated menu
- **Loading Overlays**: Smooth loading states with elegant spinners
- **Notification System**: User-friendly feedback for all actions
- **Pro Features Showcase**: Preview of upcoming premium capabilities
- **Tool Tooltips**: Helpful guidance for all drawing tools

## Technology Stack

- **Frontend**: React.js with Styled Components and advanced CSS-in-JS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Real-time Communication**: Socket.io for instant collaboration
- **Styling**: Styled Components with custom animations and glassmorphism effects
- **Performance**: Optimized canvas rendering with RAF-based drawing loops

## Technical Highlights

### 🔧 Performance Optimizations
- **60fps Canvas Rendering**: Smooth drawing with RequestAnimationFrame
- **Debounced Socket Events**: Optimized real-time data transmission
- **Memory-efficient State Management**: Minimal re-renders and optimal updates
- **Canvas Performance Monitoring**: Real-time FPS tracking and diagnostics

### 🎨 Advanced Styling Architecture
- **Styled Components**: Modular, themeable component architecture
- **CSS-in-JS Animations**: Keyframe animations with hardware acceleration
- **Responsive Grid System**: Flexible layouts for all screen sizes
- **Custom Design System**: Consistent spacing, colors, and typography

### 🔄 State Management
- **React Hooks**: Modern functional component patterns
- **Socket.io Integration**: Seamless real-time state synchronization
- **Local Storage**: Persistent user preferences and settings
- **Error Boundary**: Robust error handling and recovery

## Project Structure

```
collaborative-whiteboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoomJoin.js          # Room code input
│   │   │   ├── Whiteboard.js        # Main whiteboard component
│   │   │   ├── DrawingCanvas.js     # Canvas drawing logic
│   │   │   ├── Toolbar.js           # Drawing controls
│   │   │   └── UserCursors.js       # Display other users' cursors
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/
│   │   └── Room.js         # MongoDB schema
│   ├── routes/
│   │   └── rooms.js        # API endpoints
│   ├── socket/
│   │   └── socketHandler.js # Socket.io event handling
│   ├── server.js
│   ├── .env
│   └── package.json
├── README.md
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-whiteboard
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install-all
   ```

3. **Set up MongoDB**
   - **Local MongoDB**: Make sure MongoDB is running on `mongodb://localhost:27017`
   - **MongoDB Atlas**: Update the `MONGODB_URI` in `server/.env` with your connection string

4. **Configure environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB connection string if needed
   ```

5. **Start the application**
   ```bash
   # From the root directory
   npm start
   ```

   This will start both the frontend (React) and backend (Express) servers concurrently.

   **Alternative: Start servers separately**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/api/health

## Usage

### 🚀 Getting Started

1. **Create or Join a Room**
   - Click "Create New Room" to generate a new room with a random code
   - Or enter an existing room code (6-8 characters) and click "Join Room"
   - Enjoy the animated welcome experience with theme selection

2. **Drawing Tools**
   - **Pen**: Standard drawing tool for precise lines
   - **Brush**: Soft, artistic strokes with texture
   - **Marker**: Bold, highlighted drawing style
   - **Eraser**: Remove parts of your drawing
   
3. **Color Selection**
   - Choose from 12+ carefully curated colors
   - Click any color in the palette for instant selection
   - Enjoy smooth color transition animations

### 🎨 Advanced Features

4. **Canvas Controls**
   - **Stroke Width**: Adjust from 1px to 20px with real-time preview
   - **Clear Canvas**: Remove all drawings with confirmation
   - **Performance Monitor**: Track FPS and drawing performance
   - **Background Themes**: Auto-switching based on selected tool

5. **Collaboration Tools**
   - **Live Cursors**: See other users' cursor movements in real-time
   - **User Presence**: Monitor active users in the session
   - **Real-time Sync**: All drawings appear instantly for all users
   - **Persistent Canvas**: Drawings saved automatically

### ⚡ Pro Tips

6. **Keyboard Shortcuts** (UI available, implementation coming soon)
   - `P` - Switch to Pen tool
   - `B` - Switch to Brush tool
   - `M` - Switch to Marker tool
   - `E` - Switch to Eraser tool
   - `C` - Clear canvas
   - `Ctrl+Z` - Undo last action
   - `Ctrl+Y` - Redo last action

7. **Quick Access Features**
   - **Floating Action Button**: Quick tool switching
   - **Quick Tools Menu**: Rapid access to favorite tools
   - **Session Stats**: View stroke count, time, and tool usage
   - **Theme Toggle**: Switch between dark and light modes

8. **Mobile Experience**
   - Full touch support for drawing and navigation
   - Responsive design optimized for tablets and phones
   - Gesture-friendly interface with proper touch targets

## API Documentation

### REST Endpoints

#### POST /api/rooms/join
Join an existing room or create a new one if it doesn't exist.

**Request Body:**
```json
{
  "roomId": "ABC123"
}
```

**Response:**
```json
{
  "roomId": "ABC123",
  "drawingData": [...],
  "message": "Joined existing room"
}
```

#### GET /api/rooms/:roomId
Get information about a specific room.

**Response:**
```json
{
  "roomId": "ABC123",
  "createdAt": "2023-...",
  "lastActivity": "2023-...",
  "drawingData": [...],
  "activeUsers": 3
}
```

#### POST /api/rooms/create
Create a new room with a generated room ID.

**Response:**
```json
{
  "roomId": "XYZ789",
  "message": "New room created"
}
```

### Socket Events

#### Client → Server

- **`join-room`**: Join a room
  ```javascript
  socket.emit('join-room', roomId);
  ```

- **`cursor-move`**: Send cursor position
  ```javascript
  socket.emit('cursor-move', { x: 100, y: 200 });
  ```

- **`draw-start`**: Start drawing stroke
  ```javascript
  socket.emit('draw-start', { x: 100, y: 200, color: '#000', lineWidth: 2 });
  ```

- **`draw-move`**: Continue drawing stroke
  ```javascript
  socket.emit('draw-move', { x: 105, y: 205 });
  ```

- **`draw-end`**: End drawing stroke
  ```javascript
  socket.emit('draw-end');
  ```

- **`clear-canvas`**: Clear the canvas
  ```javascript
  socket.emit('clear-canvas');
  ```

#### Server → Client

- **`room-info`**: Room information on join
- **`user-joined`**: New user joined the room
- **`user-left`**: User left the room
- **`cursor-move`**: Other user's cursor position
- **`draw-start`**: Other user started drawing
- **`draw-move`**: Other user's drawing data
- **`draw-end`**: Other user finished drawing
- **`clear-canvas`**: Canvas was cleared

## Architecture Overview

### High-Level System Design

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   React Client  │ ←──────────────→ │   Express.js    │
│                 │                  │   + Socket.io   │
│   - Drawing UI  │    HTTP/REST    │                 │
│   - Real-time   │ ←──────────────→ │   - API Routes  │
│     cursors     │                  │   - Socket      │
│   - Canvas      │                  │     Handling    │
└─────────────────┘                  └─────────────────┘
                                              │
                                              │ Mongoose
                                              ▼
                                     ┌─────────────────┐
                                     │    MongoDB      │
                                     │                 │
                                     │   - Room Data   │
                                     │   - Drawing     │
                                     │     Commands    │
                                     └─────────────────┘
```

### Key Components

1. **Frontend (React)**
   - **Canvas Management**: HTML5 Canvas for drawing
   - **Real-time Updates**: Socket.io client for live collaboration
   - **State Management**: React hooks for local state
   - **Responsive UI**: Styled Components for modern design

2. **Backend (Express + Socket.io)**
   - **REST API**: Room management endpoints
   - **WebSocket Handling**: Real-time event processing
   - **Data Persistence**: MongoDB integration
   - **Performance Optimization**: Throttled cursor updates

3. **Database (MongoDB)**
   - **Room Schema**: Store room metadata and drawing commands
   - **Drawing Commands**: Efficient storage of incremental drawing data
   - **Automatic Cleanup**: Remove inactive rooms after 24 hours

### Data Flow

1. **User Joins Room**:
   - Frontend calls REST API to join/create room
   - Receives existing drawing data
   - Establishes WebSocket connection
   - Redraws canvas from stored commands

2. **Drawing Actions**:
   - Canvas captures mouse/touch events
   - Drawing data sent via WebSocket
   - Server broadcasts to room participants
   - Commands stored in MongoDB for persistence

3. **Cursor Tracking**:
   - Mouse movements throttled to ~60fps
   - Cursor positions sent via WebSocket
   - Other users see real-time cursor updates
   - Inactive cursors automatically cleaned up

## Deployment Guide

### Development Deployment

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Production Build**
   ```bash
   cd client
   npm run build
   ```

### Production Deployment

#### Using Docker (Recommended)

1. **Create Dockerfile** (backend):
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Deploy to cloud platform** (Heroku, AWS, Digital Ocean, etc.)

#### Environment Variables for Production

```bash
# Server
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whiteboard
FRONTEND_URL=https://your-frontend-domain.com

# Client
REACT_APP_SERVER_URL=https://your-backend-domain.com
```

#### MongoDB Atlas Setup

1. Create MongoDB Atlas account
2. Create a new cluster
3. Set up database user and network access
4. Get connection string and update `MONGODB_URI`

#### SSL and Security

- Use HTTPS in production
- Configure CORS properly
- Set up rate limiting
- Use environment variables for sensitive data

## Performance Considerations

- **Cursor Updates**: Throttled to 60fps to prevent server overload
- **Drawing Data**: Incremental updates instead of full canvas data
- **Memory Management**: Automatic cleanup of inactive rooms and cursors
- **Database Optimization**: Indexed queries for room lookup
- **Canvas Optimization**: Efficient redrawing algorithms

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common problems
- Review the console logs for debugging information

## Future Enhancements

- [ ] Multiple drawing tools (rectangle, circle, text)
- [ ] Undo/Redo functionality
- [ ] Layers support
- [ ] Export canvas as image
- [ ] User authentication
- [ ] Room permissions and moderation
- [ ] Voice/video chat integration
- [ ] Mobile app development
