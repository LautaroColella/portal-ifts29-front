// Mock data for testing frontend before backend is ready
// Structure matches backend entities: Ticket, Comment, Message, TicketHistory

export const mockUsers = {
  1: { id: 1, name: 'Juan Pérez', email: 'juan@ifts29.edu.ar', role: 'Administrador' },
  2: { id: 2, name: 'María López', email: 'maria@ifts29.edu.ar', role: 'Alumna' },
  3: { id: 3, name: 'Carlos Rodríguez', email: 'carlos@ifts29.edu.ar', role: 'Alumno' },
  4: { id: 4, name: 'Ana Martínez', email: 'ana@ifts29.edu.ar', role: 'Alumna' },
  5: { id: 5, name: 'Luis Fernández', email: 'luis@ifts29.edu.ar', role: 'Alumno' },
  6: { id: 6, name: 'Roberto García', email: 'garcia@ifts29.edu.ar', role: 'Profesor' },
  7: { id: 7, name: 'Laura Sánchez', email: 'sanchez@ifts29.edu.ar', role: 'Tutora' },
  8: { id: 8, name: 'Patricia Gómez', email: 'gomez@ifts29.edu.ar', role: 'Directora' },
  9: { id: 9, name: 'Miguel Torres', email: 'torres@ifts29.edu.ar', role: 'Coordinador' },
  10: { id: 10, name: 'Sofía Ramírez', email: 'ramirez@ifts29.edu.ar', role: 'Administrativa' },
  11: { id: 11, name: 'Diego Herrera', email: 'herrera@ifts29.edu.ar', role: 'Soporte Técnico' },
  12: { id: 12, name: 'Sistema', email: null, role: 'Automático' },
};

export const currentUser = mockUsers[1];
export const studentUser = mockUsers[2];

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
    assignedTo: mockUsers[6],
    createdBy: mockUsers[2],
    commentsCount: 3,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    resolvedAt: null,
    closedAt: null,
    metadata: null,
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
    assignedTo: mockUsers[11],
    createdBy: mockUsers[3],
    commentsCount: 5,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    resolvedAt: null,
    closedAt: null,
    metadata: null,
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
    assignedTo: mockUsers[10],
    createdBy: mockUsers[4],
    commentsCount: 2,
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 172800000),
    resolvedAt: null,
    closedAt: new Date(Date.now() - 172800000),
    metadata: null,
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
    assignedTo: mockUsers[11],
    createdBy: mockUsers[5],
    commentsCount: 1,
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(Date.now() - 259200000),
    resolvedAt: null,
    closedAt: null,
    metadata: null,
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
    assignedTo: null,
    createdBy: mockUsers[2],
    commentsCount: 0,
    createdAt: new Date(Date.now() - 432000000),
    updatedAt: new Date(Date.now() - 432000000),
    resolvedAt: null,
    closedAt: null,
    metadata: null,
  },
];

export const mockComments = {
  1: [
    { id: 1, ticketId: 1, content: 'Revisando el caso en el sistema.', author: mockUsers[6], createdAt: new Date(Date.now() - 43200000) },
    { id: 2, ticketId: 1, content: 'Gracias, quedo a la espera.', author: mockUsers[2], createdAt: new Date(Date.now() - 36000000) },
    { id: 3, ticketId: 1, content: 'La calificación ya fue cargada correctamente.', author: mockUsers[6], createdAt: new Date(Date.now() - 7200000) },
  ],
  2: [
    { id: 4, ticketId: 2, content: 'Estamos investigando el problema de autenticación.', author: mockUsers[11], createdAt: new Date(Date.now() - 86400000) },
    { id: 5, ticketId: 2, content: 'Ok, avisen cuando tengan novedades.', author: mockUsers[3], createdAt: new Date(Date.now() - 72000000) },
  ],
  3: [
    { id: 6, ticketId: 3, content: 'Solicitud procesada. Horario cambiado exitosamente.', author: mockUsers[10], createdAt: new Date(Date.now() - 172800000) },
  ],
  4: [
    { id: 7, ticketId: 4, content: 'Se aumentó el límite de subida a 10MB.', author: mockUsers[11], createdAt: new Date(Date.now() - 259200000) },
  ],
  5: [],
};

export const mockMessages = {
  1: [
    { id: 1, ticketId: 1, content: 'Buen día, necesito ayuda con mi calificación.', author: mockUsers[2], createdAt: new Date(Date.now() - 80000000) },
    { id: 2, ticketId: 1, content: 'Hola María, ¿podés enviarme el comprobante del examen?', author: mockUsers[6], createdAt: new Date(Date.now() - 50000000) },
  ],
  2: [
    { id: 3, ticketId: 2, content: 'No puedo acceder a Moodle desde hace 2 días.', author: mockUsers[3], createdAt: new Date(Date.now() - 150000000) },
  ],
  3: [],
  4: [],
  5: [],
};

export const mockHistory = {
  1: [
    { id: 1, ticketId: 1, action: 'TICKET_CREATED', oldValue: null, newValue: null, description: 'Ticket creado', performedBy: mockUsers[2], createdAt: new Date(Date.now() - 86400000) },
    { id: 2, ticketId: 1, action: 'ASSIGNED_CHANGED', oldValue: null, newValue: 'Roberto García', description: 'Asignado a Roberto García', performedBy: mockUsers[12], createdAt: new Date(Date.now() - 72000000) },
    { id: 3, ticketId: 1, action: 'STATUS_CHANGED', oldValue: 'OPEN', newValue: 'IN_PROGRESS', description: 'Estado cambiado de Abierto a En Proceso', performedBy: mockUsers[6], createdAt: new Date(Date.now() - 43200000) },
  ],
  2: [
    { id: 4, ticketId: 2, action: 'TICKET_CREATED', oldValue: null, newValue: null, description: 'Ticket creado', performedBy: mockUsers[3], createdAt: new Date(Date.now() - 172800000) },
    { id: 5, ticketId: 2, action: 'ASSIGNED_CHANGED', oldValue: null, newValue: 'Diego Herrera', description: 'Asignado a Diego Herrera', performedBy: mockUsers[12], createdAt: new Date(Date.now() - 150000000) },
    { id: 6, ticketId: 2, action: 'STATUS_CHANGED', oldValue: 'OPEN', newValue: 'IN_PROGRESS', description: 'Estado cambiado de Abierto a En Proceso', performedBy: mockUsers[11], createdAt: new Date(Date.now() - 100000000) },
  ],
  3: [
    { id: 7, ticketId: 3, action: 'TICKET_CREATED', oldValue: null, newValue: null, description: 'Ticket creado', performedBy: mockUsers[4], createdAt: new Date(Date.now() - 259200000) },
    { id: 8, ticketId: 3, action: 'ASSIGNED_CHANGED', oldValue: null, newValue: 'Sofía Ramírez', description: 'Asignado a Sofía Ramírez', performedBy: mockUsers[12], createdAt: new Date(Date.now() - 200000000) },
    { id: 9, ticketId: 3, action: 'STATUS_CHANGED', oldValue: 'OPEN', newValue: 'IN_PROGRESS', description: 'Estado cambiado de Abierto a En Proceso', performedBy: mockUsers[10], createdAt: new Date(Date.now() - 200000000) },
    { id: 10, ticketId: 3, action: 'STATUS_CHANGED', oldValue: 'IN_PROGRESS', newValue: 'CLOSED', description: 'Estado cambiado de En Proceso a Cerrado', performedBy: mockUsers[10], createdAt: new Date(Date.now() - 172800000) },
  ],
  4: [
    { id: 11, ticketId: 4, action: 'TICKET_CREATED', oldValue: null, newValue: null, description: 'Ticket creado', performedBy: mockUsers[5], createdAt: new Date(Date.now() - 345600000) },
    { id: 12, ticketId: 4, action: 'ASSIGNED_CHANGED', oldValue: null, newValue: 'Diego Herrera', description: 'Asignado a Diego Herrera', performedBy: mockUsers[12], createdAt: new Date(Date.now() - 300000000) },
    { id: 13, ticketId: 4, action: 'STATUS_CHANGED', oldValue: 'OPEN', newValue: 'IN_PROGRESS', description: 'Estado cambiado de Abierto a En Proceso', performedBy: mockUsers[11], createdAt: new Date(Date.now() - 300000000) },
  ],
  5: [
    { id: 14, ticketId: 5, action: 'TICKET_CREATED', oldValue: null, newValue: null, description: 'Ticket creado', performedBy: mockUsers[2], createdAt: new Date(Date.now() - 432000000) },
  ],
};

// Mock API delay for more realistic testing
export const mockDelay = (ms = 800) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const formatStatus = (status) => {
  const statusMap = {
    'OPEN': 'Abierto',
    'IN_PROGRESS': 'En Proceso',
    'WAITING_FOR_STUDENT': 'Esperando Estudiante',
    'WAITING_FOR_THIRD_PARTY': 'Esperando Terceros',
    'RESOLVED': 'Resuelto',
    'CLOSED': 'Cerrado',
    'CANCELLED': 'Cancelado',
  };
  return statusMap[status] || status;
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
      assignedTo: null,
      createdBy: currentUser,
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt: null,
      closedAt: null,
      metadata: null,
    };

    mockTickets.push(newTicket);
    mockComments[newTicket.id] = [];
    mockMessages[newTicket.id] = [];
    mockHistory[newTicket.id] = [
      {
        id: Date.now(),
        ticketId: newTicket.id,
        action: 'TICKET_CREATED',
        oldValue: null,
        newValue: null,
        description: 'Ticket creado',
        performedBy: currentUser,
        createdAt: new Date(),
      },
    ];

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

    const updatedTicket = {
      ...ticket,
      status: newStatus,
      updatedAt: new Date(),
      resolvedAt: newStatus === 'RESOLVED' ? new Date() : ticket.resolvedAt,
      closedAt: (newStatus === 'CLOSED' || newStatus === 'CANCELLED') ? new Date() : ticket.closedAt,
    };

    mockTickets[ticketIndex] = updatedTicket;

    if (mockHistory[ticket.id]) {
      mockHistory[ticket.id].push({
        id: Date.now(),
        ticketId: ticket.id,
        action: 'STATUS_CHANGED',
        oldValue: ticket.status,
        newValue: newStatus,
        description: `Estado cambiado de ${formatStatus(ticket.status)} a ${formatStatus(newStatus)}`,
        performedBy: mockUsers[12],
        createdAt: new Date(),
      });
    }

    return {
      data: updatedTicket,
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
      author: currentUser,
      content: commentData.content.trim(),
      createdAt: new Date(),
    };

    mockComments[ticketId].push(newComment);

    if (mockHistory[ticketId]) {
      mockHistory[ticketId].push({
        id: Date.now() + 1,
        ticketId,
        action: 'COMMENT_ADDED',
        oldValue: null,
        newValue: null,
        description: 'Comentario agregado',
        performedBy: currentUser,
        createdAt: new Date(),
      });
    }

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
      author: currentUser,
      content: messageData.content.trim(),
      createdAt: new Date(),
    };

    mockMessages[ticketId].push(newMessage);

    if (mockHistory[ticketId]) {
      mockHistory[ticketId].push({
        id: Date.now() + 1,
        ticketId,
        action: 'MESSAGE_ADDED',
        oldValue: null,
        newValue: null,
        description: 'Mensaje agregado',
        performedBy: currentUser,
        createdAt: new Date(),
      });
    }

    return {
      data: newMessage,
      message: 'Mensaje creado exitosamente',
    };
  },

  // GET /api/tickets/:id/history
  getHistory: async (id) => {
    await mockDelay();

    const history = mockHistory[parseInt(id)] || [];
    console.log('getHistory called for id:', id, 'parsed:', parseInt(id), 'history:', history);

    return {
      data: history,
    };
  },

  // DELETE /api/tickets/:id
  deleteTicket: async (id) => {
    await mockDelay(600);

    const ticketId = parseInt(id);
    const ticketIndex = mockTickets.findIndex((t) => t.id === ticketId);

    if (ticketIndex === -1) {
      throw {
        response: {
          status: 404,
          data: { error: 'Ticket no encontrado' },
        },
      };
    }

    const deletedTicket = mockTickets[ticketIndex];

    mockTickets.splice(ticketIndex, 1);
    delete mockComments[ticketId];
    delete mockMessages[ticketId];
    delete mockHistory[ticketId];

    if (mockHistory[ticketId]) {
      mockHistory[ticketId].push({
        id: Date.now(),
        ticketId,
        action: 'TICKET_DELETED',
        oldValue: null,
        newValue: null,
        description: 'Ticket eliminado',
        performedBy: currentUser,
        createdAt: new Date(),
      });
    }

    return {
      data: deletedTicket,
      message: 'Ticket eliminado exitosamente',
    };
  },
};
