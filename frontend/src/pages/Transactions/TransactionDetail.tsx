import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Item {
  book: { title: string; price: number };
  quantity: number;
  subtotal_price: number;
}

interface Transaction {
  id: number;
  total_price: number;
  total_quantity: number;
  created_at: string;
  order_items: Item[];
}

const TransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/transactions/${id}`)
      .then((res) => setTransaction(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!transaction) return <p className="p-6 text-center">Transaksi tidak ditemukan.</p>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Detail Transaksi #{transaction.id}</h1>
        <p>Total Harga: Rp {transaction.total_price}</p>
        <p>Total Jumlah: {transaction.total_quantity}</p>
        <p className="mb-4 text-gray-600">
          Tanggal: {new Date(transaction.created_at).toLocaleDateString('id-ID')}
        </p>

        <h2 className="text-xl font-semibold mb-2">Item Pembelian:</h2>
        <ul className="list-disc pl-6">
          {transaction.order_items.map((item, i) => (
            <li key={i}>
              {item.book.title} — {item.quantity}x @ Rp{item.book.price} = Rp{item.subtotal_price}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TransactionDetail;
