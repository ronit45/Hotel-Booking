import axios from 'axios';

// Configure global axios defaults for the admin panel
const base = process.env.REACT_APP_API_URL || 'https://hotel-booking-0rkp.onrender.com';
axios.defaults.baseURL = base;
axios.defaults.withCredentials = true;

export default axios;
