

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema as User } from '../models/userSchema.js';
import { ChatSchema as Chat } from '../models/chatSchema.js';
import { RequestSchema as Request } from '../models/requestSchema.js';
import { NotificationSchema as Notification } from '../models/notificationSchema.js';
import { MessageSchema as Message } from '../models/messageSchema.js';

import { newUserValidator, loginValidator } from '../lib/validators.js';
import { comparePassword, hashPassword } from '../lib/authHelper.js';
import { emitEvent, uploadFilesToCloudinary } from '../utils/features.js';


const newUser = async (req, res) => {
    try{
        // console.log(req.body);
        // console.log(req.file);

        const { name, username, password, bio, organization, designation } = req.body;
        const file = req.file;

        const validationResult = newUserValidator(req);
        if(!validationResult?.success){
            return res.status(404).json(validationResult);
        }

        // check whether user already present with given username
        const userExists = await User.findOne({username});
        if(userExists){
            return res.status(400).json({
                success: false,
                message: "User with this username already exists",
            })
        }

        // todo
        // upload file to cloudinary
        const result = await uploadFilesToCloudinary([file]);

        const avatar = {
            public_id: result[0].public_id,
            url: result[0].url,
        };

        // todo
        // hash password
        const hashedPassword = await hashPassword(password);

        // const user = {
        //     name: name,
        //     username: username,
        //     password: hashedPassword,
        //     bio: bio,
        //     avatar: avatar,
        //     organization: organization,
        //     designation: designation,
        // }
        const user = await User.create({
            name: name,
            username: username,
            password: hashedPassword,
            bio: bio,
            avatar: avatar,
            organization: organization,
            designation: designation,
        });

        const createdUser = await User.findOne({username: username});
        const jwtData = {
            _id: createdUser?._id,
        }
        const token = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.cookie('auth-token', token, {maxAge: 24 * 60 * 60 * 1000});
        res.status(201).json({
            user,
            token,
            success: true,
            message: "User Created Successfully!!",
        })
    }
    catch(error) {
        console.log('newUserRoute: ', error);
        return res.status(500).json({
            success: false,
            message:  "Error creating new User",
        })
    }
}

const login = async (req, res) => {
    try{
        const { username, password } = req.body;

        const validationResult = loginValidator(req);
        if(!validationResult?.success){
            return res.status(404).json(validationResult);
        }

        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid Username"
            })
        }

        const isPasswordMatched = await comparePassword(password, user?.password);
        if(!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            })
        }
        
        const jwtData = {
            _id: user?._id,
        }
        const token = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.cookie('auth-token', token, {maxAge: 24 * 60 * 60 * 1000});
        res.status(200).json({
            user,
            token,
            success: true,
            message: `Welcome Back, ${user.name}`,
        })
    }
    catch(error) {
        console.log('loginRoute: ', error);
        return res.status(500).json({
            success: false,
            message:  "Internal Server Error Login",
        })
    }
}

const logout = async (req, res) => {
    try{
        return res.status(200).cookie('auth-token', "").json({
            success: true,
            message: "Logged out Successfully!!",
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:  "Internal Server Error Logout",
        })
    }
}

const getMyProfile = async (req, res) => {
    try{
        const userId = req?.user;
        const user = await User.findOne({_id: userId});
        // console.log(user);

        if(!user || !userId){
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            })
        }

        res.status(201).json({
            success: true,
            message: "Fetched Profile Successfully",
            user,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Internal Server Error",
        })
    }
}

const getOtherUserProfile = async (req, res) => {
    try{
        const username = req.params?.username;
        const user = await User.findOne({username: username});

        if(!user || !username){
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            })
        }

        res.status(201).json({
            success: true,
            message: "Fetched Profile Successfully",
            user,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Internal Server Error",
        })
    }
}

const sendFriendRequest = async (req, res) => {
    try{
        const { userId } = req.body;
        const me = await User.findOne({_id: req.user});

        const checkRequest = await Request.findOne({
            $or: [
                { sender: req?.user, receiver: userId },
                { sender: userId, receiver: req?.user },
            ]
        });

        if(checkRequest) {
            return res.status(400).json({
                success: false,
                message: "Request Already Sent",
            })
        }

        const request = await Request.create({
            sender: req?.user,
            receiver: userId,
        });
        const requestId = request?._id;

        // TODO
        // Store request in notification
        // EMIT Event for realtime notification
        
        const notification = await Notification.create({
            user: userId,
            notification: `${me?.username} sent you friend request.`,
            category: "request",
            requestId: requestId,
        })

        return res.status(200).json({
            success: true,
            message: "Friend Request Send",
            notification,
            
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
};

const acceptFriendRequest = async (req, res) => {
    try{
        const { requestId, deleteNotificationId } = req.body;
        const user = req?.user;

        console.log('accept request: ', requestId, deleteNotificationId);

        const request = await Request.findOne({_id: requestId})
            .populate('sender', '_id username')
            .populate('receiver', '_id username');

        // console.log('request: ', request);
        if(!request) {
            return res.status(404).json({
                success: false,
                message: "Request Not Found",
            })
        }

        const senderId = request?.sender?._id;
        const receiverId = request?.receiver?._id;

        if(receiverId?.toString() !== user?.toString()){
            return res.status(401).json({
                success: false,
                message: "You are not Authorized",
            })
        }
        
        const members = [senderId, receiverId];
        // console.log(members);

        // todo
        // Create chat between two also reflect it in realtime friends of user

        // todo
        // notification
        await Notification.deleteOne({_id: deleteNotificationId})


        // EMIT Event realtime notification
        await Notification.create({
            user: senderId,
            notification: `${request?.receiver?.username} Accepted Friend Request!!`,
        })

        // const availableChat = await Chat.find({
        //     $or: [
        //         {users: [senderId, receiverId]},
        //         {users: [receiverId, senderId]}
        //     ]
        // })

        // if(availableChat){
        //     return res.status(403).json({
        //         success: false,
        //         message: "Already Friends",
        //     })
        // }

        // create and save Chat
        await Chat.create({
            users: members,
        })

        // delete request from db
        await request.deleteOne();


        // todo
        // emit event with refetch chats


        return res.status(200).json({
            success: true,
            senderId: senderId,
            message: "request accepted successfully",
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
};

const rejectFriendRequest = async (req, res) => {
    try{
        const { requestId } = req.body;
        const user = req?.user;

        const request = await Request.findOne({_id: requestId})
            .populate('sender', '_id username')
            .populate('receiver', '_id username');

        // console.log('request: ', request);
        if(!request) {
            return res.status(404).json({
                success: false,
                message: "Request Not Found",
            })
        }

        const senderId = request?.sender?._id;
        const receiverId = request?.receiver?._id;

        if(receiverId?.toString() !== user?.toString()){
            return res.status(401).json({
                success: false,
                message: "You are not Authorized",
            })
        }

        // todo
        // notification to sender
        const notification = await Notification.create({
            user: senderId,
            content: `${request?.receiver?.username} rejected you friend request.`,
        })

        // delete request from db
        await request.deleteOne();


        // todo 
        // emit event => refetch notification that request is rejected 

        return res.status(200).json({
            success: true,
            message: "request accepted successfully",
            senderId: senderId,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

const getAllNotifications = async (req, res) => {
    try{
        const userId = req?.user;
        // console.log(userId)

        const notifications = await Notification.find({ user: userId })
            .populate('user', 'avatar username name')
            .sort({createdAt: -1});

        const allNotifications = notifications.map(({_id, user, category, requestId, notification, status}) => ({
            _id,
            user, 
            category,
            requestId, 
            notification,
            status,
        }))

        return res.status(200).json({
            success: true,
            allNotifications,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

const getMyFriends = async (req, res) => {
    try{
        const userId = req.user;
    
        // const chats = await Chat.find({
        //     users: userId,
        // }).populate('users lastMessage', '_id username name avatar lastActive sender receiver content attachments')
        //     .populate('lastMessage', 'sender receiver content attachments');

        const chats = await Chat.find({
            users: userId,
        }).populate({
            path: 'users',
            select: '_id username name avatar lastActive',
        }).populate({
            path: 'lastMessage',
            select: 'sender receiver content attachments',
        }).sort({ updatedAt: -1 });


        // console.log(chats);
        const allChats = chats.map(chat => {
            const otherUsers = chat.users.filter(user => user._id.toString() !== userId.toString());
            return {
                ...chat._doc,
                users: otherUsers,
            };
        });

        // console.log(allChats);
        // console.log(allChats);
        // allChats.map((chat) => {
        //     console.log(chat?.users);
        // })

        return res.status(200).json({
            success: true,
            chats: allChats,
        })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

const checkIsFriendAlready = async (req, res) => {
    try{
        const userId = req.user;
        // const { otherUser } = req.body;
        const { creatorId } = req.params;

        const otherUser = creatorId;

        if(creatorId === undefined) {
            return res.status(404).json({
                success: false,
                message: "Id not found",
            })
        }

        // check if the user is itself post creator or not
        if(userId == otherUser) {
            return res.status(200).json({
                success: true,
                isFriend: true,
                request: null,
                chats: [],
            })
        }
        
        const checkRequest = await Request.findOne({
            $or: [
                { sender: otherUser, receiver: userId },
                { sender: userId, receiver: otherUser },
            ]
        });

        const chats = await Chat.find({
            $or: [
                { users: [userId, otherUser] },
                { users: [otherUser, userId] },
            ]
        }).populate('users', '_id username name');

        const friend = (chats.length > 0);
        return res.status(200).json({
            success: true,
            isFriend: friend,
            request: checkRequest,
            chats: chats,
        })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

const getAllMessages = async (req, res) => {
    try {
  
      const chatId = req?.params?.id;
      const page = req?.params?.page;
    //   const { page = 1 } = req.query;

      console.log('getAllMessages: ', chatId, page);
  
      const perPage = 15;
      const skip = (page - 1) * perPage;
      
    //   const chat = await Chat.findById({users: req.user});
    //   if(!chat) return res.status(404).json({success: false, message: "Chat Not Found"})
  
    //   if(!chat.users.includes(req.user.toString())){
    //     return res.status(401).json({
    //       success: false,
    //       message: "You thought I'm Fool...?",
    //     })
    //   }
  
        // console.log(chatId, req.user);
      const messages = await Message.find({
        $or: [
            { sender: chatId, receiver: req.user },
            { sender: req.user, receiver: chatId }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .populate('sender receiver', '_id username name avatar lastActive')
      .lean();
  
      const totalMessagesCount = await Message.countDocuments({
        $or: [
            { sender: chatId, receiver: req.user },
            { sender: req.user, receiver: chatId }
        ]
      });
  
      const totalPages = Math.ceil(totalMessagesCount / perPage) || 0;
  
      res.status(200).json({
        success: true,
        message: messages,  // .reverse()
        totalMessagesCount,
        totalPages,
      })
    }
    catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error Getting Messages",
        error
      });
    }
}

const sendAttachments = async (req, res) => {
    try {
        const { selectedUser } = req.body;
        const files = req.files || [];

        if(files.length <= 0) {
            return res.status(400).json({
                success: false,
                message: "Files not found"
            })
        }
        if(files.length > 5) {
            return res.status(400).json({
                success: false,
                message: "Select less then 5 files"
            })
        }

        
        const chat = await Chat.find({
            $or: [
                { users: [req?.user, selectedUser] },
                { users: [selectedUser, req?.user] },
            ]
        }).populate('users', '_id username name');

        const me = await User.findById(req?.user);
        const otherUser = await User.findById(selectedUser);

        if(!chat || !otherUser){
            return res.status(404).json({
                success: false,
                message: "Chats not found",
            })
        }


        const attachments = await uploadFilesToCloudinary(files);
        if(!attachments){
            return res.status(500).json({
                success: false,
                message: "Internal Server Error Uploading Files",
            })
        }

        // message for realtime 
        // emit socket event
        const messageForRealTime = {
            content: "",
            attachments: attachments,
            sender: {
                _id: me?._id,
                username: me?.username,
                name: me?.name,
            },
            receiver: {
                _id: otherUser?._id,
                username: otherUser?.username,
                name: otherUser?.name,
            },
        }

        // message for db
        const messageForDB = {
            content: "",
            attachments: attachments,
            sender: me._id,
            receiver: otherUser?._id,
        }
        
        // create message 
        const message = await Message.create(messageForDB);

        // todo
        // change the last message of chat - getting error

        // chat.lastMessage = message;
        // await chat.save();

        // todo
        // REFETCH chatlist

        // emit event NEW_MESSAGE
        emitEvent(
            req, 
            'NEW_MESSAGE',
            [me?._id, otherUser?._id],
            {
                success: true,
                message: messageForRealTime,
                chat: chat,
            }
        )

        // todo 
        // emit event for NEW_MESSAGE_ALERT

        return res.status(200).json({
            success: true,
            message: message,
        })
    }
    catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error Sending Attachments",
        error
      });
    }
}


export {
    newUser, 
    login,
    logout,
    getMyProfile,
    getOtherUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getAllNotifications,
    getMyFriends,
    checkIsFriendAlready,
    getAllMessages,
    sendAttachments,

}