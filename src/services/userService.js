// mock data
const defaultMockUsers = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Pérez",
    dni: "12345678",
    email: "student@mail.com",
    role: "STUDENT",
    staffType: null,
    responsibleSubcategories: null,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z"
  },
  {
    id: 2,
    firstName: "María",
    lastName: "Gómez",
    dni: "87654321",
    email: "staff@mail.com",
    role: "STAFF",
    staffType: "TUTOR",
    responsibleSubcategories: ["ACADEMIC_ISSUES"],
    createdAt: "2026-01-11T11:30:00Z",
    updatedAt: "2026-02-15T09:20:00Z"
  },
  {
    id: 3,
    firstName: "Carlos",
    lastName: "Rodríguez",
    dni: "11223344",
    email: "admin@mail.com",
    role: "ADMIN",
    staffType: null,
    responsibleSubcategories: null,
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-05T08:00:00Z"
  }
];

// Initialize from localStorage or use defaults
const getStoredUsers = () => {
  const stored = localStorage.getItem('mockUsers');
  return stored ? JSON.parse(stored) : [...defaultMockUsers];
};

const getStoredNextId = () => {
  const stored = localStorage.getItem('mockUsersNextId');
  return stored ? parseInt(stored, 10) : 4;
};

let mockUsers = getStoredUsers();
let nextId = getStoredNextId();

const saveToStorage = () => {
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  localStorage.setItem('mockUsersNextId', nextId.toString());
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  getUsers: async () => {
    await delay(500);
    return [...mockUsers];
  },

  getUser: async (id) => {
    await delay(500);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error("Usuario no encontrado");
    return { ...user };
  },

  createUser: async (userData) => {
    await delay(500);
    const newUser = {
      ...userData,
      id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    saveToStorage();
    return { ...newUser };
  },

  updateUser: async (id, userData) => {
    await delay(500);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Usuario no encontrado");
    
    mockUsers[index] = {
      ...mockUsers[index],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage();
    return { ...mockUsers[index] };
  },

  deleteUser: async (id) => {
    await delay(500);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Usuario no encontrado");
    mockUsers.splice(index, 1);
    saveToStorage();
    return true;
  }
};
