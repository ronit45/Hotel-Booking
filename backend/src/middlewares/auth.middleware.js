import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// Helper: extract token from cookie or Authorization header
function extractToken(req) {
    // Prefer cookie (e.g. accessToken) if set
    if (req.cookies && req.cookies.accessToken) return req.cookies.accessToken;

    // Fall back to Authorization header: 'Bearer <token>'
    const authHeader = req.header("Authorization") || req.header("authorization");
    if (!authHeader) return null;
    if (authHeader.startsWith("Bearer ")) return authHeader.replace("Bearer ", "");
    return authHeader;
}

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = extractToken(req);

        if (!token) {
            // No token provided
            return next(new ApiError(401, "Unauthorized: no token provided"));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            return next(new ApiError(401, "Invalid or expired access token"));
        }

        const user = await User.findById(decoded?._id).select("-password -refreshToken");
        if (!user) return next(new ApiError(401, "Invalid access token: user not found"));

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(500, error?.message || "Authentication error"));
    }
});

export const verifyUser = (req, res, next) => {
    // verifyJWT will call next() on success, otherwise call next(err)
    verifyJWT(req, res, (err) => {
        if (err) return next(err);
        if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
            return next();
        }
        return next(new ApiError(403, "Forbidden: insufficient permissions"));
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyJWT(req, res, (err) => {
        if (err) return next(err);
        if (req.user && req.user.isAdmin) return next();
        return next(new ApiError(403, "Admin access required"));
    });
};