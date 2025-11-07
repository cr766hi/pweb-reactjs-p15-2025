import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AxiosError } from 'axios';

// Tipe untuk response error dari API Anda
interface ApiErrorResponse {
  success: boolean;
  message: string;
}

const Register = () => {
  const [username, setUsername] = useState(''); // Field tambahan
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi client-side
    if (!email || !password) {
      setError('Email dan password tidak boleh kosong.');
      return;
    }

    setIsLoading(true);

    try {
      // Panggil API sesuai dokumentasi: POST /auth/register
      await api.post('/auth/register', {
        username: username || undefined, // Kirim 'undefined' jika kosong
        email: email,
        password: password,
      });

      // Arahkan ke halaman login setelah berhasil
      navigate('/login');

    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Terjadi kesalahan.';

      // Misal: "Email already exists"
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Register Akun Baru
        </h2>

        <form onSubmit={handleRegister} noValidate>
          {error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Field opsional untuk Username */}
          <div className="mb-4">
            <label 
              htmlFor="username" 
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username (Opsional)
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

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
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              {isLoading ? <LoadingSpinner /> : 'Register'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;