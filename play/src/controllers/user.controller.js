import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

export const generateAccessAndRefreshToken = async(userId) =>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
  
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})
  
    return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, "Something went wrong while gen access and refersh token")
  }
}


export const registerUser = asyncHandler(async (req, res) => {
  console.log("Register Body:", req.body);

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "Username or Email already exists");
  }


  const user = await User.create({
    ...req.body,
    password
  });

  const responseUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  res.status(201).json(
    new ApiResponse(201, responseUser, "User registered successfully")
  );

  console.log("user created")
});

export const loginUser = asyncHandler(async (req,res) => {
  //req body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie

  const {email,username,password} = req.body
  if(!username && !email){
    throw new ApiError(400, "username or password is required")
  }

  const user = await User.findOne({
    $or : [{username}, {email}]
  }).select("+password")

  if(!user) throw new ApiError(404, "User does not Exist")

  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(401, "Password is Incorrect")
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select
  ("-password, -refreshToken")

  const options = {
    httpsOnly : true,
    secure : true,
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken,options)
  .json(
    new ApiResponse(200,
      {
        user : loggedInUser,accessToken,
        refreshToken
      },
      "User logged in succesfully"
    )
  )
  
})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findOneAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export const updateUser = async (req, res, next) =>{
    try {
        const updatedHotel = await User.findByIdAndUpdate(
            req.params.id,
            { $set : req.body },
            {new :true}
        )
        res.status(200).json(updatedHotel)
    } catch (err) {
        res.status(500).json(err)
    }
}
export const deleteUser = async (req, res, next) =>{
    try {
            await User.findByIdAndDelete(
                req.params.id
            )
            res.status(200).json("Hotel has been deleted")
        } catch (err) {
            res.status(500).json(err)
        }
}
export const getUser = async (req, res, next) =>{
    try {
            const Hotel = await User.findById(
                req.params.id
            )
            res.status(200).json(Hotel)
        } catch (err) {
            res.status(500).json(err)
        }
}
export const getAllUser = async (req, res, next) =>{
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err)
    }
}