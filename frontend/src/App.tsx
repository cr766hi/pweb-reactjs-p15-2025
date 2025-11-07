import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Import Halaman (Auth)
import Login from './pages/Auth/Login.tsx';
import Register from './pages/Auth/Register.tsx';

// Import Halaman Buku
import BookList from './pages/Books/BooksList.tsx';
import BookDetail from './pages/Books/BookDetail.tsx';
import AddBook from './pages/Books/AddBook.tsx';

// Import Halaman Transaksi
import TransactionsList from './pages/Transactions/TransactionsList.tsx';
import TransactionDetail from './pages/Transactions/TransactionDetail.tsx';

// Import Komponen Umum
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import Navbar from './components/common/Navbar.tsx';

// Layout utama untuk halaman yang punya navbar
const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> 
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========== RUTE PUBLIK (tanpa login) ========== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ========== RUTE TERPROTEKSI (harus login) ========== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* --- Halaman Buku --- */}
            <Route path="/books" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/books/add" element={<AddBook />} />

            {/* --- Halaman Transaksi --- */}
            <Route path="/transactions" element={<TransactionsList />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />

            {/* --- Redirect default ke /books --- */}
            <Route path="/" element={<Navigate to="/books" replace />} />

          </Route>
        </Route>

        {/* ========== 404 NOT FOUND (opsional) ========== */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-3xl font-bold text-gray-800">404 - Halaman Tidak Ditemukan</h1>
              <a href="/books" className="mt-4 text-indigo-600 hover:underline">
                Kembali ke Beranda
              </a>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
