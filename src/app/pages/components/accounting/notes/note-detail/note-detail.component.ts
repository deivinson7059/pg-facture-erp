import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FechaCortaPipe, TablesorterDirective, UtilsSpinnerService, UtilsToastrService } from '@core';
import { approveNoteRequest, Note } from '@pages/interfaces/notas.interface';
import { NotesService } from '@pages/services';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { UtilsSeatComponent } from '@shared/components/utils-seat/utils-seat.component';

import Swal from 'sweetalert2';
@Component({
    selector: 'app-note-detail',
    imports: [RouterModule, BreadcrumbComponent, UtilsSeatComponent, FechaCortaPipe, CurrencyPipe, UpperCasePipe, TablesorterDirective],
    templateUrl: './note-detail.component.html',
    styleUrl: './note-detail.component.scss'
})
export class NoteDetailComponent implements OnInit {
    breadscrums = [
        {
            items: [
                {
                    path: '/accounting',
                    name: 'Contabilidad'
                }
            ],
            active: 'Nota Contable #',
        },
    ];
    cmpy: string = '01';
    noteId: number = 0;
    noteData: Note | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notesService: NotesService,
        private spinnerService: UtilsSpinnerService,
        private toastrService: UtilsToastrService
    ) { }

    ngOnInit(): void {
        // Obtener el ID de la nota desde la URL
        this.route.params.subscribe(params => {
            const noteId_ = params['noteId'];
            if (!noteId_ || isNaN(Number(noteId_)) || Number(noteId_) <= 0) {
                this.handleInvalidId();
                return;
            }

            this.noteId = +noteId_;

            // Actualizar el título en el breadcrumb
            this.breadscrums[0].active = `Nota Contable #${this.noteId}`;

            // Cargar los datos de la nota (implementarás esta parte)
            this.loadNoteDetails();
        });
    }

    private handleInvalidId(): void {
        this.toastrService.error('El ID de la nota no es válido', 'Error');
        this.router.navigate(['/accounting/notes']);
    }

    loadNoteDetails(): void {
        this.spinnerService.show();
        this.notesService
            .getNoteById(this.cmpy, this.noteId)
            .subscribe(
                (res) => {
                    this.spinnerService.hide();

                    if (res.code === 200 && res.data) {
                        this.noteData = res.data;
                        console.log('Nota cargada:', this.noteData);
                    } else {
                        this.toastrService.error('La nota contable no existe', 'Error');
                        // Opcional: redireccionar después de un tiempo
                        setTimeout(() => {
                            this.router.navigate(['/accounting/notes']);
                        }, 3000);
                    }
                },
                (error) => {
                    this.spinnerService.hide();
                    console.error('Error al cargar la nota:', error);
                    this.toastrService.error('Error al cargar la nota', 'Error');
                }
            );
    }

    approveNote(): void {

        //preguntamos si desea aprobar la nota #x usando Swal
        Swal.fire({
            title: '¿Está seguro?',
            text: `¿Desea aprobar la nota contable #${this.noteId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinnerService.show();

                const data: approveNoteRequest = {
                    approved_by: "supervisor1",
                    comments: "El usuario supervisor1 aprobó la nota contable"
                }
                this.notesService.approveNote(data, this.cmpy, this.noteId).subscribe(
                    (res) => {
                        console.log('Respuesta de la aprobación:', res);
                        this.spinnerService.hide();
                        if (res.code === 200) {
                            this.toastrService.success(res.messages.success, 'Éxito');
                            this.loadNoteDetails(); // Recargar los detalles de la nota
                        } else {
                            this.toastrService.error(res.messages.error, 'Error');
                        }
                    },
                    (error) => {
                        this.spinnerService.hide();
                        console.error('Error al aprobar la nota:', error);
                        this.toastrService.error('Error al aprobar la nota', 'Error');
                    }
                );
            }
        });

    }

}
