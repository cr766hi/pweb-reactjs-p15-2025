import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Jika tidak ada token, paksa kembali ke halaman login [cite: 27]
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, tampilkan halaman yang diminta (misal: BookList)
  // <Outlet /> akan menjadi komponen <BookList /> atau <TransactionList />
  return <Outlet />;
};

export default ProtectedRoute;