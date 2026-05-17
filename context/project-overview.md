# Portal IFTS 29 - Módulo Tickets y Dashboard de Métricas

## Overview
El Portal IFTS 29 es una plataforma web centralizada para gestionar las consultas y trámites académicos del Instituto de Formación Técnica Superior N.° 29. El sistema separa la experiencia operativa en dos grandes secciones: el módulo de gestión de **Tickets/Reclamos** (accesible directamente en la URL pública del sistema) y el **Dashboard** (un panel analítico exclusivo de reportes y métricas institucionales diseñado para la dirección que desarrollará Mirta). Ambas secciones funcionan bajo un modelo de Usuario General en esta fase de desarrollo.

## Core User Flow
1. El Usuario inicia sesión en la plataforma de manera segura.
2. El Usuario gestiona sus trámites ingresando a la sección de Reclamos (`/reclamos`), donde visualiza la bandeja general, busca entradas o crea un nuevo ticket.
3. El Usuario puede abrir cualquier ticket individual (`/reclamos/:id`) para auditar los detalles, cambiar el estado actual o redactar comentarios interactivos.
4. El personal de la dirección accede a la sección de **Dashboard** (`/dashboard`) para analizar los reportes estadísticos y métricas de rendimiento del sistema.

## Scope (Esta etapa)
- **In Scope:** CRUD completo del módulo de Tickets en el Frontend mapeado en la ruta `/reclamos` (Listado general, filtros, formulario de alta, detalle interactivo con historial y caja de comentarios), consumiendo JSON desde la API REST local del Backend (`/api/tickets`).
- **Out of Scope:** Restricciones de interfaz basadas en roles jerárquicos rígidos para la creación de tickets y pasarelas de notificación por correo electrónico.

## Success Criteria
1. El sistema renderiza el módulo de gestión de reclamos exactamente bajo la dirección `http://localhost:5173/reclamos`.
2. El usuario puede enviar el formulario de alta y este se almacena con éxito en la base de datos PostgreSQL a través del controlador del backend.
3. El usuario puede abrir un ticket, modificar su estado y redactar comentarios en el feed de discusión.