import axios from 'axios';

// Configure global axios defaults for the admin panel
axios.defaults.baseURL = 'https://hotel-booking-0rkp.onrender.com/api';
axios.defaults.withCredentials = true;

export default axios;
