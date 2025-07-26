import Message from "../models/Message.js";
import { handleSocketMessage } from "./socketMessage.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const handleSocketConnection = (io) => {
  io.on("connection", async (socket) => {
    handleSocketMessage(socket, io);
    const token = socket.handshake.auth.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await User.findByIdAndUpdate(decoded.id, { isOnline: true });

    io.emit("userStatus", { userId: decoded.id, isOnline: true });
    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(decoded.id, {
        isOnline: false,
        lastSeen: new Date(),
      });

      io.emit("userStatus", { userId: decoded.id, isOnline: false });
    });
  });
};
