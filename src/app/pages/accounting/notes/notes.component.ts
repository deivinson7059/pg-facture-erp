import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-notes',
    imports: [BreadcrumbComponent],
    templateUrl: './notes.component.html',
    styleUrl: './notes.component.scss'
})
export class NotesComponent {
    breadscrums = [
        {
            items: [
                {
                    path: '/accounting/notes',
                    name: 'Contabilidad'
                }],
            active: 'Notas Contables',
        },
    ];
}
