import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../models/trip.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private http = inject(HttpClient);
  
  // Angular Signal para gestionar el estado reactivo del viaje actual
  private activeTripSignal = signal<Trip | null>(null);
  
  // Exposición de lectura pública de la Signal
  readonly activeTrip = this.activeTripSignal.asReadonly();

  /**
   * Carga el viaje activo desde el archivo JSON local.
   */
  async loadActiveTrip(): Promise<Trip> {
    if (this.activeTripSignal()) {
      return this.activeTripSignal()!;
    }
    
    try {
      const data = await firstValueFrom(
        this.http.get<Trip>('assets/data/active-trip.json')
      );
      this.activeTripSignal.set(data);
      return data;
    } catch (error) {
      console.error('Error al cargar active-trip.json:', error);
      throw error;
    }
  }
}
