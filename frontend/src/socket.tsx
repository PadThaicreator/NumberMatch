
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_PATH_BACKEND || "http://localhost:3001");

export default socket;
