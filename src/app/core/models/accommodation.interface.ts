export interface Accommodation {
  id: string;
  name: string;
  city: string;
  address: string;
  dates: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
  price: number;
  image: string;
  bookingUrl: string;
  mapsUrl: string;
}
