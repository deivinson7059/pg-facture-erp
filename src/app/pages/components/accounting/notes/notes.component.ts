import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TablesorterDirective, UtilsService, UtilsSpinnerService, UtilsToastrService, UtilsTooltipDirective } from '@core';
import { Note, NoteGetParams } from '@pages/interfaces/notas.interface';
import { NotesService } from '@pages/services';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-notes',
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbComponent, TablesorterDirective, UtilsTooltipDirective],
    templateUrl: './notes.component.html',
    styleUrl: './notes.component.scss',
    animations: [
        trigger('expandCollapse', [
            state('collapsed', style({
                height: '0',
                overflow: 'hidden',
                opacity: 0,
                margin: '0'
            })),
            state('expanded', style({
                height: '*',
                overflow: 'hidden',
                opacity: 1
            })),
            transition('collapsed <=> expanded', [
                animate('0.3s ease-in-out')
            ])
        ])
    ]
})
export class NotesComponent implements OnInit {

    breadscrums = [
        {
            items: [
                {
                    path: '/accounting',
                    name: 'Contabilidad'
                }],
            active: 'Notas Contables',
        },
    ];

    constructor(
        private notesService: NotesService,
        private spinnerService: UtilsSpinnerService,
        private utilsService: UtilsService,
        private toastrService: UtilsToastrService,
    ) { }

    tableData: Note[] = [];
    expandedRows: Set<number> = new Set();

    stickyEnabled: boolean = true;

    ngOnInit(): void {
        this.loadNotes();
    }

    loadNotes(): void {
        this.spinnerService.show();
        const data: NoteGetParams = {
            cmpy: '01',
            date_ini: '2024-04-01',
            date_end: '2025-04-30',
            page: 1,
        }

        this.notesService.listsNotes(data).subscribe(
            (res) => {
                this.spinnerService.hide();
                if (res.code == 200) {
                    console.log('Notas contables cargadas:', res.data);
                    this.tableData = res.data!.items || [];
                } else {
                    this.toastrService.error(res.messages.error);
                }
            },
            (error) => {
                this.spinnerService.hide();
                console.error('Error al cargar las notas contables:', error);
                this.toastrService.error('Error al cargar las notas contables');
            }
        );
    }

    // Método para alternar la visibilidad de los movimientos
    toggleMovimientos(rowId: number): void {
        if (this.expandedRows.has(rowId)) {
            this.expandedRows.delete(rowId);
        } else {
            this.expandedRows.add(rowId);
        }
    }

    // Método para verificar si una fila está expandida
    isExpandedRow(rowId: number): boolean {
        return this.expandedRows.has(rowId);
    }


}
