import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  const pageNum = parseInt(req.query.page) || 0;
  const limitNum = parseInt(req.query.limit) || 30;
  const skip = pageNum * limitNum;

  try {
    const messages = await Message.find({ receiverId: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();
    messages.reverse();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getUserMessages = async (req, res) => {
  const pageNum = parseInt(req.query.page) || 0;
  const limitNum = parseInt(req.query.limit) || 50;
  const skip = pageNum * limitNum;
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
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
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
