import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PgAutocompleteComponent } from '@shared/components/pg-autocomplete/pg-autocomplete.component';
import { accountPUC } from '../../interfaces/notas.interface';
import { NotesService } from '../notes.service';
import { Puc, PucData } from '../../interfaces/puc.interface';

@Component({
    selector: 'app-notes-new',
    imports: [
        PgAutocompleteComponent,
        BreadcrumbComponent,
        DecimalPipe,
    ],
    templateUrl: './notes-new.component.html',
    styleUrl: './notes-new.component.scss'
})
export class NotesNewComponent implements OnInit, OnDestroy {
    constructor(
        private notesService: NotesService,
    ) { }
   

    breadscrums = [
        {
            items: [
                {
                    path: '/accounting',
                    name: 'Contabilidad'
                }],
            active: 'Nueva Nota Contable',
        },
    ];
    accion: string = '';

    pucSeleted: accountPUC[] = [
        {
            "account": "11050505",
            "account_name": "Efectivo",
            "debit": null,
            "debitDisabled": true,
            "credit": 2000.00,
            "creditDisabled": false,
            "customers": null,
        },
        {
            "account": "51201005",
            "account_name": "Servicios Públicos",
            "debit": 1200.00,
            "debitDisabled": false,
            "credit": null,
            "creditDisabled": true,
            "customers": null,
        },
        {
            "account": "51201010",
            "account_name": "Servicios de Internet",
            "debit": 800.00,
            "debitDisabled": false,
            "credit": null,
            "creditDisabled": true,
            "customers": "ramon",
        }
    ];

    // Variables para controlar la visualización del valor actual
    isTyping: boolean = false;
    currentTypingValue: number = 0;
    typingTimeout: any = null;

    // Método para manejar los cambios en el débito
    onDebitChange(index: number, event: any): void {
        const value = event.target.value;

        // Si se ha ingresado un valor en el débito
        if (value && value > 0) {
            this.pucSeleted[index].debit = parseFloat(value);
            this.pucSeleted[index].credit = null;
            // Mostrar el valor que se está escribiendo
            this.isTyping = true;
            this.currentTypingValue = parseFloat(value);
            // Configurar el temporizador para ocultar después de 3 segundos
            this.resetTypingTimer();
        } else if (value === '' || value === '0') {
            this.pucSeleted[index].debit = null;
            // Ocultar el valor si está vacío
            this.isTyping = false;
            this.currentTypingValue = 0;
        }

        this.updateDisabledState();
    }

    // Método para manejar los cambios en el crédito
    onCreditChange(index: number, event: any): void {
        const value = event.target.value;

        // Si se ha ingresado un valor en el crédito
        if (value && value > 0) {
            this.pucSeleted[index].credit = parseFloat(value);
            this.pucSeleted[index].debit = null;
            // Mostrar el valor que se está escribiendo
            this.isTyping = true;
            this.currentTypingValue = parseFloat(value);
            // Configurar el temporizador para ocultar después de 3 segundos
            this.resetTypingTimer();
        } else if (value === '' || value === '0') {
            this.pucSeleted[index].credit = null;
            // Ocultar el valor si está vacío
            this.isTyping = false;
            this.currentTypingValue = 0;
        }

        this.updateDisabledState();
    }

    // Método para reiniciar el temporizador de typing
    resetTypingTimer(): void {
        // Cancelar cualquier temporizador existente
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        // Configurar un nuevo temporizador para ocultar el div después de 3 segundos
        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
        }, 2000);
    }

    // Actualizar el estado de habilitación/deshabilitación de los campos
    updateDisabledState(): void {
        this.pucSeleted.forEach(item => {
            // Lógica para determinar si los campos deben estar habilitados o deshabilitados
            item.debitDisabled = item.credit !== null && item.credit > 0;
            item.creditDisabled = item.debit !== null && item.debit > 0;
        });
    }

    // Método para calcular totales
    getTotalDebits(): number {
        return this.pucSeleted.reduce((sum, item) => {
            return sum + (item.debit || 0);
        }, 0);
    }

    getTotalCredits(): number {
        return this.pucSeleted.reduce((sum, item) => {
            return sum + (item.credit || 0);
        }, 0);
    }

    // Referencia al componente de autocomplete
    @ViewChild('pucAutocomplete') pucAutocomplete!: PgAutocompleteComponent<Puc>;

    // Datos para los autocomplete
    puc: Puc[] = [];

    // Estado de carga
    loadingPuc = false;

    // Elementos seleccionados
    selectedPuc: Puc | null = null;

    

    // Limpiar el temporizador al destruir el componente
    ngOnDestroy(): void {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
    }

    ngOnInit() {
        // Suscribirse a los observables de datos
        this.notesService.puc$.subscribe(puc => {
            this.puc = puc;
            if (this.pucAutocomplete) {
                this.pucAutocomplete.updateFilteredData(puc);
            }
        });

        // Suscribirse al estado de carga
        this.notesService.loadingPuc$.subscribe(loading => {
            this.loadingPuc = loading;
            if (this.pucAutocomplete) {
                this.pucAutocomplete.setLoading(loading);
            }
        });
    }

    // Método para buscar usuarios en tiempo real
    onSearchPuc(term: string) {
        let data: PucData = {
            account: term,
            cmpy: '01'
        }
        this.notesService.searchAccounts(data).subscribe(filteredPuc => {
            // La actualización del estado de carga se maneja a través de la suscripción
            if (this.pucAutocomplete) {
                this.pucAutocomplete.updateFilteredData(filteredPuc.data || []);
            }
        });
    }

    // Método para manejar la selección de PUC
    onPucSelected(puc: Puc | null) {
        this.selectedPuc = puc;
        console.log('Puc seleccionado:', puc || 'Ninguno');
    }


    // Método para manejar cuando el input pierde el foco
    onInputBlur() {
        console.log('Input perdió el foco, verificando valor...');
    }
}
