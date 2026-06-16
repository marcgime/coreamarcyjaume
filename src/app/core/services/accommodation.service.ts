import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Accommodation } from '../models/accommodation.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private http = inject(HttpClient);
  
  private accommodationsSignal = signal<Accommodation[]>([]);
  readonly accommodations = this.accommodationsSignal.asReadonly();

  /**
   * Carga la lista de alojamientos desde el archivo JSON local.
   */
  async loadAccommodations(): Promise<Accommodation[]> {
    if (this.accommodationsSignal().length > 0) {
      return this.accommodationsSignal();
    }
    
    try {
      const data = await firstValueFrom(
        this.http.get<Accommodation[]>('assets/data/accommodations.json')
      );
      this.accommodationsSignal.set(data);
      return data;
    } catch (error) {
      console.error('Error al cargar accommodations.json:', error);
      throw error;
    }
  }
}
