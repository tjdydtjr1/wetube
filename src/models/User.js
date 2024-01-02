import bcrypt from "bcrypt";
import mongoose from "mongoose";


// User 정보
const userSchema = new mongoose.Schema
(
    {
        name: {type: String, required: true},
        avatarUrl: {type: String},
        socialOnly: {type: Boolean, default: false},
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String},
        location: String,
        videos: [{type: mongoose.Schema.Types.ObjectId, ref: "Video"}]
    }
);

userSchema.pre("save", async function()
{
    console.log("hash start");
    if(this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password, 5);
    }
})

const User = mongoose.model('User', userSchema);
export default User;