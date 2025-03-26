import { Route } from '@angular/router';
import { MainComponent } from '../components/dashboard/main/main.component';


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

