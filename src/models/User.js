import bcrypt from "bcrypt";
import mongoose from "mongoose";


// User 정보
const userSchema = new mongoose.Schema
(
    {
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        name: {type: String, required: true},
        location: String
    }
);

userSchema.pre("save", async function()
{
    console.log("Users Password:", this.password);
    this.password = await bcrypt.hash(this.password, 5);
    console.log("Hashed Password:", this.password);

})

const User = mongoose.model('User', userSchema);
export default User;