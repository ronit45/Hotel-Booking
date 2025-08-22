import React from "react";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { deleteUser, getAllUser, getUser, loginUser, registerUser, updateUser } from "../controllers/user.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
// Correct route to get user info

// router.route("/checkAuth/:id").get(verifyUser, (req, res) => {
//   const user = req.user; // set by verifyJWT middleware

//   res.status(200).json({
//     success: true,
//     user: {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//     },
//     message: "You can delete your account"
//   });
// });

// router.get("/checkAdmin/:id", verifyAdmin, (req,res,next) =>{
//   res.send("hello admin, you are logged in and you can delete all accounts")
// })




// update
router.put("/:id",verifyUser ,updateUser)
//delete
router.delete("/:id",verifyUser,deleteUser)
//get
router.get("/:id",verifyUser,getUser)
//get all
router.get("/users/get",verifyAdmin ,getAllUser)

export default router