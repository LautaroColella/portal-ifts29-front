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
    responsible: 'Prof. García',
    createdBy: 'Juan Pérez',
    commentsCount: 3,
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
    responsible: 'Soporte IT',
    createdBy: 'María López',
    commentsCount: 5,
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
    responsible: 'Secretaría Académica',
    createdBy: 'Carlos Rodríguez',
    commentsCount: 2,
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
    responsible: 'Soporte IT',
    createdBy: 'Ana Martínez',
    commentsCount: 1,
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
    responsible: null,
    createdBy: 'Luis Fernández',
    commentsCount: 0,
    createdAt: new Date(Date.now() - 432000000),
    updatedAt: new Date(Date.now() - 432000000),
  },
];

export const mockComments = {
  1: [
    { id: 1, ticketId: 1, author: 'Prof. García', content: 'Revisando el caso en el sistema.', createdAt: new Date(Date.now() - 43200000) },
    { id: 2, ticketId: 1, author: 'Juan Pérez', content: 'Gracias, quedo a la espera.', createdAt: new Date(Date.now() - 36000000) },
    { id: 3, ticketId: 1, author: 'Prof. García', content: 'La calificación ya fue cargada correctamente.', createdAt: new Date(Date.now() - 7200000) },
  ],
  2: [
    { id: 4, ticketId: 2, author: 'Soporte IT', content: 'Estamos investigando el problema de autenticación.', createdAt: new Date(Date.now() - 86400000) },
    { id: 5, ticketId: 2, author: 'María López', content: 'Ok, avisen cuando tengan novedades.', createdAt: new Date(Date.now() - 72000000) },
  ],
  3: [
    { id: 6, ticketId: 3, author: 'Secretaría Académica', content: 'Solicitud procesada. Horario cambiado exitosamente.', createdAt: new Date(Date.now() - 172800000) },
  ],
  4: [
    { id: 7, ticketId: 4, author: 'Soporte IT', content: 'Se aumentó el límite de subida a 10MB.', createdAt: new Date(Date.now() - 259200000) },
  ],
  5: [],
};

export const mockMessages = {
  1: [
    { id: 1, ticketId: 1, author: 'Juan Pérez', content: 'Buen día, necesito ayuda con mi calificación.', createdAt: new Date(Date.now() - 80000000) },
    { id: 2, ticketId: 1, author: 'Prof. García', content: 'Hola Juan, ¿podés enviarme el comprobante del examen?', createdAt: new Date(Date.now() - 50000000) },
  ],
  2: [
    { id: 3, ticketId: 2, author: 'María López', content: 'No puedo acceder a Moodle desde hace 2 días.', createdAt: new Date(Date.now() - 150000000) },
  ],
  3: [],
  4: [],
  5: [],
};

export const mockHistory = {
  1: [
    { id: 1, ticketId: 1, author: 'Juan Pérez', action: 'Ticket creado', createdAt: new Date(Date.now() - 86400000) },
    { id: 2, ticketId: 1, author: 'Sistema', action: 'Asignado a Prof. García', createdAt: new Date(Date.now() - 72000000) },
    { id: 3, ticketId: 1, author: 'Prof. García', action: 'Estado cambiado a En Proceso', createdAt: new Date(Date.now() - 43200000) },
  ],
  2: [
    { id: 4, ticketId: 2, author: 'María López', action: 'Ticket creado', createdAt: new Date(Date.now() - 172800000) },
    { id: 5, ticketId: 2, author: 'Sistema', action: 'Asignado a Soporte IT', createdAt: new Date(Date.now() - 150000000) },
    { id: 6, ticketId: 2, author: 'Soporte IT', action: 'Estado cambiado a En Proceso', createdAt: new Date(Date.now() - 100000000) },
  ],
  3: [
    { id: 7, ticketId: 3, author: 'Carlos Rodríguez', action: 'Ticket creado', createdAt: new Date(Date.now() - 259200000) },
    { id: 8, ticketId: 3, author: 'Secretaría Académica', action: 'Estado cambiado a En Proceso', createdAt: new Date(Date.now() - 200000000) },
    { id: 9, ticketId: 3, author: 'Secretaría Académica', action: 'Estado cambiado a Cerrado', createdAt: new Date(Date.now() - 172800000) },
  ],
  4: [
    { id: 10, ticketId: 4, author: 'Ana Martínez', action: 'Ticket creado', createdAt: new Date(Date.now() - 345600000) },
    { id: 11, ticketId: 4, author: 'Soporte IT', action: 'Estado cambiado a En Proceso', createdAt: new Date(Date.now() - 300000000) },
  ],
  5: [
    { id: 12, ticketId: 5, author: 'Luis Fernández', action: 'Ticket creado', createdAt: new Date(Date.now() - 432000000) },
  ],
};

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
      createdBy: 'Usuario Actual',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTickets.push(newTicket);
    mockComments[newTicket.id] = [];
    mockMessages[newTicket.id] = [];

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

  // PATCH /api/tickets/:id/status
  updateTicketStatus: async (id, statusData) => {
    await mockDelay(600);

    const ticketIndex = mockTickets.findIndex((t) => t.id === parseInt(id));

    if (ticketIndex === -1) {
      throw {
        response: {
          status: 404,
          data: { error: 'Ticket no encontrado' },
        },
      };
    }

    const VALID_STATUSES = [
      'OPEN',
      'IN_PROGRESS',
      'WAITING_FOR_STUDENT',
      'WAITING_FOR_THIRD_PARTY',
      'RESOLVED',
      'CLOSED',
      'CANCELLED',
    ];

    if (!statusData || !statusData.status) {
      throw {
        response: {
          status: 400,
          data: { error: 'El estado del ticket es requerido' },
        },
      };
    }

    const newStatus = statusData.status.trim().toUpperCase();

    if (!VALID_STATUSES.includes(newStatus)) {
      throw {
        response: {
          status: 400,
          data: { error: 'El estado del ticket es inválido' },
        },
      };
    }

    const ticket = mockTickets[ticketIndex];

    const INVALID_TRANSITIONS = {
      CLOSED: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_STUDENT', 'WAITING_FOR_THIRD_PARTY', 'RESOLVED'],
      CANCELLED: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_STUDENT', 'WAITING_FOR_THIRD_PARTY', 'RESOLVED'],
    };

    if (INVALID_TRANSITIONS[ticket.status]?.includes(newStatus)) {
      throw {
        response: {
          status: 400,
          data: { error: `No se puede cambiar un ticket de estado ${ticket.status} a ${newStatus}` },
        },
      };
    }

    mockTickets[ticketIndex] = {
      ...ticket,
      status: newStatus,
      updatedAt: new Date(),
    };

    return {
      data: mockTickets[ticketIndex],
      message: 'Estado actualizado exitosamente',
    };
  },

  // GET /api/tickets/:id/comments
  getComments: async (id) => {
    await mockDelay();

    const comments = mockComments[parseInt(id)] || [];

    return {
      data: comments,
    };
  },

  // POST /api/tickets/:id/comments
  createComment: async (id, commentData) => {
    await mockDelay(600);

    const ticketId = parseInt(id);

    if (!mockComments[ticketId]) {
      mockComments[ticketId] = [];
    }

    if (!commentData || !commentData.content || !commentData.content.trim()) {
      throw {
        response: {
          status: 400,
          data: { error: 'El contenido del comentario es obligatorio' },
        },
      };
    }

    const newComment = {
      id: Date.now(),
      ticketId,
      author: commentData.author || 'Usuario Actual',
      content: commentData.content.trim(),
      createdAt: new Date(),
    };

    mockComments[ticketId].push(newComment);

    return {
      data: newComment,
      message: 'Comentario creado exitosamente',
    };
  },

  // GET /api/tickets/:id/messages
  getMessages: async (id) => {
    await mockDelay();

    const messages = mockMessages[parseInt(id)] || [];

    return {
      data: messages,
    };
  },

  // POST /api/tickets/:id/messages
  createMessage: async (id, messageData) => {
    await mockDelay(600);

    const ticketId = parseInt(id);

    if (!mockMessages[ticketId]) {
      mockMessages[ticketId] = [];
    }

    if (!messageData || !messageData.content || !messageData.content.trim()) {
      throw {
        response: {
          status: 400,
          data: { error: 'El contenido del mensaje es obligatorio' },
        },
      };
    }

    const newMessage = {
      id: Date.now(),
      ticketId,
      author: messageData.author || 'Usuario Actual',
      content: messageData.content.trim(),
      createdAt: new Date(),
    };

    mockMessages[ticketId].push(newMessage);

    return {
      data: newMessage,
      message: 'Mensaje creado exitosamente',
    };
  },

  // GET /api/tickets/:id/history
  getHistory: async (id) => {
    await mockDelay();

    const history = mockHistory[parseInt(id)] || [];

    return {
      data: history,
    };
  },
};
