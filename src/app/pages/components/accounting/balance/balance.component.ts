import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BalanceService } from './balance.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BalanceResponse, BalanceType, Period } from 'app/pages/interfaces';

@Component({
    selector: 'app-balance',
    imports: [CommonModule, FormsModule, BreadcrumbComponent],
    templateUrl: './balance.component.html',
    styleUrl: './balance.component.scss'
})
export class BalanceComponent implements OnInit {

    breadscrums = [
        {
            items: [{
                path: '/accounting',
                name: 'Contabilidad'
            }],
            active: 'Balance Contable',
        },
    ];

    cmpy: string = '01';
    ware: string = 'Oficina Principal';
    year: number = 2025;
    per: number = 1;
    type: string = 'G';
    userId: string = 'usuario1';

    loading: boolean = false;
    balanceResponse: BalanceResponse | null = null;
    balanceTypes: BalanceType[] = [];
    periods: Period[] = [];

    constructor(private balanceService: BalanceService) { }

    ngOnInit(): void {
        this.loadBalanceTypes();
        this.loadPeriods();
    }

    loadBalanceTypes(): void {
        this.balanceService.getBalanceTypes().subscribe({
            next: (response) => this.balanceTypes = response.data,
            error: (error) => console.error('Error al cargar tipos de balance:', error)
        });
    }

    loadPeriods(): void {
        this.balanceService.getPeriods(this.cmpy, this.year).subscribe({
            next: (response) => this.periods = response.data,
            error: (error) => console.error('Error al cargar períodos:', error)
        });
    }

    generateBalance(): void {
        this.loading = true;
        this.balanceService.generateBalance(
            this.cmpy,
            this.ware,
            this.year,
            this.per,
            this.type,
            this.userId
        ).subscribe({
            next: () => {
                this.loading = false;
                this.getBalance();
            },
            error: (error) => {
                console.error('Error al generar balance:', error);
                this.loading = false;
            }
        });
    }

    getBalance(): void {
        this.loading = true;
        this.balanceService.getBalance(
            this.cmpy,
            this.year,
            this.per,
            this.type
        ).subscribe({
            next: (response) => {
                this.balanceResponse = response.data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener balance:', error);
                this.loading = false;
            }
        });
    }

    getBalanceTypeName(): string {
        const type = this.balanceTypes.find(t => t.code === this.type);
        return type ? type.name : '';
    }

    // Función para formatear números
    formatNumber(value: number): string {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

}
