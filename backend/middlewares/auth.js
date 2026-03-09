
import jwt from 'jsonwebtoken';
import { UserSchema as User } from '../models/userSchema.js';

const isAuthenticated = async (req, res, next) => {
    // console.log(`Authentication Middleware`);
    try{
        // console.log(req.cookies);

        const token = req.cookies['auth-token'];
        if(!token){
            console.log("Token Not Found");
            return res.status(401).json({
                success: false,
                message: "unauthorized access",
            })
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decodedData?._id;
        

        const user = await User.findById(decodedData._id);
        user.lastActive = new Date();
        await user.save();

        const requestedUser = {
            _id: user?._id?.toString(),
            username: user?.username,
            name: user?.name,
            avatar: user?.avatar,
        }
        req.user = requestedUser;

        console.log(`Authentication Middleware Success `);

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
        
        socket.user = user;
        // console.log('SocketAuthentication: ', socket.user);

        return next();
    }
    catch(error) {
        console.log(error);
        return new Error("Please Login to access");
    }
}

const test = (req, res, next) => {
    try {
        console.log("TEST Middleware: ");
    }
    catch(err) {
        console.log(err);
    }
    next();
}


export {
    isAuthenticated,
    socketAuthenticator,
    test,
}
