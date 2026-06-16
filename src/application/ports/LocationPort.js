/**
 * Puerto de Salida para la Geolocalización.
 * Define la interfaz abstracta que la infraestructura debe implementar.
 */
export class LocationPort {
  /**
   * Obtiene las coordenadas geográficas actuales del usuario.
   * @returns {Promise<{lat: number, lon: number}>}
   */
  async getCurrentLocation() {
    throw new Error("Method LocationPort.getCurrentLocation() not implemented");
  }

  /**
   * Obtiene la ciudad y país a partir de coordenadas.
   * @param {number} lat
   * @param {number} lon
   * @returns {Promise<{city: string, country: string}>}
   */
  async getCityFromCoordinates(lat, lon) {
    throw new Error("Method LocationPort.getCityFromCoordinates() not implemented");
  }
}
