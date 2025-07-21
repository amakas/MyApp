import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  socket = io("http://localhost:5000", {
    auth: {
      token: localStorage.getItem("token"),
      userId: localStorage.getItem("userId"),
    },
  });
  return socket;
};

export const getSocket = () => socket;
