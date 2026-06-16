/**
 * Puerto de Salida para el Clima.
 * Define la interfaz abstracta que la infraestructura debe implementar.
 */
export class WeatherPort {
  /**
   * Obtiene la meteorología actual dada una ubicación geográfica.
   * @param {number} lat - Latitud
   * @param {number} lon - Longitud
   * @param {string} cityName - Nombre de la ciudad para asignar al modelo
   * @param {boolean} [isCurrentLocation=false] - Si es la geolocalizada real
   * @returns {Promise<import("../../domain/models/Weather.js").Weather>}
   */
  async getWeather(lat, lon, cityName, isCurrentLocation = false) {
    throw new Error("Method WeatherPort.getWeather() not implemented");
  }
}
