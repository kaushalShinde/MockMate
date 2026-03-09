
import dotenv from "dotenv";
// configuring the .env
dotenv.config({
    path: "./.env",
});

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./db.js";
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import testRoute from './routes/testRoute.js';


import { v2 as cloudinary } from "cloudinary";

import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import { corsOption } from "./constants/config.js";
import { socketAuthenticator, test } from "./middlewares/auth.js";
import { NEW_MESSAGE } from "./constants/events.js";
import { MessageSchema as Message } from "./models/messageSchema.js";
import { ChatSchema as Chat } from "./models/chatSchema.js";

import AWS from 'aws-sdk';
import mongoose from 'mongoose';
import { connectRedis } from "./redisClient.js";



const mongoURI = process.env.MONGODB_URI;
const redisURL = process.env.REDIS_URL;
const PORT = process.env.PORT || 8080;
const userSocketIDs = new Map();

// express app
const app = express();


// connect to the database
connectDB(mongoURI);
// connect redis cache
connectRedis(redisURL);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// configure AWS SES
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});



// socket server
const server = createServer(app);
const io = new Server(server, { cors: corsOption });

// now we can access io from client request 
app.set('io', io);

app.set("trust proxy", 1);


// Using middleware here
// app.use(cookieParser());
// app.use(cors(corsOption));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.options('*', cors(corsOption));

app.use(cors(corsOption));
app.options('*', cors(corsOption));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use((req, res, next) => {
//     console.log(`HIT: ${req.method} ${req.originalUrl}`);
//     if (Object.keys(req.query).length > 0) console.log("   Query:", req.query);
//     if (Object.keys(req.body).length > 0) console.log("   Body:", req.body);
//     next();
// });


// app running status
app.get('/', (req, res) => {
    return res.status(200).send("Hello World!!");
}) 

app.get("/health", (req, res) => {return res.status(200).send("OK")});


// routes HERE
app.use('/api/v1/user', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/test', testRoute);


// middleware so routes after that only accessible for valid users
io.use((socket, next) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (error) => await socketAuthenticator(error, socket, next)
    )
});


io.on('connection', (socket) => {
    
    const user = socket.user;
    console.log('User Connected: ', user.username);

    // map userId with the current socket id
    userSocketIDs.set(user._id?.toString(), socket?.id);
    console.log(userSocketIDs);

    // For Testing Socket Connection - 
    // socket.on('TEST', async ({ id, data }) => {
    //     console.log(id, data);

    //     socket.emit('TEST_RESULT', {
    //         success: true,
    //         data: "Tested Socket Successfully - from backend",
    //     });
    // })

    socket.on('NEW_MESSAGE', async ({ selectedChat, message}) => {

        console.log("NEW_MESSAGE ", user?.username, selectedChat?.username, message)
        const otherUser = selectedChat;
        otherUser._id = new mongoose.Types.ObjectId(otherUser?._id);

        // console.log(otherUser?._id, user?.id);

        const chat = await Chat.findOne({
            $and: [
                {users: user?._id},
                {users: otherUser?._id}
            ]
        })
        
        const messageForRealTime = {
            _id: uuid(),
            content: message,
            sender: {
                _id: user?._id,
                name: user.name,
                username: user?.username,
                avatar: user?.avatar,
            },
            receiver: {
                _id: otherUser?._id,
                name: otherUser?.name,
                username: otherUser?.username,
                avatar: otherUser?.avatar,
            },
            createdAt: new Date().toISOString()
        }

        const messageForDB = {
            content: message,
            sender: {
                _id: user?._id,
                username: user?.name,
                name: user?.name,
                avatar: user?.avatar,
            },
            receiver: {
                _id: otherUser?._id,
                username: otherUser?.name,
                name: otherUser?.name,
                avatar: otherUser?.avatar,
            },
        }


        // console.log(`MessageDB: `, messageForDB)
        // console.log(`MessageRealTime: `, messageForRealTime)

        const memberSocket = [ userSocketIDs.get(otherUser?._id?.toString()), userSocketIDs.get(user?._id?.toString())];
        // console.log(otherUser?._id, user?._id);
        // console.log(memberSocket)
        io.to(memberSocket).emit(NEW_MESSAGE, { message: messageForRealTime })
        
        try {
            const data = await Message.create(messageForDB);
            const messageId = data?._id?.toString();
            console.log('#############', data);
            chat.lastMessage = messageId;
            chat.save();
        }
        catch(error) {
            console.log(error);
        }
        
    })
    

    // socket.on('TEST_ZEGO', (data) => {
    //     console.log(data);

    //     console.log(data?.data?.sender?._id, data?.data?.receiver?._id);
    //     const memberSocket = [ userSocketIDs.get(data?.data?.receiver?._id), userSocketIDs.get(data?.data?.sender?._id) ];

    //     console.log(memberSocket);
    //     io.to(memberSocket).emit('TESTED_ZEGO', {message: "TESTED SUCCESSFULLY"})
    // })


    socket.on('CONNET_ZEGO_MEET', (data) => {

        // console.log(data?.request?.roomId);
        // const { sender, receiver, roomId } = data?.request;

        const memberSocket = [ userSocketIDs.get(data?.request?.sender?._id), userSocketIDs.get(data?.request?.receiver?._id) ];

        // console.log('CONNET_ZEGO_MEET', memberSocket);
        io.to(memberSocket).emit('ACCEPT_ZEGO_MEET', {success: true, data: data});
    })

    socket.on('ZEGO_MEET_CONFIRMATION', ({request, isMeetRequestAccepted}) => {

        // console.log(request, isMeetRequestAccepted);
        const memberSocket = [ userSocketIDs.get(request?.sender?._id), userSocketIDs.get(request?.receiver?._id) ];

        console.log('ZEGO_MEET_CONFIRMATION', memberSocket);
        isMeetRequestAccepted?.accepted 
            ? io.to(memberSocket).emit('ZEGO_MEET_ACCEPTED', {accepted: true})
            : io.to(memberSocket).emit('ZEGO_MEET_REJECTED', {accepted: false})

    })

    socket.on("disconnect", () => {
        const user = socket.user;
    
        // Remove user from map
        if (user?._id) {
            userSocketIDs.delete(user._id.toString());
            console.log(`User Disconnected: ${user.username}`);
        }
    
        // console.log("Current Socket Map:", userSocketIDs);
    });
    

})





// // simple run listen
// app.listen(PORT, () => {
//     console.log(`Server Running on http://localhost:${PORT}`);
// });


// if(process.env.NODE_ENV == 'development') {
//     server.listen(PORT, () => { 
//         console.log(`Server Running on http://localhost:${PORT}`);
//     });
// }
// else {
//     server.listen(PORT, '0.0.0.0', () => { 
//         console.log(`Server Running on http://0.0.0.0:${PORT}`);
//     });
// }


    server.listen(PORT, '0.0.0.0', () => { 
        console.log(`Server Running on http://0.0.0.0:${PORT}`);
    });

export { userSocketIDs };

