# Portal IFTS 29 - Frontend

Interfaz web del Portal IFTS N°29.

## Tecnologías

- **React 19** con **Vite 8**
- **Tailwind CSS 4** para estilos
- **React Router 7** para navegación (HashRouter)
- **Recharts** para gráficos y métricas
- **Framer Motion** para animaciones
- **Lucide React** para iconos

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- Backend corriendo en `http://localhost:3000` (ver [portal-ifts29-back](https://github.com/LautaroColella/portal-ifts29-back))

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/LautaroColella/portal-ifts29-front.git
cd portal-ifts29-front
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo:

```bash
copy .env.example .env
```

Contenido del `.env`:

| Variable       | Descripción              | Valor por defecto            |
|----------------|--------------------------|------------------------------|
| `VITE_API_URL` | URL base de la API       | `http://localhost:3000/api`  |

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación se abre en `http://localhost:5173/portal-ifts29-front/`.

## Orden de ejecución para desarrollo local

1. Tener **PostgreSQL** corriendo con la base de datos `portal_ifts29` creada
2. Cargar los datos de prueba (seed) si es necesario
3. Levantar el **backend** (`npm run dev` en portal-ifts29-back)
4. Levantar el **frontend** (`npm run dev` en portal-ifts29-front)
5. Abrir `http://localhost:5173/portal-ifts29-front/` en el navegador

## Estructura del proyecto

```
src/
├── components/
│   └── layout/      # Layout principal, Sidebar, Topbar
├── context/         # AuthContext (manejo de sesión con JWT)
├── pages/           # Páginas de la aplicación
│   ├── Login.jsx
│   ├── TicketsList.jsx
│   ├── TicketDetail.jsx
│   ├── CreateTicket.jsx
│   ├── Users.jsx
│   ├── MetricsDashboard.jsx
│   └── NotificationsPage.jsx
└── services/        # Funciones de comunicación con la API
    ├── api.js
    ├── notificationApi.js
    └── userService.js
```

## Roles y acceso

| Rol          | Reclamos                | Usuarios | Reportes |
|--------------|-------------------------|----------|----------|
| `STUDENT`    | Ve solo los propios     | No       | No       |
| `STAFF`      | Ve los asignados        | No       | No       |
| `MANAGEMENT` | Ve todos                | No       | Sí       |
| `ADMIN`      | Ve todos                | Sí       | Sí       |

## Scripts disponibles

| Comando         | Descripción                      |
|-----------------|----------------------------------|
| `npm run dev`   | Servidor de desarrollo con HMR   |
| `npm run build` | Build de producción              |
| `npm run preview` | Preview del build de producción |
| `npm run lint`  | Ejecutar ESLint                  |
