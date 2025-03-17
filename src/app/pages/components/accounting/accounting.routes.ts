import { Route } from '@angular/router';
import { BalanceComponent } from './balance/balance.component';
import { AccountingComponent } from './accounting.component';
import { NotesComponent } from './notes/notes.component';
import { NotesNewComponent } from './notes/notes-new/notes-new.component';
import { NoteDetailComponent } from './notes/note-detail/note-detail.component';

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

