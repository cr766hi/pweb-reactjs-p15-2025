import React, { useState } from 'react';

const BookList = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Anda Berhasil Login!
      </h1>
      <p className="mt-4 text-lg">
        Ini adalah Halaman Daftar Buku (Book List) yang terproteksi.
      </p>
      <p className="mt-2">
        Tombol **Logout** sudah ada di Navbar di atas, sesuai permintaan Anda.
      </p>
    </div>
  );
};

export default BookList;