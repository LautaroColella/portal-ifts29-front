// Mock data for testing frontend before backend is ready
export const mockTickets = [
  {
    id: 1,
    title: 'Problema con calificación de examen',
    description: 'No aparece la calificación del último examen en el sistema. Presenté el examen el 15 de mayo y aún no veo mi nota.',
    category: 'ACADEMIC',
    subcategory: 'GRADE_ISSUE',
    status: 'OPEN',
    subject: 'Programación I',
    commission: '1K',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 2,
    title: 'Acceso a plataforma educativa',
    description: 'No puedo ingresar a la plataforma. El sistema me rechaza las credenciales aunque estoy seguro de que son correctas.',
    category: 'TECHNICAL',
    subcategory: 'MOODLE_PROBLEM',
    status: 'IN_PROGRESS',
    subject: null,
    commission: null,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 3,
    title: 'Solicitud de cambio de horario',
    description: 'Necesito cambiar mi horario de clase por conflicto laboral. Actualmente tengo clase a las 14hs pero no puedo asistir.',
    category: 'INSTITUTIONAL',
    subcategory: 'CLASS_SECTION_CHANGE_REQUEST',
    status: 'CLOSED',
    subject: 'Matemática II',
    commission: '2A',
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: 4,
    title: 'Problema con carga de trabajos prácticos',
    description: 'El sistema no me permite subir archivos mayores a 5MB. Necesito entregar un proyecto que pesa 8MB.',
    category: 'TECHNICAL',
    subcategory: 'WEBSITE_ERROR',
    status: 'IN_PROGRESS',
    subject: 'Ingeniería de Software',
    commission: '3K',
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(Date.now() - 259200000),
  },
  {
    id: 5,
    title: 'Solicitud de certificado de matrícula',
    description: 'Necesito certificado de matrícula para presentar en un trámite externo.',
    category: 'INSTITUTIONAL',
    subcategory: 'NEW_STUDENT_CERTIFICATE_REQUEST',
    status: 'OPEN',
    subject: null,
    commission: null,
    createdAt: new Date(Date.now() - 432000000),
    updatedAt: new Date(Date.now() - 432000000),
  },
];

// Mock API delay for more realistic testing
export const mockDelay = (ms = 800) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Mock API responses
export const mockApi = {
  // GET /api/tickets?page=X&limit=10&title=Y
  getTickets: async (page = 1, limit = 10, title = '') => {
    await mockDelay();

    let filtered = mockTickets;

    // Filter by title if provided
    if (title.trim()) {
      filtered = filtered.filter((ticket) =>
        ticket.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTickets = filtered.slice(start, end);

    return {
      data: paginatedTickets,
      total: filtered.length,
      page,
      limit,
    };
  },

  // POST /api/tickets
  createTicket: async (ticketData) => {
    await mockDelay(1200);

    // Validation similar to backend
    if (!ticketData.title || !ticketData.title.trim()) {
      throw {
        response: {
          status: 400,
          data: { error: 'El título es obligatorio' },
        },
      };
    }

    if (!ticketData.description || !ticketData.description.trim()) {
      throw {
        response: {
          status: 400,
          data: { error: 'La descripción es obligatoria' },
        },
      };
    }

    if (!ticketData.category) {
      throw {
        response: {
          status: 400,
          data: { error: 'La categoría es obligatoria' },
        },
      };
    }

    if (!ticketData.subcategory) {
      throw {
        response: {
          status: 400,
          data: { error: 'La subcategoría es obligatoria' },
        },
      };
    }

    // Create new ticket
    const newTicket = {
      id: Math.max(...mockTickets.map((t) => t.id), 0) + 1,
      ...ticketData,
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTickets.push(newTicket);

    return {
      data: newTicket,
      message: 'Ticket creado exitosamente',
    };
  },

  // GET /api/tickets/:id
  getTicketById: async (id) => {
    await mockDelay();

    const ticket = mockTickets.find((t) => t.id === parseInt(id));

    if (!ticket) {
      throw {
        response: {
          status: 404,
          data: { error: 'Ticket no encontrado' },
        },
      };
    }

    return {
      data: ticket,
    };
  },
};
