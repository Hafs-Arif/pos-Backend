import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    watchHistory:[
            {
                types: Schema.types.Objectid,
                ref: "Video"
            }
        ],
    usename: 
        {
         type: String,
         required: true 
        },
    email:
        {
         type: String,
         required: true
        },
    fullName: 
        {   type: String,
            required: true
        },
    avatar: 
        {
            type: String  //Stores url
        },
    coverImage:
        { 
            type: String
        }, //Stores URL
    password: 
        { 
            type: String,
            required: [true, 'Password is Required!!']
        },
    refreshToken: 
        { 
            type: String
        }

}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    JWT.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function () {
    JWT.sign(
        {
            _id: this._id,
        },process.env.REFRESH_TOKEN_SECRET,
        {
            expiry: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema);