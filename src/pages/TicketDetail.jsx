import { useParams } from 'react-router-dom';

export const TicketDetail = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-text-main mb-6">Detalle del Reclamo</h2>
      <p className="text-text-secondary mb-4">ID: {id}</p>
      <p className="text-text-secondary">Página en construcción.</p>
    </div>
  );
};
