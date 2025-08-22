import express from "express"
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { createRoom, deleteRoom, 
    getRoom, getRooms, 
    updateRoom, updateRoomAvailability } from "../controllers/room.controller.js";

export const router = express.Router();

//create
router.post("/:hotelId",verifyAdmin ,createRoom)
//update
router.put("/:id", verifyAdmin,updateRoom)
//delete
router.delete("/:id/:hotelId", verifyAdmin,deleteRoom)

//get all
router.get("/getallrooms/",getRooms)

//get
router.get("/:id",getRoom)

// availibilty
router.put("/availability/:id",updateRoomAvailability)

export default router