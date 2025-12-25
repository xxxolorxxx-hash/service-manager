import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileLayout from '@/layouts/MobileLayout';
import DashboardPage from '@/pages/DashboardPage';
import ClientsPage from '@/pages/ClientsPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailsPage from '@/pages/OrderDetailsPage';
import QuotesPage from '@/pages/QuotesPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import CalendarPage from '@/pages/CalendarPage';
import { initializeDatabase } from '@/lib/db/schema';
import './styles/index.css';

function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/new" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/new" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="quotes/new" element={<QuotesPage />} />
          <Route path="quotes/:id" element={<QuotesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
