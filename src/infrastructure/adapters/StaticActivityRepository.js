import { ActivityRepositoryPort } from "../../application/ports/ActivityRepositoryPort.js";
import { Activity } from "../../domain/models/Activity.js";

/**
 * Adaptador de Infraestructura para las Actividades del Viaje.
 * Implementa el puerto ActivityRepositoryPort cargando actividades de un almacén estático,
 * simulando la carga de datos de un fichero JSON de itinerario o API.
 */
export class StaticActivityRepository extends ActivityRepositoryPort {
  constructor() {
    super();
    // Simula una base de datos o fichero de configuración de viaje
    this._activitiesData = [
      {
        id: "act_1",
        title: "Myeongdong Street Food",
        time: "Hoy • 18:00 - 22:00",
        category: "K-FOOD",
        image: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=600&auto=format&fit=crop",
        imageAlt: "Puestos vibrantes de comida callejera en el mercado de Myeongdong por la noche con luces de neón",
        description: "Explora la cuna de la comida callejera en Seúl. Degusta brochetas de pastel de arroz picante (tteokbokki), torrijas dulces coreanas (hotteok) y brochetas de pollo glaseado."
      },
      {
        id: "act_2",
        title: "DDP Light Show",
        time: "Mañana • 20:30",
        category: "ARTS",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop",
        imageAlt: "Dongdaemun Design Plaza con curvas arquitectónicas futuristas iluminada de noche",
        description: "Espectáculo de luces tridimensionales proyectado sobre la fachada futurista de la Dongdaemun Design Plaza (DDP), combinando arte moderno, música y arquitectura orgánica."
      }
    ];
  }

  /**
   * Recupera las actividades planificadas.
   * @returns {Promise<Array<Activity>>}
   */
  async getUpcomingActivities() {
    // Simular retraso de red de 200ms
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this._activitiesData.map(item => new Activity(item));
  }
}
