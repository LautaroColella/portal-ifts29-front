import { mockApi } from './mockData';

const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function apiFetch(endpoint, options = {}) {
  // If explicitly using mock, return mock data
  if (USE_MOCK) {
    return handleMockRequest(endpoint, options);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData,
        },
      };
    }

    return response.json();
  } catch (error) {
    // On network error, fallback to mock data
    console.warn('Backend no disponible, usando datos simulados:', error.message);
    return handleMockRequest(endpoint, options);
  }
}

// Handle mock requests based on endpoint and method
function handleMockRequest(endpoint, options) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  // Parse query parameters from endpoint
  const url = new URL(`http://localhost${endpoint}`);
  const params = new URLSearchParams(url.search);

  // GET /api/tickets?page=X&limit=10&title=Y
  if (endpoint.includes('/tickets') && !endpoint.match(/\/tickets\/\d+/) && method === 'GET') {
    const page = parseInt(params.get('page')) || 1;
    const limit = parseInt(params.get('limit')) || 10;
    const title = params.get('title') || '';

    return mockApi.getTickets(page, limit, title);
  }

  // GET /api/tickets/:id
  if (endpoint.match(/\/tickets\/\d+/) && method === 'GET') {
    const id = endpoint.match(/\/tickets\/(\d+)/)[1];
    return mockApi.getTicketById(id);
  }

  // POST /api/tickets
  if (endpoint === '/tickets' && method === 'POST') {
    return mockApi.createTicket(body);
  }

  throw new Error(`Endpoint no implementado: ${method} ${endpoint}`);
}