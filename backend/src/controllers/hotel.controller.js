import { hotel } from "../models/hotel.model.js"
import { Room } from "../models/room.model.js"
import { router } from "../routes/hotels.routes.js"

export const createHotel = async (req, res, next) =>{
    const newHotel = new hotel(req.body)
    try {
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    } catch (err) {
        res.status(500).json(err)
    }
}
export const updateHotel = async (req, res, next) =>{
    try {
        const updatedHotel = await hotel.findByIdAndUpdate(
            req.params.id,
            { $set : req.body },
            {new :true}
        )
        res.status(200).json(updatedHotel)
    } catch (err) {
        res.status(500).json(err)
    }
}
export const deleteHotel = async (req, res, next) =>{
    try {
            await hotel.findByIdAndDelete(
                req.params.id
            )
            res.status(200).json("Hotel has been deleted")
        } catch (err) {
            res.status(500).json(err)
        }
}
export const getHotel = async (req, res, next) =>{
    try {
            const Hotel = await hotel.findById(
                req.params.id
            )
            res.status(200).json(Hotel)
        } catch (err) {
            res.status(500).json(err)
        }
}

export const getAllHotel = async (req, res, next) => {
  const { min, max, city, limit, ...others } = req.query;

  // Build filter object dynamically
  let filter = { ...others };
  if (city) filter.city = city;
  if (min || max) {
    filter.cheapestPrice = {};
    if (min) filter.cheapestPrice.$gt = Number(min);
    if (max) filter.cheapestPrice.$lt = Number(max);
  }

  try {
    let query = hotel.find(filter);
    if (limit && Number(limit) > 0) {
      query = query.limit(Number(limit));
    }
    const Hotels = await query;
    res.status(200).json(Hotels);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const countByCity = async (req, res, next) =>{
    const cities = req.query.cities.split(",")
    try {
            const list = await Promise.all(cities.map(city => {
                return hotel.countDocuments({city: city})
            }))
            res.status(200).json(list)
        } 
    catch (err) {
            res.status(500).json(err)
    }
}

export const countByType = async (req, res, next) =>{

    try {
            const hotelCount = await hotel.countDocuments({type :"hotel"})
            const apartmentCount = await hotel.countDocuments({type:"apartment"})
            const resortCount = await hotel.countDocuments({type :"resort"})
            const villaCount = await hotel.countDocuments({type :"villa"})
            res.status(200).json([
                {type : "hotel" , count : hotelCount},
                {type : "apartments" , count : apartmentCount},
                {type : "resort" , count : resortCount},
                {type : "villas" , count : villaCount},

            ])
        } 
    catch (err) {
            res.status(500).json(err)
    }
}

export const getHotelRooms = async (req,res,next) => {
    try {
        const Hotel = await hotel.findById(req.params.id)
        console.log(Hotel)
        const list = await Promise.all(Hotel.rooms.map (room => {
            return Room.findById(room)
        } ))
        res.status(200).json(list)
        
    } catch (err) {
        next(err)
    }
}

