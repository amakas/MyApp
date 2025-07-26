import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  const { page, limit } = req.query;

  try {
    let allMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    allMessages.reverse();
    res.status(200).json(allMessages);
  } catch (error) {
    console.error("Error fetching messages", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getUserMessages = async (req, res) => {
  const { personId } = req.params;
  const userId = req.userId;
  try {
    const messages = await Message.find({
      $or: [
        {
          senderId: personId,
          receiverId: userId,
        },
        {
          senderId: userId,
          receiverId: personId,
        },
      ],
    }).sort({ createdAt: 1 });
    console.log(messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching user messages", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
