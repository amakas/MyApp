import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  socket = io("http://localhost:5000", {
    auth: {
      token: token,
    },
  });
  return socket;
};

export const getSocket = () => socket;
