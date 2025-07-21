import Message from "../models/Message.js";
import { handleSocketMessage } from "./socketMessage.js";
import User from "../models/user.js";

export const handleSocketConnection = (io) => {
  io.on("connection", async (socket) => {
    handleSocketMessage(socket, io);
    const token = socket.handshake.auth.token;
    const userId = socket.handshake.auth.userId;

    await User.findByIdAndUpdate(userId, { isOnline: true });

    io.emit("userStatus", { userId, isOnline: true });
    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      io.emit("userStatus", { userId, isOnline: false });
    });
  });
};
