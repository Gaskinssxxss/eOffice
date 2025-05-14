require("dotenv").config();
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const path = require("path");
const ChatMessage = require("./model/chat");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  let currentUser = null;

  socket.on("join", async (username) => {
    currentUser = username;
    onlineUsers.set(username, socket.id);
    const unreadDocs = await ChatMessage.find({
      to: username,
      read: false,
    }).distinct("from");
    socket.emit("unread_list", unreadDocs);
  });

  socket.on("send_message", async (payload) => {
    await ChatMessage.create({
      from: payload.from,
      to: payload.to,
      text: payload.text,
      timestamp: payload.timestamp,
    });

    const target = onlineUsers.get(payload.to);
    if (target) io.to(target).emit("receive_message", payload);

    const unreadDocs = await ChatMessage.find({
      to: payload.to,
      read: false,
    }).distinct("from");
    if (target) io.to(target).emit("unread_list", unreadDocs);
  });

  socket.on("get_history", async ({ withUser }) => {
    const history = await ChatMessage.find({
      $or: [
        { from: currentUser, to: withUser },
        { from: withUser, to: currentUser },
      ],
    })
      .sort("timestamp")
      .lean();
    socket.emit("history", history);
  });

  socket.on("clear_unread", async ({ withUser }) => {
    await ChatMessage.updateMany(
      { from: withUser, to: currentUser, read: false },
      { $set: { read: true } }
    );
    const unreadDocs = await ChatMessage.find({
      to: currentUser,
      read: false,
    }).distinct("from");
    socket.emit("unread_list", unreadDocs);
  });

  socket.on("disconnect", () => {
    if (currentUser) onlineUsers.delete(currentUser);
  });
});

app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const apiRoutes = require("./routes");
app.use("/api", apiRoutes);
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "public", "index.html"))
);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
