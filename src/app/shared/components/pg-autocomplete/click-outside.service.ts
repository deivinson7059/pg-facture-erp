import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClickOutsideService {
  // Observable que emite eventos de clic en el documento
  documentClick$: Observable<Event> = fromEvent(document, 'click').pipe(share());
}