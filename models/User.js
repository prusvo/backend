import {Schema, model} from "mongoose";

const User = new Schema({
    userName: {
        type: String, 
        unique: true, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    roles: {
        type: [String],
        require: true,
    }
})

export default model("User", User)