import mongoose from 'mongoose'
const Schema = mongoose.Schema


const userSchema = new Schema({
    username: String,
    googleId: String,
    date: { type: Date, default: Date.now},
    admin:{ type: Boolean, default: false, },
})

const User = mongoose.model("user", userSchema)
export default User;
