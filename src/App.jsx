import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import AddTransaction from './pages/AddTransaction/AddTransaction';
import Budget from './pages/Budget/Budget';
import Analytics from './pages/Analytics/Analytics';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/new" element={<AddTransaction />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Routes>
          <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar theme="light" />
        </BrowserRouter>
      </FinanceProvider>
    </AuthProvider>
  );
}
