import mongoose from "mongoose"
const {Schema} = mongoose

const userSchema = Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ["male","female","others"]
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

const usercollection = mongoose.model("user",userSchema)
export default usercollection