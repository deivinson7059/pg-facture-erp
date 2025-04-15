import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-seats-payroll',
    imports: [BreadcrumbComponent],
    templateUrl: './seats-payroll.component.html',
    styleUrl: './seats-payroll.component.scss'
})
export class SeatsPayrollComponent {
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
                }
            ],
            active: 'Parametrización nomina'
        },
    ];

    DEFAULT_PAYROLL_VALUES = [
        {
            concept: 'Salarios',
            db_account: '510506',
            db_description: 'SUELDOS',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Auxilio de Transporte',
            db_account: '510527',
            db_description: 'AUXILIO DE TRANSPORTE',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Horas Extras',
            db_account: '510515',
            db_description: 'HORAS EXTRAS Y RECARGOS',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Comisiones',
            db_account: '510518',
            db_description: 'COMISIONES',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Auxilios Salariales',
            db_account: '510545',
            db_description: 'AUXILIOS',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Bonificaciones',
            db_account: '510585',
            db_description: 'BONIFICACIONES',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Bonificacion no salariales',
            db_account: '510586',
            db_description: 'BONIFICACIONES NO SALARIALES',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Auxilios No Salariales',
            db_account: '510587',
            db_description: 'AUXILIOS NO SALARIALES',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Incapacidades Pagadas',
            db_account: '510524',
            db_description: 'INCAPACIDADES',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Licencias Pagadas',
            db_account: '510524',
            db_description: 'INCAPACIDADES',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Indemnizaciones Pagadas',
            db_account: '510560',
            db_description: 'INDEMNIZACIONES LABORALES',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Cuenta por pagar de salarios',
            db_account: '250510',
            db_description: 'SALARIOS POR PAGAR',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        },
        {
            concept: 'Retentions',
            db_account: '23650501',
            db_description: 'SALARIOS Y PAGOS LABORALES',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        },
        {
            concept: 'Anticipos',
            db_account: '133015',
            db_description: 'A TRABAJADORES',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        },
        {
            concept: 'Otras Dedecciones',
            db_account: '251099',
            db_description: 'OTRAS DEDUCCIONES DE NOMINA',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        },
        {
            concept: 'Pension a cargo de la empresa',
            db_account: '510570',
            db_description: 'APORTES A FONDOS DE PENSIONES Y /O CESANTIAS',
            cr_account: '238030',
            cr_description: 'FONDOS DE CESANTIAS Y/O PENSIONES',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Pension por pagar',
            db_account: '238030',
            db_description: 'FONDOS DE CESANTIAS Y/O PENSIONES',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'Fondo_de Solidaridad Pensional',
            db_account: '238030',
            db_description: 'FONDOS DE CESANTIAS Y/O PENSIONES',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'Salud a cargo de la empresa',
            db_account: '510569',
            db_description: 'APORTE A ENTIDADES PROMOTORAS DE SALUD EPS',
            cr_account: '237005',
            cr_description: 'APORTES A ENTIDADES PROMOTORAS DE SALUD E.P.S.',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Salud por pagar',
            db_account: '237005',
            db_description: 'APORTES A ENTIDADES PROMOTORAS DE SALUD E.P.S.',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'Admin. Riesgos Laborales',
            db_account: '510568',
            db_description: 'APORTES A ADMINISTRADORAS DE RIESGOS PROFESIONALES',
            cr_account: '237006',
            cr_description: 'APORTES A ADMINISTRADORAS DE RIESGOS PROFESIONALES A.R.',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Admin. Riesgos Laborale por pagar',
            db_account: '237006',
            db_description: 'APORTES A ADMINISTRADORAS DE RIESGOS PROFESIONALES A.R.',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'Caja de compensacion Familiar',
            db_account: '510572',
            db_description: 'APORTES CAJAS DE COMPENSACION FAMILIAR',
            cr_account: '23701003',
            cr_description: 'APORTES CAJA DE COMPENSACION',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Caja de compensacion Familiar por pagar',
            db_account: '23701003',
            db_description: 'APORTES CAJA DE COMPENSACION',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'SENA',
            db_account: '510578',
            db_description: 'SENA',
            cr_account: '23701002',
            cr_description: 'APORTES SENA',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'SENA por pagar',
            db_account: '23701002',
            db_description: 'APORTES SENA',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'ICBF',
            db_account: '510575',
            db_description: 'APORTES A ICBF',
            cr_account: '23701001',
            cr_description: 'APORTES AL ICBF',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'ICBF por pagar',
            db_account: '23701001',
            db_description: 'APORTES AL ICBF',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'Prima Salarial',
            db_account: '510536',
            db_description: 'PRIMA DE SERVICIOS',
            cr_account: '252005',
            cr_description: 'PRIMA DE SERVICIOS',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Provisión Prima Salarial',
            db_account: '252005',
            db_description: 'PRIMA DE SERVICIOS',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        },
        {
            concept: 'Pago de Prima Provisionada',
            db_account: '252005',
            db_description: 'PRIMA DE SERVICIOS',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Vacaciones',
            db_account: '510539',
            db_description: 'VACACIONES',
            cr_account: '252505',
            cr_description: 'VACACIONES CONSOLIDADAS',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Provisión Vacaciones',
            db_account: '252505',
            db_description: 'VACACIONES CONSOLIDADAS',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        },
        {
            concept: 'Pago de Vacaciones Provisionada',
            db_account: '252505',
            db_description: 'VACACIONES CONSOLIDADAS',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Cesantias',
            db_account: '510530',
            db_description: 'CESANTIAS',
            cr_account: '251005',
            cr_description: 'CESANTIAS',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Provisión Cesantias',
            db_account: '251005',
            db_description: 'CESANTIAS',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'Pago de Cesantias Provisionada',
            db_account: '251005',
            db_description: 'CESANTIAS',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'Intereses Cesantias',
            db_account: '510533',
            db_description: 'INTERESES SOBRE CESANTIAS',
            cr_account: '251505',
            cr_description: 'INTERESES SOBRE CESANTIA',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Provisión Intereses Cesantias',
            db_account: '251505',
            db_description: 'INTERESES SOBRE CESANTIA',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'Pago de Intereses Ces. Provisionada',
            db_account: '251505',
            db_description: 'INTERESES SOBRE CESANTIA',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'EPS/Fondo'
        },
        {
            concept: 'Prima No Salarial',
            db_account: '510542',
            db_description: 'PRIMAS EXTRALEGALES',
            cr_account: '253005',
            cr_description: 'PRIMAS',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Provisión Prima No Salarial',
            db_account: '253005',
            db_description: 'PRIMAS',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        },
        {
            concept: 'Pago de Prima No Salarial Provisionada',
            db_account: '253005',
            db_description: 'PRIMAS',
            cr_account: '250510',
            cr_description: 'SALARIOS POR PAGAR',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Vacaciones Extralegal',
            db_account: '510542',
            db_description: 'PRIMAS EXTRALEGALES',
            cr_account: '253095',
            cr_description: 'OTRAS',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Provisión Vacaciones Extralegal',
            db_account: '253095',
            db_description: 'OTRAS',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        },
        {
            concept: 'Cesantias Extralegal',
            db_account: '510542',
            db_description: 'PRIMAS EXTRALEGALES',
            cr_account: '253095',
            cr_description: 'OTRAS',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Provisión Cesantias Extralegal',
            db_account: '253095',
            db_description: 'OTRAS',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        },
        {
            concept: 'Intereses Cesantias Extralegal',
            db_account: '510542',
            db_description: 'PRIMAS EXTRALEGALES',
            cr_account: '253095',
            cr_description: 'OTRAS',
            type: 'DB',
            third_type: 'Empleado'
        },
        {
            concept: 'Provisión Intereses Cesantias Extralegal',
            db_account: '253095',
            db_description: 'OTRAS',
            cr_account: null,
            cr_description: null,
            type: 'CR',
            third_type: 'Empleado'
        }
    ];
}
