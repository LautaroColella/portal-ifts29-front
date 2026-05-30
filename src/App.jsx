import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
//import { MetricsDashboard } from './pages/MetricsDashboard';
import { Inicio, Reclamos, Ayuda } from './pages/Placeholders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="reclamos" element={<Reclamos />} />
          {/* <Route path="reportes" element={<MetricsDashboard />} /> */}
          <Route path="ayuda" element={<Ayuda />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
