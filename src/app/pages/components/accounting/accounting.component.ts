import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TarjetaCardComponent } from '@shared/components/tarjeta-card/tarjeta-card.component';
import { CardMenu } from '@shared/components/tarjeta-card/tarjeta.metadata';

@Component({
    selector: 'app-accounting',
    imports: [BreadcrumbComponent, TarjetaCardComponent],
    templateUrl: './accounting.component.html',
    styleUrl: './accounting.component.scss'
})
export class AccountingComponent {
    breadscrums = [
        {
            items: [],
            active: 'Contabilidad',
        },
    ];

    public cardMenu: CardMenu[] = [
        {
            title: 'Notas Contables',
            subtitle: 'Notas Contables',
            link: '/admin/accounting/notes',
            icon: 'assets/images/icons/notas.svg'
        },
        {
            title: 'Puc',
            subtitle: 'Plan Único de Cuentas',
            link: '/admin/accounting/puc',
            icon: 'assets/images/icons/puc.svg'
        },
        {
            title: 'Gastos Parametrizados',
            subtitle: 'Gastos Parametrizados',
            link: '/admin/accounting/expenses',
            icon: 'assets/images/icons/expenses-config.svg'
        }
    ];
}
