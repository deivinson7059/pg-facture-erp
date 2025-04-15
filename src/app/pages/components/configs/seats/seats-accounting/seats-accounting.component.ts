import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

export interface AccountConfig {
    cmpy: string;
    account_number: string;
    level: number;
    description: string;
    modules: string;
    type: string;
}

@Component({
    selector: 'app-seats-accounting',
    imports: [BreadcrumbComponent, ReactiveFormsModule, FormsModule],
    templateUrl: './seats-accounting.component.html',
    styleUrl: './seats-accounting.component.scss'
})
export class SeatsAccountingComponent {
    breadscrums = [
        {
            items: [
                {
                    path: '/admin/configs',
                    name: 'Configs'
                },
                {
                    path: '/admin/configs',
                    name: 'Contabilidad',
                    disabled: true
                }],
            active: 'Parametrización cuentas',
        },
    ];

    accounts: AccountConfig[] = [
        {
            "cmpy": "01",
            "account_number": "41352805",
            "level": 1,
            "description": "Cuenta Ingresos Gravados al 19% (CR)",
            "modules": "Facturas de venta, POS",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "41352815",
            "level": 2,
            "description": "Cuenta Ingresos Gravados al 5% (CR)",
            "modules": "Facturas de venta, POS",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "41352810",
            "level": 3,
            "description": "Cuenta Ingresos No Gravados (CR)",
            "modules": "Facturas de venta, POS",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "613528",
            "level": 4,
            "description": "Cuenta costos de venta (DB)",
            "modules": "Facturas de venta, POS",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "14350105",
            "level": 5,
            "description": "Mercancias no fabricadas vendidas - en operaciones gravadas. (CR)",
            "modules": "Facturas de venta, POS, Remisión",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "14350110",
            "level": 6,
            "description": "Mercancias no fabricadas vendidas- en operaciones no gravadas. (CR)",
            "modules": "Facturas de venta, POS, Remisión",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "14300105",
            "level": 7,
            "description": "Mercancias fabricadas vendidas - en operaciones gravadas. (CR)",
            "modules": "Facturas de venta, POS, Remisión",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "14300110",
            "level": 8,
            "description": "Mercancias fabricadas vendidas - en operaciones no gravadas. (CR)",
            "modules": "Facturas de venta, POS, Remisión",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "143005",
            "level": 9,
            "description": "Mercancias fabricadas - transformadas desde materia prima. (DB)",
            "modules": "Transformación de inventarios",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "146510",
            "level": 10,
            "description": "Mercancias en traslado entre bodegas - salida. (DB)",
            "modules": "Traslados de inventarios",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "14350205",
            "level": 11,
            "description": "Mercancias no fabricadas compradas - en operaciones gravadas. (DB)",
            "modules": "Factura de proveedor",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "14350210",
            "level": 12,
            "description": "Mercancias no fabricadas compradas- en operaciones no gravadas. (DB)",
            "modules": "Factura de proveedor",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "14350215",
            "level": 13,
            "description": "Mercancias no fabricadas compradas- en importaciones. (DB)",
            "modules": "Liquidación Importaciones",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "140502",
            "level": 14,
            "description": "Materia prima transformada a Mercancias fabricadas. (CR)",
            "modules": "Transformación de inventarios",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "140501",
            "level": 15,
            "description": "Materias primas compradas. (DB)",
            "modules": "Factura de proveedor",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "147001",
            "level": 16,
            "description": "Mercancias remisionadas - salida. (CR)",
            "modules": "Remisiones",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "147002",
            "level": 17,
            "description": "Mercancias remisionadas - convertido a factura. (DB)",
            "modules": "Remisiones",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "14650505",
            "level": 18,
            "description": "Inventario en transito de importación (DB/CR)",
            "modules": "Importaciones",
            "type": "DB/CR"
        },
        {
            "cmpy": "01",
            "account_number": "14650506",
            "level": 19,
            "description": "Ajsutes de inventarios",
            "modules": "Ajuste de inventarios",
            "type": "DB/CR"
        },
        {
            "cmpy": "01",
            "account_number": "14650507",
            "level": 20,
            "description": "Debito en factura cerrada sin pago",
            "modules": "Facturación",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "14650508",
            "level": 21,
            "description": "Credito en descuento sobre factura de proveedor",
            "modules": "Facturas Proveedor",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "14650509",
            "level": 22,
            "description": "Cuenta por cobrar en remisiones (cartera) (DB)",
            "modules": "Remisiones",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "14650510",
            "level": 23,
            "description": "Inventarios en remisiones (CR)",
            "modules": "Remisiones",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "14650511",
            "level": 24,
            "description": "Ingreso en remisiones (CR)",
            "modules": "Remisiones",
            "type": "CR"
        },
        {
            "cmpy": "01",
            "account_number": "14650512",
            "level": 25,
            "description": "Descuento Financiero en factura de venta (DB)",
            "modules": "Facturación",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "14650513",
            "level": 26,
            "description": "IVA en devoluciones al 5% (DB)",
            "modules": "Facturación",
            "type": "DB"
        },
        {
            "cmpy": "01",
            "account_number": "14650514",
            "level": 27,
            "description": "IVA en devoluciones al 19% (DB)",
            "modules": "Facturación",
            "type": "DB"
        }
    ]


}
