require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const Message = require("./models/Message");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
const io = socketIo(server, {
    cors: { origin: "*" }
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/match", matchRoutes);

app.get("/", (req, res) => {
    res.send("SkillSwap Backend Running!");
});

// Store online users { userId: socketId }
const onlineUsers = {};

io.on("connection", (socket) => {
    console.log("🔵 User connected:", socket.id);

    // User joins their personal chat room
    socket.on("join", (userId) => {
        if (userId) {
            socket.join(userId);
            onlineUsers[userId] = socket.id;
            io.emit("updateUsers", Object.keys(onlineUsers));
            console.log(`User ${userId} joined their chat.`);
        }
    });

    // Load previous chat messages
    socket.on("loadMessages", async ({ sender, receiver }) => {
        try {
            const messages = await Message.find({
                $or: [
                    { sender, receiver },
                    { sender: receiver, receiver: sender }
                ]
            }).sort({ createdAt: 1 });

            socket.emit("messagesLoaded", messages);
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    });

    // Sending messages
    socket.on("sendMessage", async ({ sender, receiver, message }) => {
        if (!sender || !receiver || !message) return;

        try {
            const newMessage = new Message({ sender, receiver, message });
            await newMessage.save();

            // Send message to sender and receiver
            io.to(sender).emit("receiveMessage", newMessage);
            io.to(receiver).emit("receiveMessage", newMessage);
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
        const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
        if (userId) {
            delete onlineUsers[userId];
            io.emit("updateUsers", Object.keys(onlineUsers));
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
