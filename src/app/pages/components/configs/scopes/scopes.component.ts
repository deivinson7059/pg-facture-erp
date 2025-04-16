import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TablesorterDirective, UtilsService, UtilsSpinnerService, UtilsToastrService, UtilsTooltipDirective } from '@core';
import { Scope } from '@pages/interfaces/scope.inerface';
import { ConfigsService } from '@pages/services/configs.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

import Swal from 'sweetalert2';

@Component({
    selector: 'app-scopes',
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbComponent, TablesorterDirective, UtilsTooltipDirective,],
    templateUrl: './scopes.component.html',
    styleUrl: './scopes.component.scss'
})
export class ScopesComponent implements OnInit {

    breadscrums = [
        {
            items: [
                {
                    path: '/admin/configs',
                    name: 'Configuraciones'
                }],
            active: 'Permisos',
        },
    ];

    constructor(
        private configsService: ConfigsService,
        private spinnerService: UtilsSpinnerService,
        private utilsService: UtilsService,
        private toastrService: UtilsToastrService,
    ) { }

    public scopes: Scope[] = [];
    public showScopeModal: boolean = false;
    public newScope: Scope = { id: '', description: '' };
    public submitted: boolean = false;


    ngOnInit(): void {
        this.findAllScopes();
    }

    findAllScopes() {
        this.spinnerService.show();
        this.configsService.findAllScopes()
            .subscribe(
                (res) => {
                    // console.log('Scopes:', res);
                    this.spinnerService.hide();
                    if (res.code == 200) {
                        this.scopes = res.data!;
                        // console.log('Scopes:', res);
                    } else {
                        this.scopes = [];
                    }
                },
                (error) => {
                    this.spinnerService.hide();
                    // console.error('Error:', err);
                    this.scopes = [];
                    //console.error('Objeto de error completo:', error);
                    if (error === 'Forbidden') {
                        this.toastrService.error('No tienes permisos para ver esta sección', 'Error 403');
                    } else {
                        this.toastrService.error('Error al cargar los permisos', 'Error');
                    }
                },
            );
    }

    removeScope(scope: Scope) {
        Swal.fire({
            title: '¿Está seguro que desea eliminar este permiso?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'No, cancelar!',
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinnerService.show();
                this.configsService.removeScope(scope.id)
                    .subscribe({
                        next: (res) => {
                            this.spinnerService.hide();
                            if (res.code == 200) {
                                Swal.fire({
                                    title: 'Éxito',
                                    text: 'Permiso eliminado correctamente',
                                    icon: 'success',
                                    timer: 1500
                                });
                                this.findAllScopes(); // Recargar la lista
                            } else {
                                Swal.fire({
                                    title: 'Error',
                                    text: 'Error al eliminar el permiso',
                                    icon: 'error'
                                });
                            }
                        },
                        error: (error) => {
                            this.spinnerService.hide();
                            if (error === 'Forbidden') {
                                Swal.fire({
                                    title: 'Error 403',
                                    text: 'No tienes permisos para eliminar este permiso',
                                    icon: 'error'
                                });
                            } else {
                                Swal.fire({
                                    title: 'Error',
                                    text: 'Error al eliminar el permiso',
                                    icon: 'error'
                                });
                            }
                        }
                    });
            }
        });
    }

    addScope() {
        this.resetForm();
        this.showScopeModal = true;
    }
    closeScopeModal() {
        this.showScopeModal = false;
        this.resetForm();
    }

    resetForm() {
        this.newScope = { id: '', description: '' };
        this.submitted = false;
    }

    saveScope() {
        this.submitted = true;

        // Validar que los campos requeridos estén completos
        if (!this.newScope.id || !this.newScope.description) {
            return;
        }

        this.spinnerService.show();
        this.configsService.addScope(this.newScope)
            .subscribe({
                next: (res) => {
                    this.spinnerService.hide();
                    if (res.code == 200) {
                        this.toastrService.success('Permiso creado correctamente', 'Éxito');
                        this.closeScopeModal();
                        this.findAllScopes(); // Recargar la lista
                    } else {
                        this.toastrService.error(res.messages.error || 'Error al crear el permiso', 'Error');
                    }
                },
                error: (error) => {
                    this.spinnerService.hide();
                    if (error === 'Forbidden') {
                        this.toastrService.error('No tienes permisos para crear permisos', 'Error 403');
                    } else if (error?.error?.message) {
                        this.toastrService.error(error.error.message, 'Error');
                    } else {
                        this.toastrService.error('Error al crear el permiso', 'Error');
                    }
                }
            });
    }
}
