import { LocationPort } from "../../application/ports/LocationPort.js";

/**
 * Adaptador de Infraestructura para Geolocalización.
 * Implementa el puerto LocationPort usando la API nativa de geolocalización del navegador
 * y reverse geocoding a través de OpenStreetMap Nominatim.
 */
export class BrowserLocationAdapter extends LocationPort {
  /**
   * Obtiene las coordenadas geográficas actuales.
   * @returns {Promise<{lat: number, lon: number}>}
   */
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          let errorMsg = "Unknown geolocation error";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "User denied the request for Geolocation";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information is unavailable";
              break;
            case error.TIMEOUT:
              errorMsg = "The request to get user location timed out";
              break;
          }
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Geocodificación inversa a través del servicio gratuito de OpenStreetMap.
   * @param {number} lat
   * @param {number} lon
   * @returns {Promise<{city: string, country: string}>}
   */
  async getCityFromCoordinates(lat, lon) {
    // Nominatim requiere un User-Agent (identificador) o en frontend una llamada normal.
    // Usamos zoom=10 para obtener la ciudad/área en lugar de una calle específica.
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'es' // Intentar obtener el nombre de la ciudad en español
      }
    });
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.address) {
      throw new Error("Invalid response from reverse geocoding API");
    }

    const addr = data.address;
    // Nominatim puede poner la ciudad en distintos campos según el país o densidad de población
    const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || "Desconocido";
    const country = addr.country || "";

    return { city, country };
  }
}
