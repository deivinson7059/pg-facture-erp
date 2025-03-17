import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { apiResponse, Puc, PucCmpy, PucData, NotaContable } from '../interfaces';
import { AccountingEntry, notesHeader } from '../interfaces/notas.interface';

const { backend } = environment;

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    // Cache de datos para mejorar rendimiento
    private pucCache: Puc[] = [];

    // BehaviorSubjects para mantener el estado actual
    private pucSubject = new BehaviorSubject<Puc[]>([]);

    // Observables para consumir desde componentes
    public puc$ = this.pucSubject.asObservable();

    // Indicadores de carga
    private loadingPucSubject = new BehaviorSubject<boolean>(false);
    public loadingPuc$ = this.loadingPucSubject.asObservable();


    constructor(private http: HttpClient) {
        // Cargar datos iniciales
        this.loadInitialData({
            cmpy: '01',
        });
    }

    private loadInitialData(data: PucCmpy): void {
        this.loadingPucSubject.next(true);

        // Cargar usuarios
        this.http.post<apiResponse<Puc[]>>(
            `${backend.domain}/accounting/puc/all`,
            data,
            {
                headers: {},
            }
        ).pipe(
            tap(puc => {
                this.pucCache = puc.data!;
                this.pucSubject.next(puc.data!);
                this.loadingPucSubject.next(false);
                console.log('Puc cargado:', puc);
            }),
            catchError(error => {
                console.error('Error cargando puc:', error);
                this.loadingPucSubject.next(false);
                return of([]);
            })
        ).subscribe();

    }
    searchAccounts(data: PucData): Observable<apiResponse<Puc[]>> {
        return this.http.post<apiResponse<Puc[]>>(
            `${backend.domain}/accounting/puc/search`,
            data,
            {
                headers: {},
            }
        );
    }

    createNote(data: notesHeader): Observable<apiResponse<AccountingEntry[]>> {
        return this.http.post<apiResponse<AccountingEntry[]>>(
            `${backend.domain}/accounting/notes`,
            data,
            {
                headers: {},
            }
        );
    }

}
