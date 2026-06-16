# Reglas Arquitectónicas y Guardarraíles - Vueling Ops Simulator (Equipo 2)

Este documento contiene las reglas de diseño innegociables para el desarrollo del simulador operativo. El agente de IA DEBE validar cada línea de código generada contra estas restricciones antes de dar una tarea por finalizada.

---

## 1. Restricciones de Stack y Entorno
- **Tecnología**: Desarrollado exclusivamente en Python 3.11+ puro.
- **Frameworks**: Queda terminantemente prohibido el uso de frameworks pesados (como Django o FastAPI) que añadan sobrecarga innecesaria para un proceso CLI que se ejecuta a demanda o por lotes.
- **Librerías Permitidas**: Solo se autorizan librerías nativas del lenguaje o las especificadas en los requerimientos (`requests`, `google-cloud-firestore` y `pytest`).

---

## 2. Arquitectura Hexagonal (Puertos y Adaptadores)
Todo el código debe aislarse por completo de los mecanismos de infraestructura, almacenamiento y agentes externos (APIs, Firestore). Se exige la separación estricta en tres capas:

- **Dominio (Core)**: `src/domain/models.py` y `src/domain/services.py`. Contiene las entidades puras de datos (vuelos, pasajeros) y la lógica matemática pura de los algoritmos estocásticos (distribuciones normales y uniformes). Esta capa NO tiene dependencias externas ni importaciones de Firebase o Requests.
- **Aplicación (Casos de Uso / Puertos)**: `src/application/ports.py` y `src/application/use_cases.py`. Define las interfaces abstractas (Puertos de entrada/salida) y coordina el flujo de la simulación.
- **Infraestructura (Adaptadores)**: `src/infrastructure/adapters/`. Contiene la implementación técnica de los puertos (el cliente HTTP para Flightradar24 y el cliente SDK de Firestore).

---

## 3. Principios de Diseño Obligatorios (SOLID, Demeter, Clean Code)

### Principios SOLID
- **S - Responsabilidad Única (SRP)**: Cada clase o función debe tener una única razón para cambiar. 
  - Ejemplo: El algoritmo matemático que calcula la distribución normal de pasajeros (`services.py`) NO debe saber cómo se realiza una petición HTTP ni cómo se formatea un documento para Firestore. Su única responsabilidad es procesar variables estocásticas.
  - Ejemplo: Los adaptadores de infraestructura se encargan exclusivamente de la comunicación externa, nunca de las reglas físicas o probabilísticas de Vueling.
- **O - Abierto / Cerrado (OCP)**: El sistema debe estar abierto a la extensión pero cerrado a la modificación.
  - Ejemplo: La lógica de generación de equipaje debe diseñarse de forma que, si en el futuro Vueling introduce una nueva categoría de peso o cambia la constante oficial de la EASA (de 84 kg a otra), se pueda añadir un nuevo modelo de cálculo o configuración sin alterar el caso de uso principal (`RunSimulationUseCase`).
- **L - Sustitución de Liskov (LSP)**: Las subclases o implementaciones deben poder sustituir a sus clases base sin romper el sistema.
  - Ejemplo: Si definimos un puerto genérico de ingesta de datos (`FlightIngestPort`), cualquier implementación (ya sea el adaptador real de la API de Flightradar24 o un adaptador de pruebas `MockFlightIngestAdapter`) debe poder intercambiarse en el inicializador de `main.py` sin que el caso de uso falle o requiera cambios de código internos.
- **I - Segregación de Interfaces (ISP)**: Es mejor tener muchas interfaces cliente específicas que una sola interfaz de propósito general.
  - Ejemplo: Las clases abstractas que definen los Puertos en `ports.py` deben ser atómicas y segregadas. No crees una interfaz única llamada `ExternalServicesPort`. Separa estrictamente `FlightIngestPort` (lectura) de `FlightRepositoryPort` (escritura). El simulador no debe verse obligado a depender de métodos de persistencia si solo necesita consultar una API.
- **D - Inversión de Dependencias (DIP)**: Los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones.
  - Ejemplo: El caso de uso (`use_cases.py`) NUNCA debe importar ni instanciar las clases concretas `FirestoreAdapter` o `FlightradarAdapter`. El caso de uso solo conoce y tipa contra las interfaces abstractas (Puertos). La instanciación real y el acoplamiento físico de los adaptadores se realiza exclusivamente en el punto de entrada global del script (`main.py`).

### Ley de Demeter (Principio de Menor Conocimiento)
El simulador gestiona estructuras de datos complejas provenientes de APIs externas y contratos de aviación. Para evitar el acoplamiento directo entre estructuras internas, la IA debe seguir estas reglas:
- **Prohibición de Encadenamiento en Cascada**: Un objeto solo debe interactuar con sus colaboradores inmediatos. Queda terminantemente prohibido encadenar llamadas de acceso que expongan la jerarquía interna de los modelos o diccionarios.
  - *Incorrecto*: `avion_tipo = flight_json['data']['operational']['aircraft']['type']`
  - *Correcto*: Implementar un mapeador o método en el adaptador que encapsule la extracción: `avion_tipo = adapter.extract_aircraft_type(flight_json)`
- **Comportamiento sobre Datos**: No le pidas datos a un objeto para luego tomar una decisión que le corresponde a él; pídele al objeto que actúe.
  - *Incorrecto*: `if pax_payload.pax_count > aircraft.max_seats:` (Rompe Demeter al extraer las propiedades de ambos para operar fuera).
  - *Correcto*: `if aircraft.exceeds_seating_capacity(pax_payload.pax_count):`

### Código Limpio (Clean Code) Aplicado
El código generado debe ser autoexplicativo, legible y mantenible bajo presión de tiempo.
- **Nomenclatura Semántica de Aviación y Operaciones**: Está prohibido el uso de abreviaturas ambiguas o variables de una sola letra (ej. `p`, `m`, `v`, `f`). Las variables deben reflejar estrictamente el glosario técnico del reto:
  - `passenger_load_factor` o `plf_percentage` (en lugar de `factor` o `p_load`).
  - `payload_baggage_kg` (en lugar de `maletas` o `bag_weight`).
  - `cargo_weight_kg` (en lugar de `carga`).
  - `flight_distance_km` (en lugar de `dist`).
- **Funciones de Propósito Único y Cortas**: Las funciones de cálculo estocástico o parseo deben centrarse en una sola tarea y no superar por norma general las 15-20 líneas de código. Si una función requiere lógica de extracción y a la vez lógica de cálculo matemático, debe dividirse en dos.
- **Manejo Explícito y Tipado de Excepciones**: Quedan prohibidos los bloques `try/except` genéricos que silencien errores (`except Exception: pass`). 
  - Si la API de Flightradar24 falla o devuelve un JSON corrupto, se debe lanzar y capturar una excepción específica (`FlightIngestError`).
  - Si faltan datos obligatorios para calcular los pesos de la EASA, se debe interrumpir el flujo limpiamente mediante un error controlado (`MissingTelemetryError`) y registrar el incidente antes de intentar cualquier escritura en Firestore.
- **Tipado Estricto (Type Hints)**: Todas las definiciones de funciones y métodos deben in

---

## 4. Reglas de Interacción con Firestore (Innegociables)
El simulador comparte de manera concurrente la colección única `flights` con el resto de soluciones del proyecto. Se deben aplicar de manera estricta las siguientes directrices de persistencia:

- **Aislamiento Absoluto**: Está prohibido importar `google-cloud-firestore` en las capas de Dominio o Aplicación. Las llamadas de lectura y escritura se restringen exclusivamente al archivo `firestore_adapter.py`.
- **Regla de Oro (Escritura Atómica)**: Toda acción de escritura o actualización en Firestore mediante `.set()` DEBE incluir obligatoriamente el parámetro de fusión de datos: `merge=True`. Queda estrictamente prohibido sobrescribir el documento completo, ya que destruiría en tiempo real las variables financieras calculadas simultáneamente por el Equipo 3.
- **Resiliencia ante Datos Nulos**: Los adaptadores de infraestructura deben implementar controles de nulidad y valores por defecto (*fallbacks*) seguros para evitar excepciones de tipo `KeyError` si se leen documentos compartidos.

---

## 5. Prácticas de Testing y Calidad de Código
- **Política de Error Cero**: El agente de IA no considerará una tarea completada si se reportan *warnings* del linter o errores de sintaxis en Python.
