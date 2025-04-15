import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard, RequiredScopesGuard } from '@core/guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';
import { MainComponent } from '@pages/components/dashboard/main/main.component';
import { AccessDeniedComponent } from './authentication/access-denied/access-denied.component';

export const APP_ROUTE: Route[] = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: '/authentication/signin',
                pathMatch: 'full'
            },
            {
                path: 'access-denied',
                component: AccessDeniedComponent
            },
            {
                path: 'admin',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: 'dashboard',
                        component: MainComponent,
                    },
                    {
                        path: 'configs',
                        canActivate: [RequiredScopesGuard],
                        data: { requiredScope: 'read:settings' },
                        loadChildren: () =>
                            import('@pages/routes/configs.routes').then((m) => m.CONFIGS_ROUTE),
                    },
                    {
                        path: 'accounting',
                        canActivate: [RequiredScopesGuard],
                        data: { requiredScope: 'read:accounting' },
                        loadChildren: () =>
                            import('@pages/routes/accounting.routes').then((m) => m.ACCOUNTING_ROUTE),
                    },
                ],
            },

            {
                path: 'user',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: 'dashboard',
                        component: MainComponent,
                    },

                ],
            }

        ],
    },
    {
        path: 'authentication',
        component: AuthLayoutComponent,
        loadChildren: () =>
            import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
    },
    { path: '**', component: Page404Component },
];
