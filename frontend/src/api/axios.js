// import axios from 'axios';

// // Check if a production URL exists, otherwise fallback to local development
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true // Crucial for keeping your users logged in via JWT cookies
// });

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for sending/receiving cookies
});

export default api;