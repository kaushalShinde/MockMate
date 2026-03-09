

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema as User } from '../models/userSchema.js';
import { ChatSchema as Chat } from '../models/chatSchema.js';
import { RequestSchema as Request } from '../models/requestSchema.js';
import { NotificationSchema as Notification } from '../models/notificationSchema.js';
import { MessageSchema as Message } from '../models/messageSchema.js';

import { RedisCacheTime } from "../constants/constants.js";
import { newUserValidator, loginValidator } from '../lib/validators.js';
import { comparePassword, hashPassword } from '../lib/authHelper.js';
import { emitEvent, uploadFilesToCloudinary } from '../utils/features.js';
import Meta from '../models/metaSchema.js';


import mongoose from 'mongoose';
import AWS from 'aws-sdk';
 
import { sendEmail } from "../connection/sendEmail.js";
import redis from "../connection/redisClient.js"; 

AWS.config.update({
    region: process.env.AWS_REGION || "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const ses = new AWS.SES();


export const test = async(req, res) => {
    const {email} = req.body;

    console.log('#######################  TEST   ');
    console.log(email);


    try {
        console.log("Finding User => ");
        let user = await User.findOne({ email });
        console.log("Got User => ", user);

        if(!user) {
            const rand = (Math.floor(Math.random() * 100000)).toString();
            const hashedPassword = await hashPassword(rand);
            const newUser = await User.create({
                name: rand,
                username: rand,
                email: email,
                password: hashedPassword,
                bio: "bio",
                avatar: {
                    public_id: rand,
                    url: "fileUploadResult[0]?.url",
                },
                organization: "org",
                designation: "designation",
            });
            
            console.log("created new User", newUser);
            user = newUser;
        }
        
        /*
         * AWS SES Email Service
        console.log('sending ses email')
        await ses.sendEmail({
          Source: 'no-reply@mockm8.com',
          Destination: { ToAddresses: ['kaushalshinde888@gmail.com'] },
          Message: {
            Subject: { Data: 'Test Email' },
            Body: { Text: { Data: 'If you see this, SES works.' } }
          }
        }).promise().then(console.log).catch(console.error);
        console.log('sent ses email');
        */
       
        // Brevo Email Sender
        await sendEmail({
            to: "kaushalshinde888@gmail.com",
            subject: "Test Email",
            text: "If you see this, Brevo works."
        });

        console.log('Now testing Redis below')
        const key = `otp:${email}`;
        const cache = await redis.get(key);
        console.log("Redis Tested Successfully => ", {email, key, cache});
    
        
        await redis.set(key, JSON.stringify(user), 'EX', RedisCacheTime);
        return res.status(200).json({success: true, cache, user});
    }
    catch(err) {
        console.log("TEST Error => ", err);
        return res.status(500).json({ success: false, error: err.message || err });
    }

    console.log("Outside try Catch")
}

const sendOTP_signup = async (req, res) => {
    try {
      const { name, username, email, password, bio, organization, designation } = req.body;
  
      // validation 
      const validationResult = newUserValidator(req);
      if (!validationResult?.success) {
        return res.status(404).json(validationResult);
      }
  
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }
  
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
  
      // generate OTP 
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpCacheKey = `signup:${email}`;
  
      await redis.set(
        otpCacheKey,
        JSON.stringify({
            otp,
            expires: Date.now() + 5 * 60 * 1000,
            payload: { name, username, email, password, bio, organization, designation }
        }),
        "EX",
        RedisCacheTime
      );
    
      /* 
       * AWS SES 
      await ses.sendEmail({
        Source: process.env.SENDER_EMAIL,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: "Verify your Signup - OTP" },
          Body: { Text: { Data: `Your OTP is ${otp}.` } }
        }
      }).promise();
      */

      await sendEmail({
        to: "kaushalshinde888@gmail.com",
        subject: `@${username}, Verify your Signup - OTP`,
        text: `Your OTP is ${otp}.`
      });
  

      return res.status(200).json({ success: true, message: "OTP sent to your email" });
  
    } catch (error) {
      console.log("Signup OTP Error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const verifyOTP_signup = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const file = req.file;

        const otpCacheKey = `signup:${email}`;
    
        const record = await redis.get(otpCacheKey);
        if (!record) {
            return res.status(400).json({ success: false, message: "OTP expired or not requested" });
        }
        
        const parsed = JSON.parse(record);
        if (parsed.otp != otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    
        const { name, username, password, bio, organization, designation } = parsed.payload;
        const fileUploadResult = await uploadFilesToCloudinary([file]); // handle avatar/upload only now (after OTP success)

        const avatar = {
            public_id: fileUploadResult[0]?.public_id,
            url: fileUploadResult[0]?.url,
        }
    
        const hashedPassword = await hashPassword(password);
    
        const user = await User.create({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
            bio: bio,
            avatar: avatar,
            organization: organization,
            designation: designation,
        });
    
        redis.del(otpCacheKey); // cleanup

        const jwtData = {
            _id: user?._id,
        }
        const token = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: '1d'});


        // Create chat between user and admin
        const admin = await User.findOne({ username: 'Admin' }).lean();
        if(admin) {
            const members = [user?._id, admin?._id];
            const welcomeMessage = await Message.create({
                sender: {
                    _id: admin?._id,
                    username: admin?.username,
                    name: admin?.name,
                    avatar: admin?.avatar,
                },
                receiver: {
                    _id: user?._id,
                    username: user?.username,
                    name: user?.name,
                    avatar: user?.avatar,
                },
                content: `Hey @${user.username}🙌, Welcome to the community! I'm super excited to have you here 🎉. If there's anything I can do to help you settle in, just let me know 💛`
            })
            await Chat.create({
                users: members,
                lastMessage: welcomeMessage?._id,
            })
        }

        res.cookie('auth-token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production', // only send over HTTPS in prod
            // domain: process.env.NODE_ENV == 'production' ? `.mockm8.com` : undefined,
            sameSite: process.env.NODE_ENV == 'production' ? "None" : "Lax", // or 'none' if cross-site
            path: "/",
        });

        return res.status(201).json({
            user,
            token,
            success: true,
            message: `Welcome ${user?.username}`,
        })
        
    
    } catch (error) {
        console.log("Verify Signup OTP Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const sendOTP_2FA = async(req, res) => {
    console.log('sendOTP_2FA')
    try {
        const { email, password } = req.body;

        const validationResult = loginValidator(req);
        if(!validationResult?.success){
            return res.status(404).json(validationResult);
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            })
        }

        const isPasswordMatched = await comparePassword(password, user?.password);
        if(!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            })
        }

        console.log('sendOTP_2FA: ', user);
        console.log('Now testing Redis below')

        const otpCacheKey = `otp:${email}`;
        const otpRequestCacheKey = `otpRequest:${email}`;
        
        // Rate Limiting 
        const now = Date.now();
        // const record = otpRequests.get(email) || { count: 0, lastRequest: 0 };
        let record = await redis.get(otpRequestCacheKey);
        record = record ? JSON.parse(record) : { count: 0, lastRequest: 0 };
        const diff = now - record.lastRequest;

        console.log("stored redis => ", record);


        // Dynamic cooldown: increase wait time with each request
        const cooldowns = [0, 1, 5, 10]; // minutes for 1st, 2nd, 3rd, onward attempts
        const waitMinutes = cooldowns[Math.min(record.count, cooldowns.length - 1)];
        const waitMs = waitMinutes * 60 * 1000;

        if (diff < waitMs) {
            const remaining = Math.ceil((waitMs - diff) / 1000);
            return res.status(429).json({
                success: false,
                message: `Please wait ${Math.ceil(remaining / 60)} minute(s) before requesting another OTP.`,
            });
        }

        if (diff > 30 * 60 * 1000) {
            record.count = 0; // reset after 30 min
        }

        // ######################################
        

        const otp = Math.floor(100000 + Math.random() * 900000);

        /*
         * AWS SES 
        const params = {
            Source: process.env.SENDER_EMAIL,
            Destination: { ToAddresses: [email] },
            Message: {
                Subject: { Data: 'Your OTP Code' },
                Body: { Text: { Data: `Your OTP is ${otp}. It will expire in 5 minutes.` } },
            },
        };
        await ses.sendEmail(params).promise();
        */

        // Brevo Email sender
        await sendEmail({
            to: email,
            subject: `@${username}, your OTP`,
            text: `Your OTP is ${otp}.`
        });

        const otpInfo = {
            otp,
            expires: now + 5 * 60 * 1000,
        }
        const otpRequestInfo = {
            count: record.count + 1,
            lastRequest: now,
        }

        await redis.set( otpCacheKey, JSON.stringify(otpInfo), 'EX', RedisCacheTime );
        await redis.set( otpRequestCacheKey, JSON.stringify(otpRequestInfo), 'EX', RedisCacheTime );


        return res.status(200).json({
            success: true,
            message: "OTP sent successfully! Please verify to complete login."
        });
  
    }
    catch (error) {
        console.error("Login with OTP Error:", error);
        return res.status(500).json({
          success: false,
          message: "Internal Server Error during login"
        });
    }
}

const verifyOTP_2FA = async(req, res) => {
    console.log('verifyOTP_2FA')
    try {
                
        const { email, otp } = req.body;
        // const record = otps.get(email);

        const otpCacheKey = `otp:${email}`;
        const otpRequestCacheKey = `otpRequest:${email}`;

        let record = await redis.get(otpCacheKey);
        record = JSON.parse(record);

        if (!record) {
            return res.status(400).json({ success: false, message: 'No OTP requested for this email' });
        }
        
        if (record.otp != otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        
        if (Date.now() > record.expires) {
            // otps.delete(email);
            await redis.del(otpCacheKey);
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }
        

        const validationResult = loginValidator(req);
        if(!validationResult?.success){
            return res.status(404).json(validationResult);
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            })
        }
        
        const jwtData = {
            _id: user?._id,
        }
        const token = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.cookie('auth-token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production', // only send over HTTPS in prod
            // domain: process.env.NODE_ENV == 'production' ? `.mockm8.com` : undefined,
            sameSite: process.env.NODE_ENV == 'production' ? "None" : "Lax", // or 'none' if cross-site
            path: "/",
        });

        res.status(200).json({
            user,
            token,
            success: true,
            message: `Welcome Back, ${user.name}`,
        })
    }
    catch (error) {
        console.log(`Error VerifyOTP_2FA: `, error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error Verifying OTP`
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
    console.log('getMyProfile: ')
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

const markNotificationRead = async (req, res) => {

    // todo 
    // validate if user is the owner of notification or not
    // for now, skipped it due to uncessary get notification calls

    try {
        const { notificationId } = req.body;
        
        await Notification.updateOne(
            { _id: notificationId },
            { $set: { status: "read" } }
        );

        return res.status(200).json({
            success: true,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

const sendFriendRequest = async (req, res) => {
    try{    
        
        const { userId } = req.body;
        const me = await User.findOne({_id: req.user});

        if(userId == me?._id) {
            return res.status(400).json({
                success: false,
                message: "Can't send reqeust to yourself",
            })
        }

        console.log("otherUser: ", userId);
        console.log("me: ", me);

        const checkRequest = await Request.findOne({
            $or: [
                { sender: req?.user, receiver: userId },
                { sender: userId, receiver: req?.user },
            ]
        });

        console.log("checkRequest: ", checkRequest)

        if(checkRequest) {
            return res.status(400).json({
                success: false,
                message: "Request Already Sent",
            })
        }

        const friendRequest = await Request.create({
            sender: req?.user,
            receiver: userId,
        });
        const requestId = friendRequest?._id;

        console.log("friendRequest: ", friendRequest)

        
        // notificationForRealTime => this is for the person who receives the request
        const notificationForRealTime = {
            sender: {
                _id: me?._id,
                username: me?.username,
                name: me?.name,
            },
            receiver: {
                _id: userId,
            },
            notificationContent: `${me?.username} sent you friend request.`,
            category: "request",
            requestId: requestId,
        }

        // TODO
        // EMIT Event for realtime notification 
        emitEvent(
            req, 
            'NEW_NOTIFICATION',
            [userId],
            {
                success: true,
                message: notificationForRealTime,
            }
        )

        
        // Store request in notification schema
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

        console.log('request => ', request);

        // console.log('request: ', request);
        if(!request) {
            return res.status(404).json({
                success: false,
                message: "Request Not Found",
            })
        }

        const senderId = request?.sender?._id;
        const receiverId = request?.receiver?._id;

        console.log('sender receiver => ', senderId, receiverId);
        if(receiverId?.toString() !== user?.toString()){
            return res.status(401).json({
                success: false,
                message: "You are not Authorized",
            })
        }
        
        const members = [senderId, receiverId];
        // console.log(members);

        // todo
        // Create chat between two, also reflect it in realtime friends of user


        // todo
        // EMIT Event realtime notification


        // delete the existing notification
        console.log('deleting notification');
        await Notification.deleteOne({_id: deleteNotificationId})
        console.log('notification deleted');


        // create new notification saying, both are friends now
        // for me
        await Notification.create({
            user: receiverId,
            notification: `You & ${request?.sender?.username} are friends now.`,
        })

        // for other user
        await Notification.create({
            user: senderId,
            notification: `${request?.receiver?.username} accepted your friend request!`,
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
        const { requestId, deleteNotificationId } = req.body;
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

        // notification to sender
        const notification = await Notification.create({
            user: senderId,
            content: `${request?.receiver?.username} rejected you friend request.`,
        })
        
        // delete the existing notification
        await Notification.deleteOne({_id: deleteNotificationId})

        // delete request from db
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "request rejected successfully",
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

        const allNotifications = notifications.map(({_id, user, category, requestId, notification, status, createdAt}) => ({
            _id,
            user, 
            category,
            requestId, 
            notification,
            status,
            createdAt,
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

// const getMyFriends = async (req, res) => {
//     try{
//         const userId = req.user;
    
//         // const chats = await Chat.find({
//         //     users: userId,
//         // }).populate('users lastMessage', '_id username name avatar lastActive sender receiver content attachments')
//         //     .populate('lastMessage', 'sender receiver content attachments');

//         const chats = await Chat.find({
//             users: userId,
//         }).populate({
//             path: 'users',
//             select: '_id username name avatar lastActive',
//         }).populate({
//             path: 'lastMessage',
//             select: 'sender receiver content attachments createdAt',
//         }).sort({ updatedAt: -1 });


//         // console.log(chats);
//         const allChats = chats.map(chat => {
//             const otherUsers = chat.users.filter(user => user._id.toString() !== userId.toString());
//             return {
//                 ...chat._doc,
//                 users: otherUsers,
//             };
//         });

//         // console.log(allChats);
//         // console.log(allChats);
//         // allChats.map((chat) => {
//         //     console.log(chat?.users);
//         // })

//         return res.status(200).json({
//             success: true,
//             chats: allChats,
//         })

//     }
//     catch(error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         })
//     }
// }

const getMyFriends = async (req, res) => {
  try {
    const userId = req.user?._id;

    const chats = await Chat.aggregate([
      {
        $match: {
          users: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "userschemas", // lowercase + plural of your "UserSchema" collection name
          localField: "users",
          foreignField: "_id",
          as: "users",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                name: 1,
                avatar: 1,
                lastActive: 1,
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "messageschemas", // lowercase + plural of "MessageSchema"
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
          pipeline: [
            {
              $project: {
                _id: 1,
                sender: 1,
                receiver: 1,
                content: 1,
                attachments: 1,
                createdAt: 1,
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1, updatedAt: -1 }
      }
    ]);

    // remove the current user from the list
    const allChats = chats.map(chat => ({
      ...chat,
      users: chat.users.filter(u => u._id.toString() !== userId.toString()),
    }));

    return res.status(200).json({
      success: true,
      chats: allChats
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


const checkIsFriendAlready = async (req, res) => {
    try{
        const userId = req.user;
        // const { otherUser } = req.body;
        const { creatorId } = req.params;

        // previously here it was 'otherUser'
        const otherUserId = creatorId;

        if(creatorId === undefined) {
            return res.status(404).json({
                success: false,
                message: "Id not found",
            })
        }

        // check if the user is itself post creator or not
        if(userId == otherUserId) {
            return res.status(200).json({
                success: true,
                isFriend: true,
                request: null,
                chats: [],
            })
        }
        
        const checkRequest = await Request.findOne({
            $or: [
                { sender: otherUserId, receiver: userId },
                { sender: userId, receiver: otherUserId },
            ]
        });

        const chats = await Chat.find({
            $or: [
                { users: [userId, otherUserId] },
                { users: [otherUserId, userId] },
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
        const page = Number(req?.params?.page) || 1;
        // const { page = 1 } = req.query;

        console.log('getAllMessages: ', chatId, page);
  
        const perPage = 15;
        const skip = (page - 1) * perPage;
      
        // const chat = await Chat.findById({users: req.user});
        // if(!chat) return res.status(404).json({success: false, message: "Chat Not Found"})
    
        // if(!chat.users.includes(req.user.toString())){
        //     return res.status(401).json({
        //     success: false,
        //     message: "am i fool...?",
        //     })
        // }
    
        if (!chatId) {
            return res.status(400).json({ success: false, message: "Chat ID is required" });
        }
  
        // console.log(chatId, req.user);
        const messages = await Message.find({
            $or: [
                { 'sender._id': chatId, 'receiver._id': req.user._id },
                { 'sender._id': req.user._id, 'receiver._id': chatId }
            ]
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();
  
        let totalMessagesCount = 0;

        const metaDataKey = `totalMessagesCount:${req.user._id}_${chatId}`;
        const MetaData = await Meta.findOne({ key: metaDataKey });

        if(MetaData) {
            totalMessagesCount = MetaData.value;
        }
        else {
            const totalMessagesCountInDB = await Message.countDocuments({
                $or: [
                    { 'sender._id': chatId, 'receiver._id': req.user._id },
                    { 'sender._id': req.user._id, 'receiver._id': chatId }
                ]
            }).lean();

            await Meta.create({ key: metaDataKey, value: totalMessagesCountInDB });
            totalMessagesCount = totalMessagesCountInDB;
        }
    
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
        const user = req.user;
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
        
        const chat = await Chat.findOne({
            users: { $all: [req?.user?._id, selectedUser] }
          }).populate('users', '_id username name');

        const me = await User.findById(req?.user?._id);
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

        const fileNames = files.map(f => f.originalname).join(' \n ');

        // message for realtime 
        // emit socket event
        const messageForRealTime = {
            content: fileNames.toString(),
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
            content: fileNames.toString(),
            attachments: attachments,
            sender: {
                _id: me?._id,
                username: me?.username,
                name: me?.name,
                avatar: me?.avatar,
            },
            receiver: {
                _id: otherUser?._id,
                username: otherUser?.username,
                name: otherUser?.name,
                avatar: otherUser?.avatar,  
            },
        }
        
        // create message 
        const message = await Message.create(messageForDB);

        // todo
        // change the last message of chat - getting error

        chat.lastMessage = message;
        await chat.save();

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
    sendOTP_signup,
    verifyOTP_signup,
    sendOTP_2FA,
    verifyOTP_2FA,
    logout,
    getMyProfile,
    getOtherUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getAllNotifications,
    markNotificationRead,
    getMyFriends,
    checkIsFriendAlready,
    getAllMessages,
    sendAttachments,

}