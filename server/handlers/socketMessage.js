import Message from "../models/Message.js";

export const handleSocketMessage = (socket, io) => {
  socket.on("message", async (data) => {
    try {
      const { content, username, receiverId, senderId } = data;

      const newMessage = new Message({
        content,
        username,
        createdAt: new Date(),
        receiverId,
        senderId,
      });
      await newMessage.save();
      io.emit("message", newMessage);
    } catch (error) {
      console.error("Error handling message", error);
    }
  });
};
