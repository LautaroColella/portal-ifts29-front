import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { CreateTicket } from "./pages/CreateTicket";
import { Login } from "./pages/Login";
import { MetricsDashboard } from "./pages/MetricsDashboard";
import { NotificationsPage } from "./pages/NotificationsPage";
import { Ayuda } from "./pages/Placeholders";
import { TicketDetail } from "./pages/TicketDetail";
import { TicketsList } from "./pages/TicketsList";
import { Users } from "./pages/Users";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route index element={<Navigate to="/reclamos" replace />} />
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
    </HashRouter>
  );
}

export default App;
