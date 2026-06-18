import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { TicketsList } from './pages/TicketsList';
import { CreateTicket } from './pages/CreateTicket';
import { TicketDetail } from './pages/TicketDetail';
import { NotificationsPage } from './pages/NotificationsPage';
import { MetricsDashboard } from './pages/MetricsDashboard';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { Register } from './pages/Register';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-text-secondary">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-text-secondary">Cargando...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/reclamos" replace />} />            
            <Route path="usuarios" element={<ProtectedRoute roles={['ADMIN']}><Users /></ProtectedRoute>} />
            <Route path="reclamos" element={<TicketsList />} />
            <Route path="reclamos/create" element={<CreateTicket />} />
            <Route path="reclamos/:id" element={<TicketDetail />} />
            <Route path="notificaciones" element={<NotificationsPage />} />
            <Route path="reportes" element={<ProtectedRoute roles={['ADMIN', 'MANAGEMENT']}><MetricsDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
