import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  firstname: {
    type: String,
    trim: true,
    default: "",
  },
  lastname: {
    type: String,
    trim: true,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  profession: {
    type: String,
    trim: true,
    default: "",
  },
  profilePicture: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: "",
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  location: {
    type: String,
    trim: true,
    default: "",
  },
  socialLinks: {
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
  },
  followers: { type: Array, default: [] },
  following: { type: Array, default: [] },
  likes: { type: Array, default: [] },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date },
});

const User = mongoose.model("User", userSchema);
export default User;
