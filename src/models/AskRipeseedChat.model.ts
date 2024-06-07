import mongoose, { Schema } from "mongoose";

const Message = new Schema(
  {
    content: {
      type: String,
      trim: true,
      required: [true, "message content is required"],
    },
    role: {
      type: String,
      trim: true,
      required: [true, "role is required"],
      enum: ["user", "system", "assistant"],
    },
    indexId: {
      type: String,
      trim: true,
      required: [true, "indexId is required"],
    },
  },
  {
    timestamps: true,
  },
);

const askRipeseedChatShema = new Schema(
  {
    uId: {
      type: String,
      trim: true,
      required: [true, "uId is required"],
      unique: true,
    },
    messages: [Message],
  },
  {
    timestamps: true,
  },
);

export const AskRipeseedChat = mongoose.model(
  "AskRipeseedChat",
  askRipeseedChatShema,
);
