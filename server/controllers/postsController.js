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
    
    res.status(200).json( posts );
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

export const getPosts = async (req,res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const allPosts = await Post.find({ userId: { $ne: userId } }).sort({ createdAt: -1 })
    res.status(200).json(  allPosts );
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}

export const deletePost = async (req,res) =>{
  const { id } = req.params;
  
  try {
    
     await Post.findByIdAndDelete(id)
    res.status(200).json({message:"Post deleted", success:true});
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}

export const updatePost = async (req,res)=>{
  const { id } = req.params
  const { content, title } = req.body
  try{
    const post = await Post.findByIdAndUpdate(id, {content, title}, {runValidators: true, new:true})
    if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.status(200).json(post);
  } catch (error){
    console.error("Error updating post:", error);
    res.status(500).json({
      message: 'Internal server error',
      error:error.message
    });
  }
}