import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-note-detail',
    imports: [BreadcrumbComponent],
    templateUrl: './note-detail.component.html',
    styleUrl: './note-detail.component.scss'
})
export class NoteDetailComponent {
    breadscrums = [
        {
            items: [
                {
                    path: '/accounting',
                    name: 'Contabilidad'
                }],
            active: 'Nota Contable #166',
        },
    ];
}
