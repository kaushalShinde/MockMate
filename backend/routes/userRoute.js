
import express from 'express';
import { newUser, login, getMyProfile, getOtherUserProfile, logout, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getAllNotifications, getMyFriends, checkIsFriendAlready, getAllMessages, sendAttachments } from '../controllers/userControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { attachmentsMulter, singleAvatar } from '../middlewares/multer.js';

const app = express.Router();

app.post('/new', singleAvatar, newUser);
app.post('/login', login);

app.get('/profile/:username', getOtherUserProfile);


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
app.get('/notifications', isAuthenticated, getAllNotifications);


// Get all the friends with their last message 
app.get('/friends', isAuthenticated, getMyFriends);

app.get('/isfriend/:creatorId', isAuthenticated, checkIsFriendAlready);


// get all messages
app.get('/messages/:id/:page', isAuthenticated, getAllMessages);


// send attachments
app.post('/attachments', isAuthenticated, attachmentsMulter, sendAttachments);


export default app;
