import mongoose from "mongoose"

let userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    age:{
        type:String,
        required: true,
    },
    userVerified:{
        email :{
            type:Boolean,
            default: false,
        },
        phone:{
            type:Boolean,
            default: false,
        },
    },
    userVerifyToken:{
        email:{
            type:String,
        },
        phone:{
            type:String
        }
    },
   
},
{
    timestamps:true,
},
)

const userModel = mongoose.model("Users", userSchema, "users")

export default userModel