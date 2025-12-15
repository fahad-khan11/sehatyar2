import { io } from "socket.io-client";

export const initSocket = (userId: string) => {
  const socket = io("https://sehatyarr-c23468ec8014.herokuapp.com", {
    query: { userId },
    transports: ["websocket"],
  });
  return socket;
};
