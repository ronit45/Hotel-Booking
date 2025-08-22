import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const RoomSchema = mongoose.Schema({
    title :{
        type : String,
        required: true 
    },
    price :{
        type : Number,
        required: true 
    },
    maxPeople :{
        type : Number,
        required: true 
    },
    desc :{
        type : String,
        required: true
    },
    roomNumbers: [{
        number: Number,
        unavailableDates: [Date]
    }]

})

// [
//     {number : 101, unavailableDates: [01.05.2022 , 02.05.2022]},
//     {number : 102, unavailableDates: []}
// ]

export const Room = mongoose.model("Room", RoomSchema)
