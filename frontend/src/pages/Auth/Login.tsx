import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Import instance Axios kita
import LoadingSpinner from '../../components/common/LoadingSpinner'; // Import spinner
import { AxiosError } from 'axios';

// Tipe untuk response error dari API Anda (sesuai Postman)
interface ApiErrorResponse {
  success: boolean;
  message: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State untuk UX - Sesuai ketentuan soal 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi form input di sisi client 
    if (!email || !password) {
      setError('Email dan password tidak boleh kosong.');
      return;
    }

    setIsLoading(true); // Tampilkan loading state 

    try {
      // Panggil API sesuai dokumentasi: POST /auth/login
      const response = await api.post('/auth/login', {
        email: email,
        password: password,
      });

      // Ambil token dari response
      // Sesuai dokumentasi Postman: response.data.data.access_token
      const token = response.data.data.access_token;

      // Simpan token di local storage 
      localStorage.setItem('authToken', token);

      // Arahkan ke halaman daftar buku 
      navigate('/books');

    } catch (err) {
      // Tampilkan error state 
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';

      // Pesan "Invalid credentials" akan datang dari sini
      setError(errorMessage);
    } finally {
      setIsLoading(false); // Hentikan loading state
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Login Katalog Buku
        </h2>

        <form onSubmit={handleLogin} noValidate>
          {/* Menampilkan Error State  */}
          {error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading} // Tombol disable saat loading
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              {/* Menampilkan Loading State  */}
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Memproses...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;