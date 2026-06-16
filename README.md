# Korea Voyage Hub - Neo-Seoul Travel

Esta es la pestaña de **Inicio** de **Korea Voyage Hub**, diseñada con estilo **Glassmorphism** y estructurada bajo una **Arquitectura Hexagonal (Puertos y Adaptadores)** para frontend, adaptando los requerimientos de diseño limpio descritos en `architecture-rules.md`.

## Arquitectura y Estructura del Código

Para mantener el desacoplamiento de la infraestructura (APIs, geolocalización del navegador, etc.) del núcleo lógico del negocio, la aplicación está estructurada en tres capas estrictas utilizando módulos de ES6:

```
CoreaAPP/
├── index.html                  # Punto de entrada y maquetación HTML5
├── src/
│   ├── main.js                 # Composición Root (inyección de dependencias)
│   ├── domain/                 # Entidades y lógica matemática pura (Dominio)
│   │   └── models/
│   │       ├── Activity.js
│   │       ├── Weather.js
│   │       └── ExchangeRate.js
│   ├── application/            # Casos de Uso y Puertos abstractos (Aplicación)
│   │   ├── ports/
│   │   │   ├── LocationPort.js
│   │   │   ├── WeatherPort.js
│   │   │   ├── ExchangeRatePort.js
│   │   │   └── ActivityRepositoryPort.js
│   │   └── use-cases/
│   │       └── GetDashboardData.js
│   ├── infrastructure/         # Conexión externa (Adapters)
│   │   └── adapters/
│   │       ├── BrowserLocationAdapter.js
│   │       ├── OpenMeteoWeatherAdapter.js
│   │       ├── ExchangeRateApiAdapter.js
│   │       └── StaticActivityRepository.js
│   └── ui/                     # Capa de Presentación (UI)
│       ├── css/
│       │   └── style.css       # Estilos Glassmorphism en CSS Vanilla puro
│       ├── app.js              # Controlador del DOM y eventos
│       └── popup-manager.js    # Controlador de modales táctiles (iOS-style)
```

### 1. Capa de Dominio (Domain)
Contiene las entidades puras del negocio y sus validaciones y transformaciones:
* **[Activity.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/domain/models/Activity.js)**: Define la estructura formal de una actividad del viaje.
* **[Weather.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/domain/models/Weather.js)**: Lógica de formato y representación meteorológica.
* **[ExchangeRate.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/domain/models/ExchangeRate.js)**: Lógica matemática pura para la conversión bidireccional entre EUR y KRW.

### 2. Capa de Aplicación (Application)
Define los contratos (**Puertos**) y coordina las operaciones del negocio (**Casos de Uso**):
* **[LocationPort.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/application/ports/LocationPort.js)**: Interfaz para resolver localización actual y geocodificación.
* **[WeatherPort.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/application/ports/WeatherPort.js)**: Interfaz para descargar clima.
* **[ExchangeRatePort.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/application/ports/ExchangeRatePort.js)**: Interfaz para la descarga de tipos de cambio.
* **[ActivityRepositoryPort.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/application/ports/ActivityRepositoryPort.js)**: Interfaz de persistencia de actividades.
* **[GetDashboardData.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/application/use-cases/GetDashboardData.js)**: Orquesta la carga del dashboard, aplicando fallbacks automáticos en caso de que la geolocalización o el clima fallen (ej. redirigiendo por defecto a Seúl).

### 3. Capa de Infraestructura (Infrastructure Adapters)
Implementaciones concretas de tecnología para interactuar con las APIs web del navegador y externas:
* **[BrowserLocationAdapter.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/infrastructure/adapters/BrowserLocationAdapter.js)**: Usa `navigator.geolocation` y geocodificación inversa gratuita con **OpenStreetMap Nominatim**.
* **[OpenMeteoWeatherAdapter.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/infrastructure/adapters/OpenMeteoWeatherAdapter.js)**: Consulta el clima real usando la API libre de **Open-Meteo**.
* **[ExchangeRateApiAdapter.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/infrastructure/adapters/ExchangeRateApiAdapter.js)**: Descarga tasas de cambio en tiempo real y gestiona una caché de 4 horas en `localStorage` con fallback seguro de 1480 KRW/EUR offline.
* **[StaticActivityRepository.js](file:///c:/Users/MarcGim%C3%A9nezLiarte/Documents/Marc/APPS/CoreaAPP/src/infrastructure/adapters/StaticActivityRepository.js)**: Provee datos estructurados simulando la carga de un itinerario en JSON.

### 4. Capa de UI y Entrada
* **[style.css](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/ui/css/style.css)**: Estilos en CSS Vanilla utilizando propiedades dinámicas. Implementa bordes internos claros de 1px a media opacidad, efectos `backdrop-filter: blur()`, tintado de sombras del color de la marca (Indigo) y animaciones de brillo/shimmer.
* **[popup-manager.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/ui/popup-manager.js)**: Control de modales y soporte nativo de gestos táctiles (deslizar hacia abajo el modal para cerrar, estilo iOS 18).
* **[app.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/ui/app.js)**: Lógica del DOM, actualización dinámica del Hero, listados de actividades e interactividad de la calculadora EUR/KRW en tiempo real.
* **[main.js](file:///c:/Users/MarcGiménezLiarte/Documents/Marc/APPS/CoreaAPP/src/main.js)**: Punto de arranque y registro de la inyección de dependencias.

---

## Funcionalidades del Inicio

1. **Ubicación GPS Dinámica**: Si el usuario otorga permisos, detecta su ciudad actual, carga el clima en tiempo real de esa ciudad en la esquina del Hero y coloca una foto representativa de fondo (con un fallback de búsqueda en Unsplash). Además, añade un marcador vibrante de **"Ubicación actual"**. Si se rechaza el permiso, se inicia por defecto en **Seúl** mostrando la icónica vista de N Seoul Tower.
2. **Acciones Bento Grid**:
   * **Translate**: Redirige directamente al traductor de Google preconfigurado en Español -> Coreano.
   * **Calculadora de Divisas**: Pop-up táctil interactivo que descarga el tipo de cambio oficial de internet de EUR/KRW en tiempo real al abrirse y permite realizar conversiones bidireccionales automáticas mientras escribes.
   * **Emergencias**: Muestra los teléfonos principales de auxilio coreanos (112 Policía, 119 Bomberos, 1339 Médicas y 1330 Asistencia al Turista en Español). Permite pulsar para llamar en dispositivos móviles (`tel:`).
3. **Próximas Actividades**: Carga de forma no estática en HTML, simulando lo que devolvería el programa completo del viaje.
4. **Diseño Premium**: Totalmente optimizado y con márgenes de seguridad para pantallas de teléfonos móviles de alta densidad (iPhone 16 Pro Max).

---

## Cómo Ejecutar en Local

Al no requerir compilación ni dependencias externas (vanilla JS con Módulos ES6), puedes levantar un servidor HTTP estático local en la carpeta raíz del proyecto para evitar bloqueos de CORS originados por protocolos `file://`:

### Con Python (Recomendado)
```bash
python -m http.server 8000
```
Abre en tu navegador: `http://localhost:8000`

### Con Node.js (Live Server)
```bash
npx live-server
```
o
```bash
npm install -g http-server
http-server -p 8080
```
Abre en tu navegador: `http://localhost:8080`
