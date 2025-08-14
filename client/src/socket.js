import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  const path = "https://toka-o14g.onrender.com";
  socket = io("http://localhost:5173/", {
    auth: {
      token: token,
    },
  });
  return socket;
};

export const getSocket = () => socket;
