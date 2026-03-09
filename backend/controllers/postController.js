import jwt from "jsonwebtoken";
import { UserSchema as User } from "../models/userSchema.js";
import { PostSchema as Post } from "../models/postSchema.js";
import { NotificationSchema as Notification } from "../models/notificationSchema.js";
import { emitEvent } from "../utils/features.js";
import Meta from "../models/metaSchema.js";

import { RedisCacheTime } from "../constants/constants.js";

// import redis from "../redisClient.js"; 
import { getRedis } from "../redisClient.js"; 
 

// calling redis
const redis = getRedis();


const createPost = async (req, res) => {
    try{
        const user = req.user; // get whole user info { _id, username, name, avatar}
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

        const creatorInfo = {
            _id: user?._id,
            username: user?.username,
            name: user?.name,
            avatar: user?.avatar,
        };
        const post = await Post.create({
            creator: creatorInfo,
            title: title,
            description: description,
            views: 0,
            likes: [],
            dislikes: [],
        });

        const keys = await redis.keys("posts:page:*");
        if (keys.length) await redis.del(keys);

        const totalPostsInDb = await Post.countDocuments();
        const metaDoc = await Meta.findOne({ key: 'totalPostsCount' });
        if(metaDoc) {
            await Meta.updateOne({ key: 'totalPostsCount' }, { $inc: { value: 1 } });
        }
        else {
            await Meta.create({ key: 'totalPostsCount', value: totalPostsInDb });
        }

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
    console.log('getAllPosts');
    try {
        const { page = 1 } = req.params;
        const cacheKey = `posts:page:${page}`;

        // console.log('checking cached posts (commented)')
        const cachedData = await redis.get(cacheKey);
        if(cachedData) {
            console.log(`Cache Hit Key: ${cacheKey} `);
            return res.status(200).json(JSON.parse(cachedData));
        }

        const perPage = 10;
        const skip = (page - 1) * perPage;

        const posts = await Post.find()
          .sort({ createdAt: -1 })
          .skip(skip) 
          .limit(10)
          .lean();
        
        // console.log('posts', posts);

        const totalPostMetaData = await Meta.findOne({ key: 'totalPostsCount' });

        if (!totalPostMetaData) {
            const totalPostsInDb = await Post.countDocuments();
            await Meta.create({ key: 'totalPostsCount', value: totalPostsInDb });

            totalPostMetaData = totalPostsInDb;
        }
        
        const totalPosts = totalPostMetaData ? totalPostMetaData.value : 0;
        const totalPages = Math.ceil(totalPosts / perPage) || 0;

        const responseData = {
            success: true,
            message: "Posts fetched Successfully",
            totalPosts: totalPosts,
            totalPages: totalPages,
            posts,
        }

        // Cache the response in Redis for future requests
        await redis.set(cacheKey, JSON.stringify(responseData), 'EX', RedisCacheTime); // Cache for 10 min

        return res.status(200).json(responseData);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error Fetching Posts",
        });
    }
};


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

        const post = await Post.findOne({ _id: postId });
        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            })
        };
        
        // console.log(`Post View Likes: ` + post?._id + ' ' + post?.likes);

        // Increase views after viewing post and save to db
        post.views += 1;
        post.save();  // dont await here, let it happen in background

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
    try {
      const { postId } = req.body;
      const user = req.user; // already available from auth middleware
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
  
      const alreadyLiked = post.likes.some((id) => id.equals(user._id));
      
      if (alreadyLiked) {
        // Unlike
        post.likes = post.likes.filter((id) => !id.equals(user._id));
      } else {
        // Like
        post.likes.push(user._id);
  
        // Optional: send notification if user isn't the post creator
        if (!post.creator.equals(user._id)) {
            Notification.create({
                user: post?.creator?._id,
                notification: `${user.username} liked your post.`,
          });
        }
      }

        await post.save();
        // Invalidate cached feed pages
        const keys = await redis.keys('posts:page:*');
        for (const key of keys) {
            await redis.del(key);
        }
  
        return res.status(200).json({
            success: true,
            message: alreadyLiked ? "Post unliked successfully" : "Post liked successfully",
            // post: post,
            postId: post._id,
            liked: !alreadyLiked,
            likesCount: post.likes.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error liking post",
        });
    }
};
  

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
