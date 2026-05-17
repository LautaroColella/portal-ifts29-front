# AI Workflow Rules - Portal IFTS 29 Front-end

## Approach
Este proyecto se construye de manera incremental y guiada por especificaciones técnicas fijadas en los contratos de red. La IA de VS Code debe actuar exclusivamente bajo el contexto de este set de archivos, absteniéndose de inferir o inventar directorios, roles o comportamientos que no estén explícitamente listados.

## Scoping Rules
- Trabajar en una sola vista o funcionalidad a la vez (List, Create o Detail dentro de `src/pages/`).
- **Aislamiento de Código:** No mezclar la maquetación de componentes visuales con la lógica de persistencia del backend de forma directa en el mismo paso; modularizar las responsabilidades.
- Antes de dar por finalizada una tarea en la IA, verificar que la aplicación compile correctamente corriendo localmente el servidor de Vite mediante `npm run dev`.

## Handling Backend Synchronicity
- El backend expone rutas en `src/routes/ticket.Routes.js` y delega la lógica a `src/controllers/ticketController.js`.
- Las peticiones HTTP que genere el Frontend (GET, POST, PUT) deben apuntar directamente al endpoint unificado de `/api/tickets`, asumiendo entrada y salida exclusiva en formato JSON plano y controlando los códigos de error HTTP 400.

## Protected Files
- No modificar ni alterar las configuraciones estructurales del proyecto (`package.json`, `tailwind.config.js` o las dependencias base) a menos que sea estrictamente necesario para la funcionalidad.