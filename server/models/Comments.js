import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  text: { type: String, trim: true },
  createdAt: { type: Date, default: new Date() },
});

const Comment = new mongoose.model("Comment", commentSchema);
export default Comment;
