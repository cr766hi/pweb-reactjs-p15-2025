import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/LoadingSpinner';
import Navbar from '../../components/common/Navbar';

interface Book {
  id: number;
  title: string;
  writer: string;
  publisher: string;
  price: number;
  stock: number;
  genre?: { name: string };
  description?: string;
  publication_year?: number;
}

const BookDetail: React.FC = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => setBook(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!book) return <p className="p-6 text-center">Buku tidak ditemukan.</p>;

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
        <p>Penulis: {book.writer}</p>
        <p>Penerbit: {book.publisher}</p>
        <p>Genre: {book.genre?.name}</p>
        <p>Harga: Rp {book.price}</p>
        <p>Stok: {book.stock}</p>
        {book.description && <p className="mt-4">{book.description}</p>}
      </div>
    </>
  );
};

export default BookDetail;
