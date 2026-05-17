# UI Context - Tickets & Dashboard Layout

## Theme & Layout
El diseño web se monta sobre un Layout de Dashboard común provisto por el componente `Layout`, con una navegación lateral fija (`Sidebar`) y una barra superior de control de perfil (`Topbar`). La interfaz es limpia, profesional y adaptada con clases responsivas de Tailwind CSS.

## Component & Page Mapping (Based on src/pages/)

### 1. Tickets List (`/reclamos`)
- Vista encargada de listar las entradas existentes en el sistema mediante componentes en `src/pages/`.
- Consume el endpoint `GET /api/tickets` enviando de forma dinámica los Query Parameters en la URL (`?page=...&limit=...&title=...`).
- Implementa una barra superior de búsqueda por título conectada al filtro del controlador del Back, controlando localmente que la cadena no supere los 100 caracteres.
- Renderiza una tabla responsive con columnas esenciales e incorpora un paginador inferior para controlar de forma asíncrona la mutación de la variable `page`.

### 2. Ticket Create (`/reclamos/create`)
- Vista de formulario estructurada en `src/pages/` para despachar peticiones `POST /api/tickets`.
- Captura los estados locales en un objeto JSON e implementa la validación y despliegue dinámico de categorías y subcategorías antes del envío.
- En caso de recibir un estado 400 del controlador del backend, captura la propiedad `res.data.error` para renderizar el mensaje de error correspondiente en la UI en Español.

### 3. Ticket Detail (`/reclamos/:id`)
- Estructurado en un panel de interacción dentro de la carpeta `src/pages/` para visualizar los datos del ticket cargado, cambiar estados y añadir interacciones de texto.

### 4. Dashboard (`/dashboard`)
- Vista contenedora exclusiva de reportes gráficos y analíticos (Métricas de Mirta) diseñada para la dirección de la institución de forma independiente de las rutas operativas de reclamos.