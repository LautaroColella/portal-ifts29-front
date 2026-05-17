# Feature Spec: 01-tickets-routing

## Objective
Configurar el sistema de enrutamiento web (React Router Dom) en el Frontend para alojar el módulo de Tickets de forma independiente al panel de métricas.

## Requirements
- Configurar e inyectar las siguientes rutas URL exactas asociándolas a componentes funcionales base dentro de `src/pages/`:
  1. `http://localhost:5173/reclamos` -> Listado general de tickets (`ReclamosList` o equivalente).
  2. `http://localhost:5173/reclamos/create` -> Formulario de alta de ticket (`ReclamoCreate`).
  3. `http://localhost:5173/reclamos/:id` -> Vista de detalle dinámico (`ReclamoDetail`).
- Mantener o estructurar la ruta `/dashboard` como un acceso independiente reservado para el panel analítico de métricas institucionales.
- Asegurar que todas las importaciones de las páginas apunten correctamente al directorio `src/pages/`.
- Integrar las rutas respetando el esqueleto visual global existente de la aplicación provisto por `Layout`, `Sidebar` y `Topbar`.

## Technical Constraints
- Todo el código interno (nombres de variables de ruta, nombres de los componentes y controladores) debe estar estrictamente en **Inglés**.
- El enrutador debe usar JavaScript puro (`.js` / `.jsx`).
- No alterar las dependencias base de estilos ni configuraciones globales de Tailwind CSS.

## Check when done
- [ ] Las URLs `/reclamos`, `/reclamos/create` y `/reclamos/:id` cargan sus respectivos componentes sin romper la aplicación.
- [ ] La barra de navegación lateral (`Sidebar`) vincula correctamente a `/reclamos`.
- [ ] El comando `npm run build` o la compilación de Vite pasa con éxito sin errores de sintaxis.