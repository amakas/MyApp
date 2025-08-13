import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  socket = io("https://toka-o14g.onrender.com", {
    auth: {
      token: token,
    },
  });
  return socket;
};

export const getSocket = () => socket;
