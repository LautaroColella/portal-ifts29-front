# Code Standards - Portal IFTS 29 Frontend

## General
- Mantener los componentes de React funcionales, limpios, pequeños y con una única responsabilidad.
- Utilizar hooks nativos (`useState`, `useEffect`, `useParams`) para controlar los flujos de datos locales de las vistas de tickets.
- Respetar rigurosamente la configuración del Linter unificado del equipo para mantener la consistencia estética del código fuente al guardar archivos.

## JavaScript & React (Vite Context)
- **Despliegue del Servidor:** El entorno local de desarrollo se ejecuta únicamente mediante `npm run dev` en la terminal. Está terminantemente prohibido utilizar extensiones estáticas como Go Live para este proyecto.
- **Idioma del Código:** Todo el código fuente interno (nombres de variables, nombres de funciones de control, manejadores de eventos como `handleSubmit` o `fetchTickets`, y mensajes de commits de Git) se escribe estrictamente en **Inglés**.
- **Idioma del Usuario:** Los textos legibles por el usuario en la interfaz gráfica (etiquetas de formularios, títulos en pantalla, placeholders, alertas y botones) se redactan en **Español**.
- Los componentes de las pantallas se crean con la convención PascalCase dentro de la carpeta destinada a las vistas (`src/pages/`).

## Styling (Tailwind CSS)
- Diseñar interfaces totalmente responsive utilizando los prefijos utilitarios de Tailwind (`md:`, `lg:`).
- Seguir un esquema de colores consistente para los Badges de los estados lógicos de los tickets:
  * **Open / Abierto:** Verde (`bg-green-100 text-green-800`).
  * **In Progress / En Proceso:** Azul (`bg-blue-100 text-blue-800`).
  * **Closed / Cerrado:** Gris (`bg-gray-100 text-gray-800`).

## API Routes & Data Communication
- Validar la integridad de los campos obligatorios del formulario en React antes de realizar el envío del JSON al servidor.
- Controlar de forma limpia los estados de carga ("Loading...") y proveer alertas amigables al usuario leyendo el objeto `{ error }` devuelto por el controlador si ocurre un código 400 o error de conexión con el backend local.