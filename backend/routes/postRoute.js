

import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { getAllPosts, getMyPosts, getOtherUserPosts, createPost, viewPost, likePost, dislikePost } from '../controllers/postController.js';

const app = express.Router();

// Creating Post
app.post('/create', isAuthenticated, createPost);


// Getting Posts
app.get('/:page', getAllPosts);
app.get('/my', isAuthenticated, getMyPosts);
app.get('/:username', getOtherUserPosts);


// activities on Post
app.put('/view', viewPost);
app.put('/like', isAuthenticated, likePost);
app.put('/dislike', isAuthenticated, dislikePost);


export default app;

