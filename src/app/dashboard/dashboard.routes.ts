import { Route } from '@angular/router';
import { MainComponent } from './main/main.component';


export const DASHBOARD_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainComponent
  }
];

