import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Message, SocketUser } from './types';
import fetch from 'node-fetch';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers: SocketUser[] = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle user authentication
  socket.on('authenticate', (userData: { userId: string; userRole: 'client' | 'lawyer' }) => {
    const { userId, userRole } = userData;
    
    // Add user to connected users
    connectedUsers.push({
      userId,
      socketId: socket.id,
      userRole
    });

    // Join user to their personal room
    socket.join(userId);

    // Notify others about new user
    socket.broadcast.emit('user-connected', { userId, userRole });
  });

  // Handle joining a conversation
  socket.on('join-conversation', (conversationId: string) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Handle leaving a conversation
  socket.on('leave-conversation', (conversationId: string) => {
    socket.leave(conversationId);
    console.log(`User ${socket.id} left conversation ${conversationId}`);
  });

  // Handle sending messages
  socket.on('send-message', (message: Message) => {
    // Broadcast the message to all users in the conversation
    io.to(message.conversationId).emit('new-message', message);
  });

  // Handle typing indicators
  socket.on('typing', ({ conversationId, isTyping, userId }) => {
    socket.to(conversationId).emit('typing', { conversationId, isTyping, userId });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove user from connected users
    const userIndex = connectedUsers.findIndex(user => user.socketId === socket.id);
    if (userIndex !== -1) {
      const user = connectedUsers[userIndex];
      connectedUsers.splice(userIndex, 1);
      
      // Notify others about user disconnection
      socket.broadcast.emit('user-disconnected', { userId: user.userId, userRole: user.userRole });
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', connectedUsers: connectedUsers.length });
});

// Hugging Face IPC search proxy endpoint
app.post('/api/ipc-search', async (req, res) => {
  const { query } = req.body;
  try {
    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/google/flan-t5-large',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: `Give me details and related cases for IPC section or topic: ${query}`
        })
      }
    );
    if (!hfRes.ok) {
      return res.status(500).json({ error: 'Hugging Face API error' });
    }
    const data = await hfRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 