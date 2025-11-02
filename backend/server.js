import express from "express";

import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import inSocket from './socket/index.js';
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});



inSocket(io)


server.listen(3001, () => {
  console.log(`server is running on port http://localhost:3001`);
});