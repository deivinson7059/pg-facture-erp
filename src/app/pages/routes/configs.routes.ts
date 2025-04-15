import { Route } from '@angular/router';
import { RequiredScopesGuard } from '@core/guard';

import { CompanyComponent } from '@pages/components/configs/company/company.component';
import { ConfigsComponent } from '@pages/components/configs/configs.component';
import { CustomersComponent } from '@pages/components/configs/customers/customers.component';
import { MenuRolesComponent } from '@pages/components/configs/menu-roles/menu-roles.component';
import { MenuComponent } from '@pages/components/configs/menu/menu.component';
import { RolesComponent } from '@pages/components/configs/roles/roles.component';
import { ScopesRolesComponent } from '@pages/components/configs/scopes-roles/scopes-roles.component';
import { ScopesComponent } from '@pages/components/configs/scopes/scopes.component';
import { SeatsAccountingComponent } from '@pages/components/configs/seats/seats-accounting/seats-accounting.component';
import { SeatsPayrollComponent } from '@pages/components/configs/seats/seats-payroll/seats-payroll.component';
import { SucursalComponent } from '@pages/components/configs/sucursal/sucursal.component';
import { UsersCompanyComponent } from '@pages/components/configs/users-company/users-company.component';
import { UsersComponent } from '@pages/components/configs/users/users.component';

import { GInvoiceComponent } from '@pages/components/configs/general/g-invoice/g-invoice.component';
import { GLegalComponent } from '@pages/components/configs/general/g-legal/g-legal.component';
import { GPosComponent } from '@pages/components/configs/general/g-pos/g-pos.component';
import { GHealthComponent } from '@pages/components/configs/general/g-health/g-health.component';
import { GBarComponent } from '@pages/components/configs/general/g-bar/g-bar.component';
import { GLogosComponent } from '@pages/components/configs/general/g-logos/g-logos.component';
import { GPriceListComponent } from '@pages/components/configs/general/g-price-list/g-price-list.component';
import { GAdjustmentsComponent } from '@pages/components/configs/general/g-adjustments/g-adjustments.component';
import { GPrintFromatsComponent } from '@pages/components/configs/general/g-print-fromats/g-print-fromats.component';
import { GPayrollComponent } from '@pages/components/configs/general/g-payroll/g-payroll.component';



export const CONFIGS_ROUTE: Route[] = [
    {
        path: '',
        component: ConfigsComponent
    },
    {
        path: 'company',
        component: CompanyComponent
    },
    {
        path: 'sucursal',
        component: SucursalComponent
    },
    {
        path: 'menu',
        component: MenuComponent
    },
    {
        path: 'roles',
        component: RolesComponent
    },
    {
        path: 'menu-roles',
        component: MenuRolesComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'users-company',
        component: UsersCompanyComponent
    },
    {
        path: 'scopes',
        canActivate: [RequiredScopesGuard],
        data: { requiredScope: 'read:scopes' },
        component: ScopesComponent,
    },
    {
        path: 'scopes-roles',
        canActivate: [RequiredScopesGuard],
        data: { requiredScope: 'write:scopes' },
        component: ScopesRolesComponent
    },
    {
        path: 'customers',
        canActivate: [RequiredScopesGuard],
        data: { requiredScope: 'write:customers' },
        component: CustomersComponent
    },
    {
        path: 'general/legal',
        component: GLegalComponent
    },
    {
        path: 'general/invoice',
        component: GInvoiceComponent
    },
    {
        path: 'general/pos',
        component: GPosComponent
    },
    {
        path: 'general/payroll',
        component: GPayrollComponent
    },
    {
        path: 'general/print_fromats',
        component: GPrintFromatsComponent
    },
    {
        path: 'general/adjustments',
        component: GAdjustmentsComponent
    },
    {
        path: 'general/price_list',
        component: GPriceListComponent
    },
    {
        path: 'general/logos',
        component: GLogosComponent
    },
    {
        path: 'general/bar',
        component: GBarComponent
    },
    {
        path: 'general/health',
        component: GHealthComponent
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

