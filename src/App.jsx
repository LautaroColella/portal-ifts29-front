import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Inicio, Ayuda } from './pages/Placeholders';
import { TicketsList } from './pages/TicketsList';
import { CreateTicket } from './pages/CreateTicket';
import { TicketDetail } from './pages/TicketDetail';
import { Dashboard } from './pages/Dashboard';
import { MetricsDashboard } from './pages/MetricsDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="reclamos" element={<TicketsList />} />
          <Route path="reclamos/create" element={<CreateTicket />} />
          <Route path="reclamos/:id" element={<TicketDetail />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reportes" element={<MetricsDashboard />} />
          <Route path="ayuda" element={<Ayuda />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
