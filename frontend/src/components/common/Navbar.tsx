import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. Import Link juga

const Navbar = () => {
  // 2. Panggil useNavigate DI DALAM komponen
  const navigate = useNavigate(); 

  // 3. Fungsi logout Anda sekarang akan berfungsi
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Hapus token
    navigate('/login'); // Arahkan ke login
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-xl font-bold">Katalog Buku</span>
        <div>
          <Link to="/books" className="px-3 hover:text-gray-300">
            Daftar Buku
          </Link>
          <Link to="/transactions" className="px-3 hover:text-gray-300">
            Transaksi
          </Link>
          <button 
            onClick={handleLogout} 
            className="ml-4 rounded bg-indigo-600 px-3 py-1 hover:bg-indigo-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;