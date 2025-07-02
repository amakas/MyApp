import Message from '../models/Message.js'
import { handleSocketMessage } from './socketMessage.js';

export const handleSocketConnection = (io) => {
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  handleSocketMessage(socket, io)

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});
}
