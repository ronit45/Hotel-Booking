import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
export const verifyJWT = asyncHandler( async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.
        replace("Bearer ","")

        if(!token){
            throw new ApiError(404, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.
        ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select
        ("-password -refreshToken")
    
        if(!user){
            // Next_video : discuss about frontend
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token")
        
    }

    
})

export const verifyUser = (req,res,next) =>{
    verifyJWT(req,res,next , () => {
        if(req.user.id == req.params.id || req.user.isAdmin){
            next()
        }
        else{
            if(err) throw new ApiError(403,err?.message || "Invalid User")
        }
    })
}
export const verifyAdmin = (req, res, next) => {
  verifyJWT(req, res, (err) => {
    if (err) return next(err);

    if (req.user?.isAdmin) {
      return next();
    }
    return next(new ApiError(403, 'Admin access required'));
  });
};