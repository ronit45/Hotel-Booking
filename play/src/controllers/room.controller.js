import { Room } from "../models/room.model.js"
import { hotel } from "../models/hotel.model.js"
import { ApiError } from "../utils/ApiError.js"

export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelId
    const newRoom = new Room(req.body)

    try {
       const savedRoom = await newRoom.save()
       try {
            await hotel.findByIdAndUpdate(
                hotelId,
                { $push: { rooms: savedRoom._id } },
                
            )
       } catch (error) {
        next(error)
       }

       res.status(200).json(savedRoom)
    } catch (err) {
        next(err)
    }
}

export const updateRoom = async (req, res, next) =>{
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set : req.body },
            {new :true}
        )
        res.status(200).json(updatedRoom)
    } catch (err) {
        res.status(500).json(err)
    }
}
export const updateRoomAvailability = async (req, res, next) =>{
    console.log("updating room availability")
    try {
        await Room.updateOne(
            {"roomNumbers._id" : req.params.id},
            {
                $push: {
                    "roomNumbers.$.unavailableDates" : req.body.dates
                }
            }

        )
        res.status(200).json("Room updated")
    } catch (err) {
        res.status(500).json(err)
    }
}

export const deleteRoom = async (req, res, next) =>{
    const hotelId = req.params.hotelId
    try {
       await Room.findByIdAndDelete(req.params.id)
       try {
            await hotel.findByIdAndUpdate(
                hotelId,
                { $pull: { rooms: req.params.id } },
                
            )
       } catch (error) {
        next(error)
       }

       res.status(200).json("Room deleted")
    } catch (err) {
        next(err)
    }
}
export const getRoom = async (req, res, next) =>{
    try {
            const room = await Room.findById(
                req.params.id
            )
            res.status(200).json(room)
        } catch (err) {
            res.status(500).json(err)
        }
}
export const getRooms = async (req, res, next) =>{
    try {
        const rooms = await Room.find()
        res.status(200).json(rooms)
    } catch (err) {
        res.status(500).json(err)
    }
}

