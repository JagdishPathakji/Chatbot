// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema({
//   role: { type: String, enum: ["user", "bot"], required: true },
//   content: { type: mongoose.Schema.Types.Mixed, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const UserChatsSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   chats: [
//     [
//       {
//         type: MessageSchema,
//         required: true
//       }
//     ]
//   ]
// });

// const ChatsSchema = mongoose.model("UserChats", UserChatsSchema);
// export default ChatsSchema