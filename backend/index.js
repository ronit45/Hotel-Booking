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
console.log("reached1");

// CORS configuration - allow specific origins and handle preflight
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://hotel-booking-psi-tan.vercel.app",
  "https://hotel-booking-r9ps.vercel.app",
  "https://hotel-booking-0rkp.onrender.com"
];
console.log("reached2");
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
// Diagnostic: describe imported routers BEFORE registering CORS and routes
console.log('Allowed CORS origins:', allowedOrigins);
function describe(v) {
  try {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    return `${typeof v}${v && v.constructor ? ' (' + v.constructor.name + ')' : ''}`;
  } catch (e) {
    return String(v);
  }
}
console.log('router:', describe(router));
console.log('hotelroutes:', describe(hotelroutes));
console.log('roomroutes:', describe(roomroutes));

// Guard cors() and app.options to avoid startup crashes caused by
// unexpected values being passed to Express route registration.
let corsMiddleware = null;
try {
  corsMiddleware = cors(corsOptions);
  console.log('corsMiddleware created, type:', typeof corsMiddleware);
} catch (e) {
  console.error('cors() threw during initialization:', e && e.stack ? e.stack : e);
}

if (typeof corsMiddleware === 'function') {
  try {
    app.use(corsMiddleware);
    console.log('app.use(cors) registered');
  } catch (e) {
    console.error('app.use(cors) failed:', e && e.stack ? e.stack : e);
  }

  // enable preflight across-the-board; wrap in try/catch to avoid crash and log details
  try {
    app.options('*', corsMiddleware);
    console.log('app.options(*) registered');
  } catch (err) {
    console.error('app.options(*) failed during startup:', err && err.stack ? err.stack : err);
    // Print types/values for quick inspection
    try {
      console.error('Type of router import:', describe(router));
      console.error('Type of hotelroutes import:', describe(hotelroutes));
      console.error('Type of roomroutes import:', describe(roomroutes));
    } catch (e) {
      console.error('Error while describing imports:', e);
    }
    // Fallback: enable a simple OPTIONS handler to allow preflight requests
    app.use((req, res, next) => {
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(200);
      }
      next();
    });
    console.log('Registered fallback OPTIONS handler');
  }
} else {
  console.error('corsMiddleware is not a function; registering fallback CORS handler');
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });
  console.log('Fallback CORS handler registered');
}
app.use(express.json());

app.use(cookieParser());
console.log('Allowed CORS origins:', allowedOrigins);
console.log('router:', describe(router));
console.log('hotelroutes:', describe(hotelroutes));
console.log('roomroutes:', describe(roomroutes));

try {
  console.log('Registering /api/auth');
  app.use('/api/auth', router);
  console.log('Registered /api/auth');
} catch (err) {
  console.error('Error while registering /api/auth:', err);
  throw err;
}

try {
  console.log('Registering /api/hotels');
  app.use('/api/hotels', hotelroutes);
  console.log('Registered /api/hotels');
} catch (err) {
  console.error('Error while registering /api/hotels:', err);
  throw err;
}

try {
  console.log('Registering /api/rooms');
  app.use('/api/rooms', roomroutes);
  console.log('Registered /api/rooms');
} catch (err) {
  console.error('Error while registering /api/rooms:', err);
  throw err;
}


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

