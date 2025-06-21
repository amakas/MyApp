import Post from '../models/Post.js';

export const createPost = async (req, res) => {
    
    const {title, content} = req.body
    try{
    if(!title||!content){
        return res.status(400).json({ message:"title and content required"})
    }
    const newPost = new Post({
        title,
        content,
        userId: req.userId, 
    })
    await newPost.save();
    return res.json({
        success:true,
        message: "Posted successfully",
        post:{
            id: newPost._id,
            title: newPost.title,
            content: newPost.content
        }
    })

    } catch (error){
    console.error("Post error:", error)
    return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
}}

export const getPostsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
   

    const posts = await Post.find({ userId }).sort({ createdAt: -1 })
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};