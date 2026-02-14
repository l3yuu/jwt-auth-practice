import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // Crucial: This tells the browser to send cookies
});

export default api;