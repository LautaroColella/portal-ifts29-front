# Architecture Context - Frontend (Portal IFTS 29)

## Stack & Technologies
- **Framework:** React + Vite (JavaScript puro, utilizando archivos `.js` y `.jsx`). Servidor de desarrollo local obligatorio mediante `npm run dev` en `http://localhost:5173`. (No utilizar Go Live).
- **Styling:** Framework utilitario Tailwind CSS para maquetación responsiva.
- **Icons:** FontAwesome para los componentes visuales de la interfaz.
- **State & Connection:** Peticiones asíncronas asumiendo consumo de JSON plano desde la API REST local del servidor (`http://localhost:3000/api/tickets`).

## System Boundaries (Estructura Real del Proyecto)
El código se organiza de acuerdo a la distribución exacta de archivos en ambos repositorios:
- **Backend Entry Points:** Rutas expuestas en `src/routes/ticket.Routes.js` y delegadas a `src/controllers/ticketController.js`.
- **Frontend Global Components:** Estructura esqueleto en `src/components/` (`Layout`, `Topbar`, `Sidebar`).
- **Frontend Views (Páginas del CRUD):** Las pantallas interactivas y la lógica de negocio del módulo de tickets se desarrollan exclusivamente dentro de la carpeta **`src/pages/`**.

## Routing & URL Structure
- `/reclamos` — Mapea a la vista de la bandeja general y listado de tickets en el sistema.
- `/reclamos/create` — Mapea a la vista del formulario interactivo de alta de un reclamo.
- `/reclamos/:id` — Mapea a la vista de detalle del ticket, actualización de estados y comentarios.
- `/dashboard` — Mapea de forma independiente al panel de reportes estadísticos y métricas de rendimiento analítico de Mirta.

## Backend Contracts & Validations
El Frontend debe estructurar las peticiones HTTP respetando estrictamente los contratos de validación definidos por el Backend para evitar respuestas de error.

### 1. Creación de Tickets (`createTicketValidator.js` -> `POST /api/tickets`)
El cuerpo enviado debe ser un objeto JSON con la siguiente estructura:
- `title`: string (Obligatorio, aplica `.trim()`)
- `description`: string (Obligatorio, aplica `.trim()`)
- `category`: string (Obligatorio: 'ACADEMIC' | 'INSTITUTIONAL' | 'TECHNICAL' | 'GENERAL')
- `subcategory`: string (Obligatorio - Debe pertenecer a la categoría seleccionada)
- `subject`: string (Opcional / Nullable)
- `commission`: string (Opcional / Nullable)
- `metadata`: object (Opcional / Nullable)

#### Mapa de Categorías y Subcategorías:
- **ACADEMIC:** 'GRADE_ISSUE', 'EXAM_ISSUE', 'CORRELATIVITY_ISSUE', 'SUBJECT_CONTENT_ISSUE'
- **INSTITUTIONAL:** 'SUBJECT_EQUIVALENCY_REQUEST', 'GRADE_RECORD_CORRECTION_REQUEST', 'NEW_STUDENT_CERTIFICATE_REQUEST', 'EXAM_CERTIFICATE_REQUEST', 'DEGREE_PROCESS_REQUEST', 'CLASS_SECTION_CHANGE_REQUEST'
- **TECHNICAL:** 'MOODLE_PROBLEM', 'SIU_PROBLEM', 'WEBSITE_ERROR'
- **GENERAL:** 'GENERAL_INQUIRY'

### 2. Listado y Filtros (`ticketFiltersValidator.js` y `paginationValidator.js` -> `GET /api/tickets`)
Las peticiones de obtención de datos admiten parámetros en la Query String del URL:
- `page`: número entero positivo igual o mayor a 1 (Default: 1).
- `limit`: número entero positivo entre 1 y 50 (Default: 10, MAX_LIMIT = 50).
- `title`: string opcional (Si se envía, debe tener entre 1 y 100 caracteres y aplica `.trim()`).

### 3. HTTP Responses & Error Handling
- **Respuesta Exitosa Listado (200 OK):** Devuelve el JSON directo con los datos de los tickets (`res.status(200).json(tickets)`).
- **Respuesta Exitosa Alta (201 Created):** Devuelve el objeto del ticket creado (`res.status(201).json(ticket)`).
- **Respuestas Erróneas (400 Bad Request):** Devuelve un objeto JSON con la forma `{ error: err.message }`. El Front debe capturar esta propiedad para mostrar las alertas.

## Invariants (Reglas de Oro del Código)
1. **Naming & Language Conventions:** Los nombres de los archivos base se respetan según la estructura existente (`ticket.Routes.js`, `ticketController.js`). Toda la lógica interna nueva se escribe en **Inglés** (`handleSubmit`, `fetchTicketsData`). Las etiquetas visuales legibles por el usuario se redactan en **Español**.
2. **Error Catching:** Toda petición asíncrona al backend debe envolverse en bloques `try/catch` para capturar la estructura `{ error }` provista por el controlador en caso de fallos de validación (400).