import { Injectable, signal } from '@angular/core';

export interface LocationCoords {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  // Coordenadas por defecto (Seúl, KR)
  private readonly defaultCoords: LocationCoords = { lat: 37.5665, lon: 126.9780 };
  
  // Signals para gestionar el estado de ubicación
  private currentCitySignal = signal<string>('Seúl');
  private countryCodeSignal = signal<string>('KR');
  private coordsSignal = signal<LocationCoords>(this.defaultCoords);
  private isGpsActiveSignal = signal<boolean>(false);

  readonly currentCity = this.currentCitySignal.asReadonly();
  readonly countryCode = this.countryCodeSignal.asReadonly();
  readonly coords = this.coordsSignal.asReadonly();
  readonly isGpsActive = this.isGpsActiveSignal.asReadonly();

  /**
   * Intenta actualizar la ubicación del usuario vía GPS del navegador.
   * Si falla, realiza un fallback automático a Seúl.
   */
  async updateLocation(): Promise<LocationCoords> {
    try {
      const location = await this.getCoordinatesFromBrowser();
      this.coordsSignal.set(location);
      this.isGpsActiveSignal.set(true);
      
      try {
        const result = await this.reverseGeocode(location.lat, location.lon);
        this.currentCitySignal.set(result.city);
        this.countryCodeSignal.set(result.countryCode);
      } catch (err) {
        console.warn('Error resolviendo nombre de ciudad, usando coordenadas como nombre. Detalle:', err);
        this.currentCitySignal.set(`Ubicación (${location.lat.toFixed(2)}, ${location.lon.toFixed(2)})`);
        this.countryCodeSignal.set('KR');
      }
      
      return location;
    } catch (error) {
      console.warn('Fallo en geolocalización, utilizando Seúl como fallback. Detalle:', error);
      this.coordsSignal.set(this.defaultCoords);
      this.currentCitySignal.set('Seúl');
      this.countryCodeSignal.set('KR');
      this.isGpsActiveSignal.set(false);
      return this.defaultCoords;
    }
  }

  /**
   * Envoltura con Promesas para navigator.geolocation.
   */
  private getCoordinatesFromBrowser(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Navigator geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }

  /**
   * Geocodificación inversa con la API pública de OpenStreetMap Nominatim.
   */
  private async reverseGeocode(lat: number, lon: number): Promise<{ city: string, countryCode: string }> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const response = await fetch(url, { headers: { 'Accept-Language': 'es' } });
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.municipality || data.address.county || data.address.state || 'Desconocido';
      const countryCode = data.address.country_code ? data.address.country_code.toUpperCase() : 'KR';
      return { city, countryCode };
    }
    throw new Error('Invalid Nominatim response format');
  }
}
