import axios from "axios";

import axios from 'axios';

// Set default configurations
const instance = axios.create({
    baseURL: 'https://hotel-booking-0rkp.onrender.com/api',
    withCredentials: true
});

export default instance;
