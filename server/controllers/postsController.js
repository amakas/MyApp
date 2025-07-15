import Post from "../models/Post.js";
import User from "../models/user.js";
export const createPost = async (req, res) => {
  const { title, content, username } = req.body;
  try {
    if (!title || !content) {
      return res.status(400).json({ message: "title and content required" });
    }
    const newPost = new Post({
      title,
      content,
      userId: req.userId,
      username,
    });
    await newPost.save();
    return res.json({
      success: true,
      message: "Posted successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Post error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPostsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const allPosts = await Post.find({ userId: { $ne: userId } }).sort({
      createdAt: -1,
    });
    res.status(200).json(allPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted", success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content, title } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { content, title },
      { runValidators: true, new: true }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const like = async (req, res) => {
  const { userId, postId } = req.params;
  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    } else {
      const index = post.likes.indexOf(userId);
      if (index > -1) {
        post.likes.splice(index, 1);
      }
      await post.save();
    }

    if (!user.likes.includes(postId)) {
      user.likes.push(postId);
      await user.save();
    } else {
      const index = user.likes.indexOf(postId);
      if (index > -1) {
        user.likes.splice(index, 1);
      }
      await user.save();
    }

    res.status(200).json({ message: "liked successfuly", success: true });
  } catch (error) {
    console.error("Error liking");
    res.status(500).json({ message: "Internal server error" });
  }
};

export const share = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { shares: 1 } },
      { new: true }
    );
    console.log(post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Shared successfully",
      success: true,
      shares: post.shares,
    });
  } catch (error) {
    console.error("Error sharing", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const report = async (req, res) => {
  const { postId } = req.params;
  const { reason } = req.body;
  console.log(reason);
  console.log(postId);
  try {
    const post = await Post.findById(postId);
    post.reports.push(reason);
    await post.save();
    res.status(200).json({ message: "reported successfuly", success: true });
  } catch (error) {
    console.error("Error reporting", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getViews = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);

    if (!post.viewedBy.includes(userId)) {
      post.views += 1;
      post.viewedBy.push(userId);
      await post.save();
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("View error", err);
    res.status(500).send("Internal error");
  }
};

export const getFollowingsPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    const followings = user.following;
    const followingPosts = await Post.find({ userId: { $in: followings } });

    res.status(200).json(followingPosts);
  } catch (error) {
    console.error("fetching error", err);
    res.status(500).send("Internal error");
  }
};

export const deletepostsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await Post.deleteMany({ userId });
    res.status(200).json({ message: "deleted successfuly" });
  } catch (error) {
    console.error(" error deleting posts", err);
    res.status(500).send("Internal error");
  }
};
