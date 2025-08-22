import express from "express"
import { hotel } from "../models/hotel.model.js";
import { countByCity, countByType, 
    createHotel, deleteHotel, 
    getAllHotel, getHotel,
    getHotelRooms, updateHotel } from "../controllers/hotel.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
export const router = express.Router();

//create
router.post("/",verifyAdmin ,createHotel)
//update
router.put("/find/:id", verifyAdmin,updateHotel)
//delete
router.delete("/find/:id", verifyAdmin,deleteHotel)
//get
router.get("/find/:id",getHotel)
//get all
router.get("/",getAllHotel)

router.get("/countByCity",countByCity)

router.get("/countByType",countByType)
router.get("/room/:id", getHotelRooms)


export default router