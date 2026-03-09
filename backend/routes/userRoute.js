
import express from 'express';
import { test, sendOTP_signup, verifyOTP_signup, sendOTP_2FA, verifyOTP_2FA, getMyProfile, getOtherUserProfile, logout, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getAllNotifications, markNotificationRead, getMyFriends, checkIsFriendAlready, getAllMessages, sendAttachments } from '../controllers/userControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { rateLimitOTP } from '../middlewares/rateLimiter.js';
import { attachmentsMulter, singleAvatar } from '../middlewares/multer.js';
import rateLimit from 'express-rate-limit'

const app = express.Router();

// app.post('/test', test);

app.get('/test-user', (req, res) => res.status(200).send("Test User Success"));

// for signup
app.post('/signup-send-otp', singleAvatar, sendOTP_signup);
app.post('/signup-verify-otp', singleAvatar, verifyOTP_signup);

// for login
app.post('/send-otp', sendOTP_2FA);
app.post('/verify-otp', verifyOTP_2FA);



// Below routes accessible only to validated user
// app.use(isAuthenticated)


// authenticated user
app.get('/me', isAuthenticated, getMyProfile);

app.get("/logout", isAuthenticated, logout);



// friend requests
app.put('/sendrequest', isAuthenticated, sendFriendRequest);

app.put('/acceptrequest', isAuthenticated, acceptFriendRequest);

app.put('/rejectrequest', isAuthenticated, rejectFriendRequest);


// notifications
app.put('/readNotification', isAuthenticated, markNotificationRead);

app.get('/notifications', isAuthenticated, getAllNotifications);



// Get all the friends with their last message 
app.get('/friends', isAuthenticated, getMyFriends);

app.get('/isfriend/:creatorId', isAuthenticated, checkIsFriendAlready);

// send attachments
app.post('/attachments', isAuthenticated, attachmentsMulter, sendAttachments);

// get all messages
app.get('/messages/:id/:page', isAuthenticated, getAllMessages);

app.get('/profile/:username', getOtherUserProfile);



export default app;
