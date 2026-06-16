export interface Stop {
  id: string;
  title: string;
  time_str: string;
  category: string;
  image: string;
  image_alt: string;
  description: string;
  stop_sequence_order: number;
  arrival_time_estimated: string;
  transport_mode: 'walk' | 'subway' | 'train' | 'bus' | 'plane';
}

export interface Trip {
  trip_title: string;
  stops: Stop[];
}
