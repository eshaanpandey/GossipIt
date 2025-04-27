import "dotenv/config";
import express from "express";
import http from "node:http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Message from "./models/Message.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// Fetch all messages
app.get("/messages", async (req, res) => {
  try {
    const msgs = await Message.find().sort("createdAt");
    res.json(msgs);
  } catch (e) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async ({ username, text }) => {
    const msg = new Message({ username, text });
    await msg.save();
    io.emit("newMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

io.on("join", ({ username }) => {
  // Notify everyone else
  socket.broadcast.emit("userJoined", `${username} has joined the chat`);
});

app.get("/", (req, res) => res.send("Server running"));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
