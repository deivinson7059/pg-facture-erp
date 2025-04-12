import { UpperCasePipe } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TablesorterDirective } from '@core/directive';
import { NoteSeat } from '@pages/interfaces/notas.interface';
import Big from 'big.js';

@Component({
    selector: 'utils-seat',
    imports: [RouterModule, FormsModule, TablesorterDirective, UpperCasePipe],
    templateUrl: './utils-seat.component.html',
    styleUrl: './utils-seat.component.scss'
})
export class UtilsSeatComponent {
    @Input() seats: NoteSeat[] = [];
    @Input() filter: boolean = false;

    isAccountingSectionVisible = false;
    isDatePickerVisible = false;
    selectedDate: string = '';

    // Detectar teclas Ctrl+M o Cmd+M
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // Verificar si es Ctrl+M (en Windows/Linux) o Cmd+M (en Mac)
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm') {
            event.preventDefault(); // Prevenir comportamiento predeterminado del navegador
            this.toggleAccountingSection();
        }
    }

    toggleAccountingSection() {
        this.isAccountingSectionVisible = !this.isAccountingSectionVisible;
        if (!this.isAccountingSectionVisible) {
            // Si se oculta la sección, también ocultar el selector de fecha
            this.isDatePickerVisible = false;
        }
    }

    toggleDatePicker() {
        this.isDatePickerVisible = !this.isDatePickerVisible;
    }

    editSeat(seat: NoteSeat) {
        console.log('Editando asiento:', seat);
        // Aquí implementar lógica para editar el asiento
    }

    openModifySeat() {
        console.log('Abrir modal para modificar asiento');
        // Aquí implementar lógica para abrir modal de modificación
    }

    applyDateChange() {
        console.log('Aplicando cambio de fecha:', this.selectedDate);
        if (this.selectedDate) {
            // Aquí implementar lógica para cambiar la fecha contable
            this.toggleDatePicker();
        }
    }

    calculateTotalDebit(): string {
        const total = this.seats.reduce((sum, item) => {
            try {
                // Convertimos los valores a objetos Big
                const currentCredit = item.debit ? new Big(item.debit) : new Big(0);
                const currentSum = new Big(sum);

                // Realizamos la suma y devolvemos el resultado como número
                return currentSum.plus(currentCredit).toNumber();
            } catch (error) {
                console.error('Error al procesar valor:', item.debit, error);
                return sum; // En caso de error, devolvemos la suma actual
            }
        }, 0);
        return this.formatCurrency(total.toString());
    }

    calculateTotalCredit(): string {
        const total = this.seats.reduce((sum, item) => {
            try {
                // Convertimos los valores a objetos Big
                const currentCredit = item.credit ? new Big(item.credit) : new Big(0);
                const currentSum = new Big(sum);

                // Realizamos la suma y devolvemos el resultado como número
                return currentSum.plus(currentCredit).toNumber();
            } catch (error) {
                console.error('Error al procesar valor:', item.credit, error);
                return sum; // En caso de error, devolvemos la suma actual
            }
        }, 0);
        return this.formatCurrency(total.toString());


    }

    formatCurrency(value: string): string {
        if (!value) return '$0';
        const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
        return '$' + numValue.toLocaleString('es-CO');
    }
}
