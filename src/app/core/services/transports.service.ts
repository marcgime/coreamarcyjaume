import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TransportPassenger {
  name: string;
  ticket?: string;
  seats?: string[];
}

export interface FlightSegment {
  departure: {
    city: string;
    code: string;
    terminal?: string;
    date: string;
    time: string;
  };
  arrival: {
    city: string;
    code: string;
    terminal?: string;
    date: string;
    time: string;
  };
  flight: string;
  class: string;
  baggage: string;
  duration: string;
}

export interface Transport {
  id: string;
  type: 'flight_international' | 'flight_domestic' | 'train' | 'car_rental';
  category: string;
  company: string;
  logo: string;
  pnr: string;
  passengers?: TransportPassenger[];
  segments?: FlightSegment[];
  vehicle?: string;
  cdw?: string;
  totalAmount?: string;
  pickup?: {
    location: string;
    address?: string;
    date: string;
    time: string;
  };
  dropoff?: {
    location: string;
    address?: string;
    date: string;
    time: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TransportsService {
  private http = inject(HttpClient);

  private transportsSignal = signal<Transport[]>([]);
  readonly transports = this.transportsSignal.asReadonly();

  async loadTransports(): Promise<Transport[]> {
    if (this.transportsSignal().length > 0) {
      return this.transportsSignal();
    }

    try {
      const data = await firstValueFrom(
        this.http.get<Transport[]>('assets/data/transports.json')
      );
      this.transportsSignal.set(data);
      return data;
    } catch (error) {
      console.error('Error al cargar transports.json:', error);
      throw error;
    }
  }
}
