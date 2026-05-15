import React from 'react';

export const Inicio = () => (
  <div className="flex flex-col justify-center h-full px-8">
    <h1 className="text-4xl font-bold text-text-main mb-3">
      Sistema de Reclamos Estudiantiles
    </h1>

    <p className="text-text-secondary text-lg max-w-2xl mb-6">
      Plataforma oficial del IFTS 29 para registrar, gestionar y realizar el seguimiento de reportes académicos y administrativos.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="bg-card rounded-xl p-5 shadow">
        <h3 className="font-semibold text-text-main mb-2">📋 Reclamos</h3>
        <p className="text-sm text-text-secondary">
          Registrá y consultá el estado de tus solicitudes.
        </p>
      </div>

      <div className="bg-card rounded-xl p-5 shadow">
        <h3 className="font-semibold text-text-main mb-2">📊 Métricas</h3>
        <p className="text-sm text-text-secondary">
          Visualizá estadísticas y reportes del sistema.
        </p>
      </div>
    
    </div>
  </div>
);

export const Reclamos = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <h2 className="text-3xl font-bold text-text-main mb-4">Gestión de Reclamos</h2>
    <p className="text-text-secondary">Página en construcción.</p>
  </div>
);

export const Ayuda = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <h2 className="text-3xl font-bold text-text-main mb-4">Centro de Ayuda</h2>
    <p className="text-text-secondary">Página en construcción.</p>
  </div>
);
