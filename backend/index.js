
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./db.js";
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';


import { v2 as cloudinary } from "cloudinary";

import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import { corsOption } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";
import { NEW_MESSAGE } from "./constants/events.js";
import { MessageSchema as Message } from "./models/messageSchema.js";
import { ChatSchema as Chat } from "./models/chatSchema.js";

// configuring the .env
dotenv.config({
    path: "./.env",
});

const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8000;
const userSocketIDs = new Map();

// express app
const app = express();


// connect to the database
connectDB(mongoURI);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// socket server
const server = createServer(app);
const io = new Server(server, { cors: corsOption });

// now we can access io from client request 
app.set('io', io);



// Using middleware here
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// app running status
app.get('/', (req, res) => {
    res.send("Hello World!!");
}) 


// routes HERE
app.use('/api/v1/user', userRoute);
app.use('/api/v1/posts', postRoute);


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

    socket.on(NEW_MESSAGE, async ({ selectedChat, message}) => {

        
        const otherUser = selectedChat;
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
            },
            receiver: {
                _id: otherUser?._id,
                name: otherUser?.name,
            },
            createdAt: new Date().toISOString()
        }

        const messageForDB = {
            content: message,
            sender: user?._id,
            receiver: otherUser?._id,
        }


        const memberSocket = [ userSocketIDs.get(otherUser?._id), userSocketIDs.get(user?._id?.toString())];
        console.log(otherUser?._id, user?._id);
        console.log(memberSocket)
        io.to(memberSocket).emit(NEW_MESSAGE, { message: messageForRealTime })
        
        try {
            const data = await Message.create(messageForDB);
            const messageId = data?._id?.toString();
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

})





// // simple run listen
// app.listen(PORT, () => {
//     console.log(`Server Running on http://localhost:${PORT}`);
// });

// for socket
server.listen(PORT, () => { 
    console.log(`Server Running on http://localhost:${PORT}`);
});




export { userSocketIDs };

