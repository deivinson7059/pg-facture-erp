import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TarjetaCardComponent } from '@shared/components/tarjeta-card/tarjeta-card.component';
import { Breadcrumbs, Submenu } from '@shared/components/tarjeta-card/tarjeta.metadata';

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

    public submenu: Submenu[] = [];
    public breadcrumbs: Breadcrumbs[] = [];
}
