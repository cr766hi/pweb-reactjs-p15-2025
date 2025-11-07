import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Genre {
  id: number;
  name: string;
}

const AddBook = () => {
  const [form, setForm] = useState({
    title: '',
    writer: '',
    publisher: '',
    price: '',
    stock: '',
    genreId: '',
  });
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/genres').then((res) => setGenres(res.data.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/books', {
        title: form.title,
        writer: form.writer,
        publisher: form.publisher,
        price: Number(form.price),
        stock: Number(form.stock),
        genre_id: Number(form.genreId),
      });
      setSuccess('Buku berhasil ditambahkan!');
      setForm({ title: '', writer: '', publisher: '', price: '', stock: '', genreId: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-8 bg-white shadow-md p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">Tambah Buku Baru</h2>
        {success && <p className="mb-4 text-green-600">{success}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="title" placeholder="Judul" value={form.title} onChange={handleChange} />
          <input name="writer" placeholder="Penulis" value={form.writer} onChange={handleChange} />
          <input name="publisher" placeholder="Penerbit" value={form.publisher} onChange={handleChange} />
          <input name="price" placeholder="Harga" value={form.price} onChange={handleChange} />
          <input name="stock" placeholder="Stok" value={form.stock} onChange={handleChange} />

          <select name="genreId" value={form.genreId} onChange={handleChange}>
            <option value="">Pilih Genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? <LoadingSpinner /> : 'Tambah Buku'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddBook;
