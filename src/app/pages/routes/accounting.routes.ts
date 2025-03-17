import { Route } from '@angular/router';
import { AccountingComponent, BalanceComponent, NoteDetailComponent, NotesComponent, NotesNewComponent } from '@pages/components';

export const ACCOUNTING_ROUTE: Route[] = [

    {
        path: '',
        component: AccountingComponent
    },
    {
        path: 'balance',
        component: BalanceComponent
    },
    {
        path: 'notes',
        component: NotesComponent
    },
    {
        path: 'notes/new',
        component: NotesNewComponent
    },
    {
        path: 'note/:noteId',
        component: NoteDetailComponent
    }
];

