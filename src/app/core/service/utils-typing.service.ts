import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UtilsTypingService {
    private valueSubject = new Subject<number>();
    public valueChanges = this.valueSubject.asObservable();

    /**
     * Notifica un nuevo valor de escritura
     * @param value El valor numérico
     */
    updateValue(value: number): void {
        this.valueSubject.next(value);
    }
}