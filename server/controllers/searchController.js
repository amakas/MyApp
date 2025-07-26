import User from "../models/User.js";
import Post from "../models/Post.js";

export const globalSearch = async (req, res) => {
  const { query } = req.query;
  if (!query || query.length < 2) {
    return res.json({ users: [], posts: [] });
  }

  try {
    const [users, posts] = await Promise.all([
      User.find({ username: { $regex: query, $options: "i" } })
        .limit(5)
        .select("_id username profilePicture"),
      Post.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
        ],
      })
        .limit(5)
        .select("_id title content userId"),
    ]);

    res.json({ users, posts });
  } catch (error) {
    console.error("Error searching globally", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
