import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {User} from './src/models/user.models.js'
import cors from "cors";
import axios from "axios";
import router from './src/routes/user.routes.js';
import cookieParser from 'cookie-parser';
import hotelroutes from "./src/routes/hotels.routes.js"
import roomroutes from "./src/routes/rooms.routes.js"
dotenv.config();  // Will read from play/.env

const app = express();

// CORS configuration - allow specific origins and handle preflight
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://hotel-booking-psi-tan.vercel.app",
  "https://hotel-booking-r9ps.vercel.app",
  "https://hotel-booking-0rkp.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: This origin is not allowed'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// enable preflight across-the-board
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",router)
app.use("/api/hotels",hotelroutes)
app.use("/api/rooms", roomroutes)


mongoose.connect(process.env.MONGODB_URI,)
.then(() => console.log("DB connected"))
.catch((err) => console.error("DB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.post('/api/users',async (req, res) => {
    try {
        const {name,email} = req.body;
        console.log("Recieved :", name,email);

        const newUser = new User({name,email})
        const existedUser = await User.findOne({
        $or : [{ name }, { email }]
        })

        if(existedUser){
            throw error
        }
        await newUser.save()

        res.status(201).json({ message: "User created", user: newUser });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message : "error saving user"})
    }
});

