import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { UtilsAutocompleteComponent } from '@shared/components/utils-autocomplete/utils-autocomplete.component';

import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsTooltipDirective, FormControlValidationDirective, UtilsTypingListenerDirective } from '@core';
import { UtilsService, UtilsSpinnerService, UtilsToastrService } from '@core';
import { accountPUC, Customer, notesHeader, notesLine, Puc, PucData } from 'app/pages/interfaces';
import { NotesService } from '@pages/services';

import Big from 'big.js';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-notes-new',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UtilsAutocompleteComponent,
        BreadcrumbComponent,
        DecimalPipe,
        UtilsTooltipDirective,
        FormControlValidationDirective,
        UtilsTypingListenerDirective,
        //UtilsDropdownButtonComponent,
    ],
    templateUrl: './notes-new.component.html',
    styleUrl: './notes-new.component.scss'
})
export class NotesNewComponent implements OnInit, OnDestroy {
    readonly today = new Date().toISOString().split('T')[0];
    breadscrums = [
        {
            items: [
                {
                    path: '/admin/accounting',
                    name: 'Contabilidad'
                }],
            active: 'Nueva Nota Contable',
        },
    ];

    noteForm: FormGroup;

    pucSeleted: accountPUC[] = [];

    // Referencia al componente de autocomplete
    @ViewChild('pucAutocomplete') pucAutocomplete!: UtilsAutocompleteComponent<Puc>;

    // Datos para los autocomplete
    puc: Puc[] = [];

    // Estado de carga
    loadingPuc = false;

    // Elementos seleccionados
    selectedPuc: Puc | null = null;

    // Propiedades para el modal de terceros
    showUserModal: boolean = false;
    selectedAccountIndex: number | null = null;
    selectedAccountItem: accountPUC | null = null;
    selectedCustomer: Customer | null = null;

    currentCustomer: Customer | null = null;

    // ViewChild para acceder al componente de autocomplete de terceros
    @ViewChild('customerAutocomplete') customerAutocomplete!: UtilsAutocompleteComponent<Customer>;


    // Lista de terceros (ejemplo)
    customers: Customer[] = [
        { name: 'DANISOFT SAS', nit: '900982478', city: 'BARRANQUILLA', address: 'CALLE 22b 26 145', phone: '3005371181' },
        { name: 'LOPEZ PEDRO', nit: '4444444', city: 'BOGOTÁ', address: 'CALLE 123', phone: '3001234567' },
        { name: 'RODRIGUEZ MARÍA', nit: '5555555', city: 'MEDELLÍN', address: 'CARRERA 45', phone: '3109876543' },
        { name: 'PÉREZ JUAN', nit: '6666666', city: 'CALI', address: 'AVENIDA 8', phone: '3207654321' },
        { name: 'GÓMEZ CARLOS', nit: '7777777', city: 'BARRANQUILLA', address: 'DIAGONAL 10', phone: '3158765432' },
        { name: 'MARTÍNEZ ANA', nit: '8888888', city: 'BUCARAMANGA', address: 'TRANSVERSAL 15', phone: '3142345678' },
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notesService: NotesService,
        private fb: FormBuilder,
        private spinnerService: UtilsSpinnerService,
        private utilsService: UtilsService,
        private toastrService: UtilsToastrService,
    ) {



        this.noteForm = this.fb.group({
            pucAutocompleteId: [null],
            fechaContable: [this.today, [
                Validators.required,
            ]],
            cbOffice: [Validators.required],
            txtReference: [null, Validators.required],
            cbCentoCosto: ['-', Validators.required],
            txtComment: [null, [
                Validators.required,
                Validators.maxLength(500)
            ]]
        });

        this.route.queryParams.subscribe(params => {
            const noteId: number = +params['copy'];
            if (noteId) {
                this.loadNoteToCopy(noteId);
            }
        });
    }

    wareSelected: string = '';
    centroCosto: string = '--';
    txtReference: string = '';
    txtComment: string = '';

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

        // Cargar los datos iniciales
        this.wareSelected = 'Oficina Principal';
    }

    ngOnDestroy(): void { }

    /**
     * Método para manejar los cambios en el campo de fecha contable
     * @param event Evento de cambio
     * @param control Control del formulario
     * @returns Nada
     * 
     */
    onDebitChange(index: number, event: any): void {
        const value = event.target.value;

        // Si se ha ingresado un valor en el débito
        if (value && value > 0) {
            this.pucSeleted[index].debit = parseFloat(value);
            this.pucSeleted[index].credit = null;
        } else if (value === '' || value === '0') {
            this.pucSeleted[index].debit = null;
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
        } else if (value === '' || value === '0') {
            this.pucSeleted[index].credit = null;
        }

        this.updateDisabledState();
    }

    /**
     *  Actualizar el estado de habilitación/deshabilitación de los campos
     * @returns Nada
     **/
    updateDisabledState(): void {
        this.pucSeleted.forEach(item => {
            // Lógica para determinar si los campos deben estar habilitados o deshabilitados
            item.debitDisabled = item.credit !== null && item.credit > 0;
            item.creditDisabled = item.debit !== null && item.debit > 0;
        });
    }

    /**
     *  Método para calcular debitos totales
     * @returns number
     **/
    getTotalDebits(): number {
        return this.pucSeleted.reduce((sum, item) => {
            try {
                // Convertimos los valores a objetos Big
                const currentDebit = item.debit ? new Big(item.debit) : new Big(0);
                const currentSum = new Big(sum);

                // Realizamos la suma y devolvemos el resultado como número
                return currentSum.plus(currentDebit).toNumber();
            } catch (error) {
                console.error('Error al procesar valor:', item.debit, error);
                return sum; // En caso de error, devolvemos la suma actual
            }
        }, 0);
    }
    /**
     *  Método para calcular creditos totales
     * @returns number
     **/
    getTotalCredits(): number {
        return this.pucSeleted.reduce((sum, item) => {
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
    }


    /**
     * Método para buscar usuarios en tiempo real
     * @param term Término de búsqueda
     * @returns Nada
     * */
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

    /**
     * Método para manejar la selección de PUC
     * @param puc PUC seleccionado
     **/
    onPucSelected(puc: Puc | null) {
        this.selectedPuc = puc;

        if (!puc) return; // No hacer nada si no hay selección

        // Verificar si la cuenta ya existe en pucSeleted
        const cuentaExistente = this.pucSeleted.find(item => item.account === puc.code);

        if (cuentaExistente) {
            // Mostrar alerta de cuenta duplicada
            Swal.fire({
                title: 'Cuenta duplicada',
                html: `La cuenta <strong>${puc.code}</strong> - ${puc.description} ya ha sido agregada`,
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Entendido'
            });
            return; // No continuar con la adición
        }

        // Si la cuenta no existe, agregarla normalmente
        let account: accountPUC = {
            "account": puc.code,
            "account_name": puc.description,
            "debit": null,
            "debitDisabled": false,
            "credit": null,
            "creditDisabled": false,
            taxable_base: null,
            exempt_base: null
        };

        //this.pucSeleted.push(account);
        this.pucSeleted.unshift(account);

        //ponemos el focus en el input de debito
        setTimeout(() => {
            document.getElementById('debito')?.focus();
        }, 100);

        // Opcional: Mostrar mensaje de éxito
        /*   Swal.fire({
              title: 'Cuenta agregada',
              text: 'La cuenta ha sido agregada correctamente.',
              icon: 'success',
              timer: 1500,
              timerProgressBar: true,
              showConfirmButton: true
          }); */
    }

    /**
     * Elimina un elemento de la lista de cuentas seleccionadas
     * @param index Índice del elemento a eliminar
     * @param cuenta Información de la cuenta a eliminar
     */
    removeItem(index: number, cuenta: accountPUC): void {
        // Obtener información relevante para el mensaje
        const codigoCuenta = cuenta.account;
        const nombreCuenta = cuenta.account_name || 'seleccionada';

        // Mostrar diálogo de confirmación con SweetAlert2
        Swal.fire({
            title: '¿Está seguro?',
            html: `¿Desea eliminar la cuenta <strong>${codigoCuenta}</strong> - ${nombreCuenta}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar el elemento del array
                this.pucSeleted.splice(index, 1);

                // Mostrar mensaje de éxito
                Swal.fire({
                    title: 'Eliminado!',
                    text: 'La cuenta ha sido eliminada correctamente.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        });
    }

    /**
     * Abre el modal de selección de terceros
     */
    openUserModal(index: number, item: accountPUC): void {
        this.selectedAccountIndex = index;
        this.selectedAccountItem = item;
        this.selectedCustomer = null;
        this.showUserModal = true;

        // Esperar a que el DOM se actualice para establecer el foco
        setTimeout(() => {
            // Si no hay un cliente seleccionado, establecer el foco en el campo de búsqueda
            if (!this.selectedCustomer && this.customerAutocomplete) {
                // Enfocar el input de búsqueda
                this.customerAutocomplete.searchInput.nativeElement.focus();

                // Opcional: limpiar el campo de búsqueda si hay algún valor residual
                this.customerAutocomplete.searchTerm = '';
                this.customerAutocomplete.searchInput.nativeElement.value = '';
            }
        }, 100); // Pequeño retraso para asegurar que el modal esté completamente renderizado

        // Si ya tiene un tercero asociado, preseleccionarlo
        /*  if (item.customers) {
             this.selectedCustomer = item.customers;
             // Cuando el modal se muestre completamente, actualizar el valor en el autocomplete
             setTimeout(() => {
                 if (this.customerAutocomplete) {
                     this.customerAutocomplete.selectedValue = item.customers;
                 }
             }, 100);
         } */
    }

    /**
     * Cierra el modal de selección de terceros
     * @returns Nada
     */
    closeUserModal(): void {
        this.showUserModal = false;
        this.selectedAccountIndex = null;
        this.selectedAccountItem = null;
        this.selectedCustomer = null;
    }
    /**
    * Elimna la selección de terceros desde el boton de limpiar
    * @returns Nada
    */
    clearUserModal(): void {
        this.selectedCustomer = null;
        //this.currentCustomer = null;
    }
    /**
     * Método para crear un nuevo tercero
     * @returns Nada
     * */
    onCreateNewCustomer(): void { }

    /**
     * Maneja la selección de terceros desde el componente autocomplete
     */
    onCustomerSelected(customer: Customer | null): void {
        this.selectedCustomer = customer;
    }

    /**
    * Confirma la selección del tercero y lo aplica a la cuenta seleccionada
    * o a todas las cuentas según la elección del usuario
    */
    confirmCustomerSelection(): void {
        if (!this.selectedCustomer || this.selectedAccountIndex === null) return;

        this.currentCustomer = this.selectedCustomer;

        // Mostrar mensaje de éxito
        Swal.fire({
            title: 'Tercero asignado',
            html: `<strong>${this.selectedCustomer.name}</strong> ha sido asignado correctamente`,
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
        });

        // Cerrar el modal
        this.closeUserModal();
    }

    /**
     * Elimina el tercero asociado a una cuenta
     */
    removeCustomer(index: number): void {
        if (index < 0 || index >= this.pucSeleted.length) return;

        //const customerName = this.pucSeleted[index].customers?.name || 'Tercero';
        const customerName = "Tercero";

        Swal.fire({
            title: '¿Eliminar tercero?',
            html: `¿Está seguro de eliminar a <strong>${customerName}</strong> de esta cuenta?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar el tercero
                //this.pucSeleted[index].customers = null;              

                this.currentCustomer = null;

                // Mostrar confirmación
                Swal.fire({
                    title: 'Tercero eliminado',
                    text: 'El tercero ha sido eliminado correctamente',
                    icon: 'success',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        });
    }

    /**
     * Valida las cuentas PUC seleccionadas
     * @returns Un objeto con el resultado de la validación
     */
    validateAccounts(): { valid: boolean; message?: string; account?: accountPUC } {
        // Verificar si hay cuentas seleccionadas
        if (this.pucSeleted.length === 0) {
            return {
                valid: false,
                message: 'Debe agregar al menos una cuenta contable'
            };
        }

        // Verificar que cada cuenta tenga al menos un valor (débito o crédito)
        const cuentasSinValor = this.pucSeleted.filter(cuenta =>
            (cuenta.debit === null || cuenta.debit === 0) &&
            (cuenta.credit === null || cuenta.credit === 0)
        );

        if (cuentasSinValor.length > 0) {
            return {
                valid: false,
                message: `La cuenta tiene valores incompletos`,
                account: cuentasSinValor[0]
            };
        }

        // Verificar que los débitos y créditos estén balanceados
        const totalDebitos = this.getTotalDebits();
        const totalCreditos = this.getTotalCredits();

        console.log('Total Debitos:', totalDebitos);
        console.log('Total Creditos:', totalCreditos);

        if (totalDebitos !== totalCreditos) {
            return {
                valid: false,
                message: `Los débitos (<strong>$${totalDebitos.toFixed(2)}</strong>) y créditos (<strong>$${totalCreditos.toFixed(2)}</strong>) no coinciden. Diferencia: <strong>$${Math.abs(totalDebitos - totalCreditos).toFixed(2)}</strong>`
            };
        }

        // Todo bien
        return { valid: true };
    }

    // Función para obtener nombres amigables de los campos
    private obtenerNombreCampo(key: string): string {
        const nombresCampos: { [key: string]: string } = {
            'cbOffice': 'Oficina',
            'fechaContable': 'Fecha Contable',
            'cbCentoCosto': 'Centro de costo',
            'txtReference': 'Referencia',
            'txtComment': 'Observaciones',
        };

        return nombresCampos[key] || key;
    }

    /**
     * Método para manejar el envío del formulario
     * @returns Nada
     */
    onSubmit(): void {
        this.noteForm.markAllAsTouched();

        //validamos this.selectedCustomer este seleccionado
        if (!this.selectedCustomer === null) {
            Swal.fire({
                title: 'Tercero no seleccionado',
                html: 'Por favor seleccione un tercero para continuar',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return;
        }


        //0. Recopilar los nombres de los campos inválidos
        const camposInvalidos: string[] = [];
        Object.keys(this.noteForm.controls).forEach(key => {
            const control = this.noteForm.get(key);
            if (control?.invalid) {
                console.log(`Campo inválido: ${key}`, control.errors);
                camposInvalidos.push(this.obtenerNombreCampo(key));
            }
        });

        // 1. Validar el formulario principal
        if (this.noteForm.invalid) {
            // Crear mensaje con los campos inválidos
            const mensaje = camposInvalidos.length > 0
                ? `Por favor complete los siguientes campos: <strong>${camposInvalidos.join(', ')}<strong>`
                : 'Por favor complete todos los campos requeridos';

            Swal.fire({
                title: 'Formulario incompleto',
                html: mensaje,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        // 2. Validar las cuentas
        const validacionCuentas = this.validateAccounts();
        if (!validacionCuentas.valid) {
            let mensaje = validacionCuentas.message || 'Error en las cuentas';

            // Si hay una cuenta específica con error, mostrarla
            if (validacionCuentas.account) {
                mensaje = `La cuenta <strong>${validacionCuentas.account.account} - ${validacionCuentas.account.account_name}</strong> ${mensaje}`;
            }

            Swal.fire({
                title: 'Error en las cuentas',
                html: mensaje,
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        Swal.fire({
            title: '¿Desea guardar la nota contable?',
            text: 'No podrás deshacer este paso...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No, cancelar!',
            confirmButtonText: 'Sí, guardar'
        }).then((result: any) => {
            if (result.value) {
                const lineas: notesLine[] = this.pucSeleted.map(item => {
                    return {
                        account: item.account,
                        account_name: item.account_name,
                        debit: (item.debit !== null && item.debit > 0)
                            ? new Big(item.debit).toNumber()
                            : 0,
                        credit: (item.credit !== null && item.credit > 0)
                            ? new Big(item.credit).toNumber()
                            : 0,
                        taxable_base: (item.taxable_base !== null && item.taxable_base > 0)
                            ? new Big(item.taxable_base).toNumber()
                            : 0,
                        exempt_base: (item.exempt_base !== null && item.exempt_base > 0)
                            ? new Big(item.exempt_base).toNumber()
                            : 0,
                    };
                });

                const data: notesHeader = {
                    cmpy: '01',
                    ware: this.noteForm.value.cbOffice,
                    date: this.noteForm.value.fechaContable,
                    customer: this.selectedCustomer?.nit!,
                    customer_name: this.selectedCustomer?.name!,
                    reference: this.noteForm.value.txtReference,
                    cost_center: this.noteForm.value.cbCentoCosto,
                    creation_by: 'danisoft',
                    comments: this.noteForm.value.txtComment,
                    lines: lineas,
                }

                this.spinnerService.show();
                this.notesService
                    .createNote(data)
                    .subscribe(res => {
                        this.spinnerService.hide();
                        if (res.code === 200) {
                            this.toastrService.success(res.messages.success!, 'Exito');
                            this.router.navigate(['/accounting/note', res.data!.id]);

                        } else {
                            console.error('Error al guardar la nota:', res);
                            this.utilsService.errorAlert(
                                res.messages.error || 'Error al guardar la nota',
                                'Error ' + res.code,
                                'error'
                            );
                        }
                    },
                        (error) => {
                            console.error('Error al guardar la nota:', error);
                            this.spinnerService.hide();

                            this.utilsService.errorAlert(
                                'Error al guardar la nota',
                                'Error',
                                'error'
                            );
                        });
            }

        });
    }

    loadNoteToCopy(id: number): void {
        this.notesService.getNoteById('01', id).subscribe(res => {
            if (res.code === 200) {
                const note = res.data;
                console.log('Nota cargada:', note);

                // Aquí puedes llenar el formulario con los datos de la nota
                this.noteForm.patchValue({
                    fechaContable: this.today,
                    cbOffice: note?.ware,
                    txtReference: null,
                    cbCentoCosto: '--',
                    txtComment: null,
                });


                // Llenar las cuentas seleccionadas con conversión de tipos adecuada
                this.pucSeleted = (note?.lines || [])
                    .map(line => ({
                        account: line.account,
                        account_name: line.account_name,
                        debit: (line.debit !== null && line.debit > 0) ? new Big(line.debit) : null,
                        credit: (line.credit !== null && line.credit > 0) ? new Big(line.credit) : null,
                        debitDisabled: (line.debit !== null && line.debit > 0) ? false : true,
                        creditDisabled: (line.credit !== null && line.credit > 0) ? false : true,
                        taxable_base: line.taxable_base !== null
                            ? new Big(line.taxable_base)
                            : null,
                        exempt_base: line.exempt_base !== null
                            ? new Big(line.exempt_base)
                            : null
                    } as accountPUC));
            } else {
                console.error('Error al cargar la nota:', res);
            }
        });
    }

}
