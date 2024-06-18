import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'api.rdvision.online',
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {

      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

