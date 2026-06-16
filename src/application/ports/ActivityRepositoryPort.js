/**
 * Puerto de Salida para el acceso a las actividades del viaje.
 * Define la interfaz abstracta que la infraestructura de persistencia o mock debe implementar.
 */
export class ActivityRepositoryPort {
  /**
   * Obtiene la lista de actividades planificadas del viaje.
   * @returns {Promise<Array<import("../../domain/models/Activity.js").Activity>>}
   */
  async getUpcomingActivities() {
    throw new Error("Method ActivityRepositoryPort.getUpcomingActivities() not implemented");
  }
}
