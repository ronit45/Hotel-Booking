import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = mongoose.Schema({
    username : {
        type : String,
        required: true,
        unique : true
    },
    email : {
        type : String,
        required: true,
        unique : true
    },
    country : {
        type : String,
        required: true,
    },
    img : {
        type : String,
    },
    city : {
        type : String,
    },
    phone : {
        type : String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    refreshToken: String,
}, {timestamps : true})


userSchema.methods.isPasswordCorrect = async function (password) {
     console.log("this.password:", this.password);
     if (!password || !this.password) {
    throw new Error("Password comparison failed: missing data.");
  }
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            isAdmin : this.isAdmin,
            username : this.username,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});



export const User = mongoose.model("User", userSchema)

