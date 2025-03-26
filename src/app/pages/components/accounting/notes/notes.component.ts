import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TablesorterDirective } from '@core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-notes',
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbComponent, TablesorterDirective],
    templateUrl: './notes.component.html',
    styleUrl: './notes.component.scss'
})
export class NotesComponent {
    breadscrums = [
        {
            items: [
                {
                    path: '/accounting/notes',
                    name: 'Contabilidad'
                }],
            active: 'Notas Contables',
        },
    ];

    stickyEnabled: boolean = true;

    tableData = [
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A42b',
            nombre: 'Pedro',
            apellido: 'Parker',
            edad: 28,
            total: '$9.99',
            descuento: '20,9%',
            diferencia: '+12.1',
            fecha: '6 de julio de 2006, 8:14 a. m.'
        },
        {
            cuenta: 'A255',
            nombre: 'Bruce',
            apellido: 'Jones',
            edad: 33,
            total: '$13.19',
            descuento: '25%',
            diferencia: '+12',
            fecha: '10 de diciembre de 2002, 5:14 a. m.'
        },
        {
            cuenta: 'A33',
            nombre: 'Clark',
            apellido: 'Evans',
            edad: 18,
            total: '$15.89',
            descuento: '44%',
            diferencia: '-26',
            fecha: '12 de enero de 2003, 11:14 a. m.'
        },
        {
            cuenta: 'A1',
            nombre: 'Bruce',
            apellido: 'Todopoderoso',
            edad: 45,
            total: '$153.19',
            descuento: '44,7%',
            diferencia: '+77',
            fecha: '18 de enero de 2001, 9:12 a. m.'
        },
        {
            cuenta: 'A102',
            nombre: 'Bruce',
            apellido: 'Evans',
            edad: 22,
            total: '$13.19',
            descuento: '11%',
            diferencia: '-100.9',
            fecha: '18 de enero de 2007, 9:12 a. m.'
        },
        {
            cuenta: 'A42a',
            nombre: 'Bruce',
            apellido: 'Evans',
            edad: 22,
            total: '$13.19',
            descuento: '11%',
            diferencia: '0',
            fecha: '18 de enero de 2007, 9:12 a. m.'
        }
    ];
}
