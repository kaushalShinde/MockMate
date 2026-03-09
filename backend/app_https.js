import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import https from "https";
import http from "http";
import path from "path";

import connectDB from "./connection/db.js";
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';

import { v2 as cloudinary } from "cloudinary";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { corsOption } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";
import { NEW_MESSAGE } from "./constants/events.js";
import { MessageSchema as Message } from "./models/messageSchema.js";
import { ChatSchema as Chat } from "./models/chatSchema.js";

// ENV
dotenv.config({ path: "./.env" });

const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 443;
const userSocketIDs = new Map();
const __dirname = path.resolve();

// Setup app
const app = express();
connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.send("Hello World!!");
});

// Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/posts', postRoute);

// Load SSL certificates (make sure certs exist in production)
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'selfsigned.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'selfsigned.crt')),
};

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);

// Attach Socket.IO to HTTPS server
const io = new Server(httpsServer, {
  cors: corsOption,
});

app.set('io', io);

// Socket.io Auth
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (error) => {
    await socketAuthenticator(error, socket, next);
  });
});

// Socket Events
io.on('connection', (socket) => {
  const user = socket.user;
  console.log('User Connected: ', user.username);

  userSocketIDs.set(user._id?.toString(), socket?.id);
  console.log(userSocketIDs);

  socket.on(NEW_MESSAGE, async ({ selectedChat, message }) => {
    const otherUser = selectedChat;

    const chat = await Chat.findOne({
      $and: [
        { users: user?._id },
        { users: otherUser?._id }
      ]
    });

    const messageForRealTime = {
      _id: uuid(),
      content: message,
      sender: {
        _id: user?._id,
        name: user.name,
      },
      receiver: {
        _id: otherUser?._id,
        name: otherUser?.name,
      },
      createdAt: new Date().toISOString()
    };

    const messageForDB = {
      content: message,
      sender: user?._id,
      receiver: otherUser?._id,
    };

    const memberSocket = [
      userSocketIDs.get(otherUser?._id),
      userSocketIDs.get(user?._id?.toString())
    ];

    io.to(memberSocket).emit(NEW_MESSAGE, { message: messageForRealTime });

    try {
      const data = await Message.create(messageForDB);
      const messageId = data?._id?.toString();
      chat.lastMessage = messageId;
      chat.save();
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('CONNET_ZEGO_MEET', (data) => {
    const memberSocket = [
      userSocketIDs.get(data?.request?.sender?._id),
      userSocketIDs.get(data?.request?.receiver?._id)
    ];
    io.to(memberSocket).emit('ACCEPT_ZEGO_MEET', { success: true, data: data });
  });

  socket.on('ZEGO_MEET_CONFIRMATION', ({ request, isMeetRequestAccepted }) => {
    const memberSocket = [
      userSocketIDs.get(request?.sender?._id),
      userSocketIDs.get(request?.receiver?._id)
    ];
    isMeetRequestAccepted?.accepted
      ? io.to(memberSocket).emit('ZEGO_MEET_ACCEPTED', { accepted: true })
      : io.to(memberSocket).emit('ZEGO_MEET_REJECTED', { accepted: false });
  });
});

// 🔐 HTTPS server
httpsServer.listen(PORT, () => {
  console.log(`✅ HTTPS Server running at https://localhost:${PORT}`);
});

// 🌐 Optional: HTTP to HTTPS redirect
http.createServer((req, res) => {
  res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log("🌐 HTTP Server running on port 80 and redirecting to HTTPS");
});

export { userSocketIDs };
