import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TablesorterDirective, UtilsService, UtilsSpinnerService, UtilsToastrService, UtilsTooltipDirective } from '@core';
import { Scope } from '@pages/interfaces/scope.inerface';
import { ConfigsService } from '@pages/services/configs.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-scopes',
    imports: [FormsModule, RouterModule, BreadcrumbComponent, TablesorterDirective, UtilsTooltipDirective],
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

    removeScope(scope: Scope) { }

    addScope() {
        //abrea madal para crear un nuevo registro
    }
}
