

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

import redis from "../redisClient.js";
import mongoose from 'mongoose';
import AWS from 'aws-sdk';


AWS.config.update({
    region: process.env.AWS_REGION || "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const ses = new AWS.SES();

const sendEmail = async(req, res) => {
    const { email } = req.body;

    try {
        
        console.log('sending ses email');

        await ses.sendEmail({
          Source: 'no-reply@mockm8.com',
          Destination: { ToAddresses: ['kaushalshinde888@gmail.com', email] },
          Message: {
            Subject: { Data: 'Test Email' },
            Body: { Text: { Data: 'If you see this, SES works.' } }
          }
        }).promise().then(console.log).catch(console.error);

        console.log('sent ses email');

        return res.status(200).json({success: true});
    }
    catch(err) {
        console.log("sendEmail Error", err);
        return res.status(500).json(err);
    }
}

const storeRedis = async(req, res) => {
    const { email } = req.body;

    try {
        console.log('Now Testing Redis Below');

        const key = `test:${email}`;
        const cache = await redis.get(key);

        console.log("Redis Tested Successfully => ", {email, key, cache});
    
        if(!cache) {
            console.log("Redis Cache Not Available Storing it below...");

            await redis.set(key, JSON.stringify({"TEST": "Tested Successfully"}), 'EX', RedisCacheTime);
            const cache = await redis.get(key);
            
            console.log("Stored Cache Successfully => ", cache);
            return res.status(200).json({success: true, cache});
        }

        return res.status(200).json({success: true, cache});
    }
    catch(err) {
        console.log("storeRedis Error", err);
        return res.status(500).json(err);
    }
}

const createUser = async(req, res) => {
    const { email, password } = req.body;

    try {
        
        const rand = (Math.floor(Math.random() * 100000)).toString();
        const hashedPassword = await hashPassword(password);
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

        return res.status(200).json({success: true, newUser});
    }
    catch(err) {
        console.log("createUser Error", err);
        return res.status(500).json(err);
    }
}

const verifyLogin = async(req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email });
        console.log("Got User => ", user);
        
        const isPasswordMatched = await comparePassword(password, user?.password);
        console.log(`Password Matched ${isPasswordMatched}`);

        return res.status(200).json({success: true, user});
    }
    catch(err) {
        console.log("createUser Error", err);
        return res.status(500).json(err);
    }
}

const deleteUser = async(req, res) => {
    const { email } = req.body;

    try {
        
        const user = await User.deleteOne({ email });
        console.log("Delete User => ", email, user);

        return res.status(200).json({success: true, user});
    }
    catch(err) {
        console.log("createUser Error", err);
        return res.status(500).json(err);
    }
}


export {
    sendEmail,
    storeRedis,
    createUser,
    verifyLogin,
    deleteUser
}
