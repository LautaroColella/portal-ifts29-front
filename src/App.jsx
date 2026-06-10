import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Inicio, Ayuda } from './pages/Placeholders';
import { TicketsList } from './pages/TicketsList';
import { CreateTicket } from './pages/CreateTicket';
import { TicketDetail } from './pages/TicketDetail';
import { NotificationsPage } from './pages/NotificationsPage';
import { MetricsDashboard } from './pages/MetricsDashboard';
import { Login } from './pages/Login';
import { Users } from './pages/Users';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />        
          <Route index element={<Inicio />} />
          <Route path="usuarios" element={<Users />} />
          <Route path="reclamos" element={<TicketsList />} />
          <Route path="reclamos/create" element={<CreateTicket />} />
          <Route path="reclamos/:id" element={<TicketDetail />} />
          <Route path="notificaciones" element={<NotificationsPage />} />
          <Route path="reportes" element={<MetricsDashboard />} />
          <Route path="ayuda" element={<Ayuda />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
