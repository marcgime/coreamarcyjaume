import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface OpenMeteoResponse {
  current_weather?: {
    temperature: number;
    weathercode: number;
  };
}

export interface WeatherState {
  temp: number;
  condition: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);

  // Signals para gestionar el estado meteorológico
  private tempSignal = signal<number>(24);
  private conditionSignal = signal<string>('Despejado');
  private iconSignal = signal<string>('wb_sunny');

  readonly temp = this.tempSignal.asReadonly();
  readonly condition = this.conditionSignal.asReadonly();
  readonly icon = this.iconSignal.asReadonly();

  /**
   * Obtiene el clima para coordenadas dadas.
   * Si falla, recurre a valores por defecto (24°C Despejado).
   */
  async fetchWeather(lat: number, lon: number): Promise<WeatherState> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    
    try {
      const response = await firstValueFrom(this.http.get<OpenMeteoResponse>(url));
      
      if (response && response.current_weather) {
        const current = response.current_weather;
        const tempVal = Math.round(current.temperature);
        const code = current.weathercode;
        
        const mapped = this.mapWmoCode(code);
        
        this.tempSignal.set(tempVal);
        this.conditionSignal.set(mapped.condition);
        this.iconSignal.set(mapped.icon);
        
        return { temp: tempVal, condition: mapped.condition, icon: mapped.icon };
      }
      throw new Error('Invalid Open-Meteo response structure');
    } catch (error) {
      console.warn('Fallo al obtener clima de Open-Meteo, usando fallback. Detalle:', error);
      // Fallback estático
      this.tempSignal.set(24);
      this.conditionSignal.set('Despejado');
      this.iconSignal.set('wb_sunny');
      return { temp: 24, condition: 'Despejado', icon: 'wb_sunny' };
    }
  }

  /**
   * Mapea códigos WMO de Open-Meteo a descripciones e iconos de Material Symbols.
   */
  private mapWmoCode(code: number): { condition: string, icon: string } {
    if (code === 0) {
      return { condition: 'Despejado', icon: 'wb_sunny' };
    } else if (code === 1 || code === 2 || code === 3) {
      return { condition: 'Nublado', icon: 'cloud' };
    } else if (code === 45 || code === 48) {
      return { condition: 'Niebla', icon: 'foggy' };
    } else if (code === 51 || code === 53 || code === 55) {
      return { condition: 'Llovizna', icon: 'rainy_light' };
    } else if (code === 61 || code === 63 || code === 65) {
      return { condition: 'Lluvia', icon: 'rainy' };
    } else if (code === 66 || code === 67) {
      return { condition: 'Lluvia helada', icon: 'ac_unit' };
    } else if (code === 71 || code === 73 || code === 75) {
      return { condition: 'Nieve', icon: 'ac_unit' };
    } else if (code === 77) {
      return { condition: 'Granizo', icon: 'ac_unit' };
    } else if (code === 80 || code === 81 || code === 82) {
      return { condition: 'Chubascos', icon: 'rainy' };
    } else if (code === 85 || code === 86) {
      return { condition: 'Chubascos de nieve', icon: 'ac_unit' };
    } else if (code === 95 || code === 96 || code === 99) {
      return { condition: 'Tormenta', icon: 'thunderstorm' };
    }
    return { condition: 'Despejado', icon: 'wb_sunny' }; // Fallback
  }
}
