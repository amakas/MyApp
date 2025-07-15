import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
  reports: {
    type: Array,
    default: [],
  },
  views: { type: Number, default: 0 },
  viewedBy: Array,
});

const Post = mongoose.model("Post", postSchema);
export default Post;
