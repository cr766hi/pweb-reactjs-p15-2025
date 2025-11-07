import axios from 'axios';

// 1. Ambil Base URL dari file .env
// Pastikan Anda membuat file .env di folder 'frontend/'
// dan mengisinya dengan: VITE_API_BASE_URL=http://localhost:8080
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Buat instance Axios
const api = axios.create({
  baseURL: VITE_API_BASE_URL,
});

// 3. Buat Interceptor (PENTING untuk autentikasi)
// Ini akan berjalan *setiap kali* Anda membuat request 
api.interceptors.request.use(
  (config) => {
    // 4. Ambil token dari local storage
    const token = localStorage.getItem('authToken');

    if (token) {
      // 5. Jika token ada, tambahkan ke header Authorization
      // Sesuai dokumentasi API Anda ("Bearer Token")
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;