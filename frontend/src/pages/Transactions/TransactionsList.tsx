import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

interface Transaction {
  id: number;
  total_price: number;
  total_quantity: number;
  created_at: string;
}

const TransactionsList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions')
      .then((res) => setTransactions(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Daftar Transaksi</h1>
        {transactions.length === 0 ? (
          <p>Belum ada transaksi.</p>
        ) : (
          <ul>
            {transactions.map((t) => (
              <li key={t.id} className="mb-2 border-b pb-2">
                <Link to={`/transactions/${t.id}`} className="text-blue-600 hover:underline">
                  Transaksi #{t.id} — Total: Rp {t.total_price} ({t.total_quantity} item)
                </Link>
                <p className="text-sm text-gray-600">
                  Tanggal: {new Date(t.created_at).toLocaleDateString('id-ID')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default TransactionsList;
