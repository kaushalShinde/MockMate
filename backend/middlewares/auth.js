
import jwt from 'jsonwebtoken';
import { UserSchema as User } from '../models/userSchema.js';

const isAuthenticated = async (req, res, next) => {
    try{

        // console.log('checking')
        const token = req.cookies['auth-token'];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "unauthorized access",
            })
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData?._id;
        
        const user = await User.findById(decodedData._id);
        user.lastActive = new Date();
        await user.save();

        console.log("Auth Middleware User Checked", user?._id);

        next();
    }
    catch(error){
        console.log('Middleware isAuthenticated: ', error);
        return res.status(500).json({
            success: false,
            message: 'Error Authenticating user',
        })
    }
};


const socketAuthenticator = async (err, socket, next) => {
    try{
        if(err){
            return next(err);
        }

        const authToken = socket.request.cookies['auth-token'];

        if(!authToken)  return next(new Error('Please login'))

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
        const user = await User.findById(decodedData._id);

        if(!user)   return next(new Error("Unauthorised Access"))
        
        // console.log('response', decodedData?._id, user?._id?.toString());
        socket.user = user;

        return next();
    }
    catch(error) {
        console.log(error);
        return new Error("Please Login to access");
    }
}


export {
    isAuthenticated,
    socketAuthenticator,
}
