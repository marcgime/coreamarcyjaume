import { Routes } from '@angular/router';
import { HomeScreenComponent } from './features/pages/home-screen.component';
import { AccommodationsScreenComponent } from './features/pages/accommodations-screen.component';
import { ItineraryScreenComponent } from './features/pages/itinerary-screen.component';
import { TransportsScreenComponent } from './features/pages/transports-screen.component';

export const routes: Routes = [
  { path: '', component: HomeScreenComponent },
  { path: 'alojamiento', component: AccommodationsScreenComponent },
  { path: 'ruta', component: ItineraryScreenComponent },
  { path: 'transporte', component: TransportsScreenComponent },
  { path: '**', redirectTo: '' }
];
