

import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { getAllPosts, getMyPosts, getOtherUserPosts, createPost, viewPost, likePost, dislikePost } from '../controllers/postController.js';

const app = express.Router();

app.get('/test-post', (req, res) => res.status(200).send("Test Post Success"));

// Creating Post
app.post('/create', isAuthenticated, createPost);


app.get('/my', isAuthenticated, getMyPosts);
app.get('/user/:username', getOtherUserPosts);


// activities on Post
app.put('/view', viewPost);
app.put('/like', isAuthenticated, likePost);
app.put('/dislike', isAuthenticated, dislikePost);

// Getting Posts
app.get('/:page', getAllPosts);

export default app;

