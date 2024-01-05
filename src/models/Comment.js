import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        text: {type: String, required: true},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        Video: {type: mongoose.Schema.Types.ObjectId, ref: "Video"},
        createdAt: {type: Date, required: true, default: Date.now},
    }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;