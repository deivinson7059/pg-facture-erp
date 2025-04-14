import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, UtilsAutofocusDirective, UtilsService, UtilsSpinnerService, UtilsToastrService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Company, UserData, Warehouse } from '@core/models/auth.model';
import { catchError, finalize, of, tap } from 'rxjs';
@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [
        trigger('formAnimation', [
            state('hidden', style({
                opacity: 0,
                transform: 'translateX(-100%)'
            })),
            state('visible', style({
                opacity: 1,
                transform: 'translateX(0)'
            })),
            transition('hidden => visible', [
                animate('0.5s ease-in-out')
            ]),
            transition('visible => hidden', [
                animate('0.5s ease-in-out')
            ])
        ])
    ],
    imports: [
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        NgClass,
        NgIf,
        MatButtonModule,
        UtilsAutofocusDirective
    ]
})
export class SigninComponent
    extends UnsubscribeOnDestroyAdapter
    implements OnInit {

    credentialsForm!: UntypedFormGroup;
    companyForm!: UntypedFormGroup;

    submittedStep1 = false;
    submittedStep2 = false;

    error = '';
    isLoading = false;
    step = 1;

    // Datos del usuario después del primer paso
    userData: UserData | null = null;
    companies: Company[] = [];
    warehouses: Warehouse[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private authService: AuthService,
        private spinnerService: UtilsSpinnerService,
        private utilsService: UtilsService,
        private toastrService: UtilsToastrService,
    ) {
        super();
        // Redireccionar si ya está logueado
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/dashboard/main']);
        }

    }
    ngOnInit() {
        // Formulario del primer paso: credenciales
        this.credentialsForm = this.formBuilder.group({
            identification_number: ['', [Validators.required]],
            password: ['', Validators.required],
            remember: [false]
        });

        // Formulario del segundo paso: selección de compañía y bodega
        this.companyForm = this.formBuilder.group({
            cmpy: ['', Validators.required],
            ware: ['', Validators.required]
        });
    }

    // Getters para acceder facilmente a los form controls
    get f1(): { [key: string]: AbstractControl } {
        return this.credentialsForm.controls;
    }

    get f2(): { [key: string]: AbstractControl } {
        return this.companyForm.controls;
    }

    // Mostrar errores correctamente (pueden ser multilinea)
    formatError(error: string): string[] {
        if (!error) return [];
        return error.split('\n');
    }

    // Primer paso: enviar credenciales
    onSubmitCredentials() {
        this.submittedStep1 = true;
        this.error = '';

        if (this.credentialsForm.invalid) {
            return;
        }

        this.isLoading = true;

        // Obtener credenciales del formulario
        const identification_number = this.f1['identification_number'].value;
        const password = this.f1['password'].value;

        this.spinnerService.show();

        // Llamar al primer paso de autenticación
        this.subs.sink = this.authService
            .loginStep1(identification_number, password)
            .pipe(
                tap(res => {
                    if (res.success) {
                        // Obtener datos guardados temporalmente en el servicio
                        const tempData = this.authService.getTempLoginData();
                        this.userData = tempData.userData!;
                        this.companies = tempData.companies || [];

                        // Avanzar al paso 2
                        this.moveToStep2();
                    }
                }),
                catchError(errorMsg => {
                    this.toastrService.error(errorMsg || 'Error en la autenticación', 'Error');
                    //this.error = errorMsg || 'Error en la autenticación';
                    return of(null);
                }),
                finalize(() => {
                    this.spinnerService.hide();
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    // Segundo paso: seleccionar compañía y bodega
    onSubmitCompany() {
        this.submittedStep2 = true;
        this.error = '';

        if (this.companyForm.invalid) {
            return;
        }

        this.isLoading = true;
        this.spinnerService.show();

        // Obtener selecciones del formulario
        const cmpy = this.f2['cmpy'].value;
        const ware = this.f2['ware'].value;

        // Completar autenticación con el segundo paso
        this.subs.sink = this.authService.loginStep2(cmpy, ware)
            .pipe(
                tap(user => {
                    this.toastrService.success('Bienvenido!, ' + user.name, 'Éxito');
                    // Redireccionar al dashboard
                    this.router.navigate(['/dashboard/main']);

                }),
                catchError(errorMsg => {
                    this.toastrService.error(errorMsg || 'Error en la autenticación', 'Error');
                    this.error = errorMsg || 'Error en la autenticación';
                    return of(null);
                }),
                finalize(() => {
                    this.isLoading = false;
                    this.spinnerService.hide();
                })
            )
            .subscribe();
    }

    // Cambiar al paso 2
    moveToStep2() {
        setTimeout(() => {
            this.step = 2;
            this.submittedStep1 = false;
        }, 300);
    }

    // Volver al paso 1
    backToStep1() {
        this.step = 1;
        this.submittedStep2 = false;
        this.error = '';

        // Limpiar el segundo formulario
        this.companyForm.reset();
        this.warehouses = [];
    }

    // Actualizar lista de bodegas al cambiar compañía
    onCompanyChange(event: Event) {
        const companyId = (event.target as HTMLSelectElement).value;
        if (!companyId) {
            this.warehouses = [];
            this.f2['ware'].setValue('');
            return;
        }

        const selectedCompany = this.companies.find(c => c.cmpy === companyId);
        if (selectedCompany) {
            this.warehouses = selectedCompany.wares;
            this.f2['ware'].setValue('');
        }
    }

    // Obtener iniciales del nombre del usuario
    getInitials(): string {
        if (!this.userData?.name) return '';
        return this.userData.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }
}
