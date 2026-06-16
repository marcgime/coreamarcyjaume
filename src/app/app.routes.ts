import { Routes } from '@angular/router';
import { HomeScreenComponent } from './features/pages/home-screen.component';
import { AccommodationsScreenComponent } from './features/pages/accommodations-screen.component';

export const routes: Routes = [
  { path: '', component: HomeScreenComponent },
  { path: 'alojamiento', component: AccommodationsScreenComponent },
  { path: '**', redirectTo: '' }
];

