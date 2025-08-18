import jwt from "jsonwebtoken";
import { UserSchema as User } from "../models/userSchema.js";
import { PostSchema as Post } from "../models/postSchema.js";
import { NotificationSchema as Notification } from "../models/notificationSchema.js";
import { emitEvent } from "../utils/features.js";


const createPost = async (req, res) => {
    try{
        const userId = req.user;
        const { title, description } = req.body;

        if(!title || !description){
            return res.status(400).json({
                success: false,
                message: "Please fill Title and Description",
            })
        }

        if(toString(title).length > 50 || toString(description) > 200){
            return res.status(400).json({
                success: false,
                message: "word limit crossed!!",
            })
        }

        const post = await Post.create({
            creator: userId,
            title: title,
            description: description,
            views: 0,
            likes: [],
            dislikes: [],
        });

        // const allUsers = await User.find().select("_id");
        // const formatedIds = allUsers.map((i) => i._id.toString());

        // todo
        // refetch all posts
        emitEvent(req, 'REFETCH_POSTS', [req.user], post);


        return res.status(201).json({
            success: true,
            message: "Posted Successfully",
            post,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error Fetching Posts",
        })
    }
}


const getAllPosts = async (req, res) => {
    try{
        const { page = 1 } = req.params;

        const perPage = 10;
        const skip = (page - 1) * perPage;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage)
            .populate('creator', '_id username name avatar')
            .lean();
        
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage) || 0;
        
        return res.status(200).json({
            success: true,
            message: "Posts fetched Successfully",
            totalPosts: totalPosts,
            totalPages: totalPages,
            posts,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error Fetching Posts",
        })
    }
}

const getMyPosts = async (req, res) => {
    try{
        const userId = req.user;
        
        const myPosts = await Post.find({creator: userId});

        
        return res.status(200).json({
            success: true,
            message: "Posts fetched Successfully",
            myPosts,
        });        
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error Fetching My Posts",
        })
    }
}

const getOtherUserPosts = async (req, res) => {
    try{
        const { username } = req.params;
        
        const user = await User.findOne({username: username});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found",
            })
        }

        const posts = await Post.find({creator: user._id}).populate('creator', '_id username name avatar');

        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            posts,
        })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error Fetching Others Posts",
        })
    }
}


const viewPost = async (req, res) => {
    try{
        const { postId } = req.body;

        const post = await Post.findOne({_id: postId}).populate('creator', '_id username avatar');
        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            })
        };

        // Increase views after viewing post and save to db
        post.views += 1;
        await post.save();


        return res.status(201).json({
            success: true,
            message: "Post fetched successfully",
            post,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error Viewing Post",
        })
    }
}

const likePost = async (req, res) => {
    try{
        const userId = req.user;
        const { postId } = req.body;


        const user = await User.findOne({_id: userId});
        const post = await Post.findOne({_id: postId}).populate('creator', '_id username');
        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            })
        };

        // Check if the user has already liked the post
        const indexOfUser = post.likes.indexOf(userId);
        if (indexOfUser !== -1) {
            post.likes.splice(indexOfUser, 1);
        } else {
            // add userId to lies
            post.likes.push(userId);

            // Send notification to the creator of post that who liked post
            await Notification.create({
                user: post.creator._id,
                notification: `${user.username} Liked Your Post `,
            })
        }

        // save to db
        await post.save();

        return res.status(201).json({
            success: true,
            message: "Post Liked successfully",
            post,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error Viewing Post",
        })
    }
}

const dislikePost = async (req, res) => {
    try{
        const userId = req.user;
        const { postId } = req.body;

        const post = await Post.findOne({_id: postId});
        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            })
        };

        // Check if the user has already liked the post
        const indexOfUser = post.dislikes.indexOf(userId);
        if (indexOfUser !== -1) {
            post.dislikes.splice(indexOfUser, 1);
        } else {
            post.dislikes.push(userId);
        }

        await post.save();

        return res.status(201).json({
            success: true,
            message: "Post Dislikes successfully",
            post,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error Viewing Post",
        })
    }
}


export {
    createPost,
    getAllPosts,
    getMyPosts,
    getOtherUserPosts,
    viewPost,
    likePost,
    dislikePost,
}
