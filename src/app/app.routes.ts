import { Routes } from '@angular/router';
import { HomeScreenComponent } from './features/pages/home-screen.component';

export const routes: Routes = [
  { path: '', component: HomeScreenComponent },
  { path: '**', redirectTo: '' }
];
