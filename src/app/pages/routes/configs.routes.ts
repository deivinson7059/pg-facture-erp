import { Route } from '@angular/router';
import { ConfigsComponent } from '@pages/components/configs/configs.component';
import { SeatsAccountingComponent } from '@pages/components/configs/seats/seats-accounting/seats-accounting.component';
import { SeatsPayrollComponent } from '@pages/components/configs/seats/seats-payroll/seats-payroll.component';

export const CONFIGS_ROUTE: Route[] = [
    {
        path: '',
        component: ConfigsComponent
    },
    {
        path: 'seats/accounting',
        component: SeatsAccountingComponent
    },
    {
        path: 'seats/payroll',
        component: SeatsPayrollComponent
    },


];

