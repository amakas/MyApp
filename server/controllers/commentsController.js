import Comment from "../models/Comments.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
export const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(post.userId);
    const username = user.username;
    const comments = await Comment.find({ postId });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendComment = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.params;
  const text = req.body.comment;

  try {
    const user = await User.findById(userId);
    const username = user.username;
    const newComment = new Comment({
      userId,
      postId,
      text,
      username,
    });
    await newComment.save();

    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });
    res
      .status(200)
      .json({ message: "sended successfuly", success: true, newComment });
  } catch (error) {
    console.error("Error sending comment", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
