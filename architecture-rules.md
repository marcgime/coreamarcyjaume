# Reglas Arquitectónicas y Guardarraíles - Trip Tracker SPA (Static JSON Edition)

Este documento contiene las reglas de diseño e implementación innegociables para el desarrollo de la aplicación web de seguimiento de viajes. Al ser una información fija sin base de datos externa, el enfoque es la máxima ligereza, velocidad de carga y consistencia visual móvil. El agente de IA DEBE validar el código contra estas restricciones.

---

## 1. Stack, Entorno y Enfoque Móvil
- **Framework Frontend**: Angular (versión 17+) utilizando exclusivamente **Standalone Components** (sin NgModules).
- **Enfoque UI (Mobile-First)**: El diseño visual debe emular estrictamente una **aplicación móvil nativa** basada en los mockups de Stitch. 
  - Layout con contenedor centrado (`max-width: 430px` aproximadamente en pantallas de escritorio) para simular la pantalla de un teléfono.
  - Barra de navegación inferior fija (Bottom Nav Bar) para cambiar de pantallas.
  - Scroll vertical fluido y deshabilitación de scrolls horizontales rebeldes.

---

## 2. Gestión de Datos Estáticos (Estrategia sin Base de Datos)
Toda la información de los viajes es fija y precargada. Queda prohibido el uso de Firebase, bases de datos en la nube o APIs externas complejas.

- **Origen de Datos**: Ficheros estáticos `.json` ubicados exclusivamente en la carpeta `src/assets/data/` (ej. `active-trip.json`, `trips-history.json`).
- **Consumo de Datos**: Se realizará mediante el servicio nativo `HttpClient` de Angular para simular peticiones de red asíncronas de manera limpia.
- **Offline por Defecto**: Dado que los datos viven en local, la app debe estar diseñada para ser 100% funcional sin conexión a internet.

---

## 3. Arquitectura de Código de Dos Capas (Separación de Conceptos)
Para evitar la sobreingeniería de la arquitectura hexagonal, el código se dividirá de forma simple pero estricta en dos mundos:

- **Capa de Datos y Estado (`src/app/core/services/`)**: 
  - Un único servicio centralizado (`trip.service.ts`) se encarga de hacer el `HttpClient.get()` para leer los JSON.
  - El estado del viaje actual (qué parada es la activa, si el viaje ha comenzado, etc.) se gestionará mediante **Angular Signals**. Los componentes solo leen estas Signals; no calculan el estado por sí mismos.
- **Capa de Presentación (`src/app/shared/components/` y `src/app/features/`)**:
  - Dedicada exclusivamente a pintar la interfaz y reaccionar a las interacciones del usuario (pulsar un botón). No hay lógica de rutas ni de lectura de archivos aquí.

---

## 4. Estructura de UI: Atomic Design para Interfaz Móvil
La estructura de carpetas de componentes debe seguir de forma pragmática la metodología **Atomic Design** para garantizar que la app luzca idéntica a los diseños de Stitch:

- **Átomos (`/components/atoms/`)**: Componentes visuales mínimos, atómicos y sin lógica de negocio.
  - *Ejemplos*: Un botón flotante redondo (FAB), un badge de estado de la parada (Pendiente/Visitado), un icono de medio de transporte (avión, tren, coche, a pie).
- **Moléculas (`/components/molecules/`)**: Unión de dos o más átomos para formar un elemento funcional repetible.
  - *Ejemplos*: Una tarjeta de parada (icono de transporte + hora + título de la localización), un botón de navegación inferior con su texto correspondiente.
- **Organismos (`/components/organisms/`)**: Componentes complejos formados por moléculas que gestionan una sección entera de la pantalla.
  - *Ejemplos*: La línea de tiempo interactiva (Timeline completo del viaje), la cabecera del viaje con la barra de progreso móvil.
- **Páginas (`/features/pages/` o `/screens/`)**: Las pantallas completas que representan la SPA del móvil y se conectan al enrutador de Angular.
  - *Ejemplos*: `ActiveTripScreen`, `TripDetailScreen`, `HistoryScreen`.

---

## 5. Código Limpio, Tipado y Restricciones
- **Prohibición del tipo `any`**: Todos los datos que provengan del JSON deben estar perfectamente tipados mediante `interfaces` de TypeScript (ej. `interface Trip`, `interface Stop`).
- **Nomenclatura Semántica**: Las propiedades del JSON y del código deben usar los términos técnicos del viaje en inglés de manera clara:
  - `trip_title`, `stop_sequence_order`, `arrival_time_estimated`, `transport_mode`.
- **Comportamiento Reactivo Limpio**: Para cambiar de parada o avanzar en el viaje, el componente de la pantalla invocará un método del servicio (ej. `tripService.nextStop()`), el cual actualizará la Signal. La interfaz se redibujará sola de manera instantánea.
- **Estilos Modulares**: Se utilizará CSS/SCSS nativo dentro de cada componente de Angular. Queda terminantemente prohibido meter estilos globales gigantescos que rompan la modularidad de los componentes móviles.