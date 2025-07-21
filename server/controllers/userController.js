import express from "express";
import User from "../models/user.js";
import Post from "../models/Post.js";
import Message from "../models/Message.js";
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, "-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    firstname,
    lastname,
    username,
    bio,
    email,
    location,
    phoneNumber,
    profession,
  } = req.body;
  try {
    const updateFields = {
      firstname,
      lastname,
      username,
      bio,
      email,
      location,
      phoneNumber,
      profession,
    };

    if (req.file) {
      updateFields.profilePicture = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Account deleted", success: true });
  } catch (error) {
    console.error("Error deleting user");
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  const { id } = req.params;

  try {
    const users = await User.find({ _id: { $ne: id } }, "-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user");
    res.status(500).json({ message: "Internal server error" });
  }
};

export const follow = async (req, res) => {
  const targetId = req.params.id;

  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!target.followers.includes(userId)) {
      target.followers.push(userId);
      await target.save();
    } else {
      const index = target.followers.indexOf(userId);
      if (index > -1) {
        target.followers.splice(index, 1);
      }
      await target.save();
    }

    if (!user.following.includes(targetId)) {
      user.following.push(targetId);
      await user.save();
    } else {
      const index = user.following.indexOf(targetId);
      if (index > -1) {
        user.following.splice(index, 1);
      }
      await user.save();
    }

    res.status(200).json({ message: "followed successfuly", success: true });
  } catch (error) {
    console.error("Error following");
    res.status(500).json({ message: "Internal server error" });
  }
};

export const followers = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    const followersId = user.followers;
    const followers = await User.find({ _id: followersId }, "-password");
    res.status(200).json(followers);
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const followings = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    const followingsId = user.following;
    const followings = await User.find({ _id: followingsId }, "-password");
    res.status(200).json(followings);
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(post.userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const receiverIds = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).distinct("receiverId");

    const senderIds = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).distinct("senderId");

    const userIds = Array.from(new Set([...receiverIds, ...senderIds])).filter(
      (id) => id != userId
    );

    const users = await User.find({ _id: { $in: userIds } }, "-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
