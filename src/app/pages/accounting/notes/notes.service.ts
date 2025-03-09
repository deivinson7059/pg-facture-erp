import { Injectable } from '@angular/core';
import { NotaContable } from '../interfaces/notas.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { apiResponse, Puc, PucData } from '../interfaces/puc.interface';

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
            account: '1105',
            cmpy: '01',
        });
    }

    private loadInitialData(data: PucData): void {
        this.loadingPucSubject.next(true);

        // Cargar usuarios
        this.http.post<apiResponse<Puc[]>>(
            `${backend.domain}/accounting/puc/search`,
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


    // Datos de ejemplo para demostración
    private notasContables: NotaContable[] = [];
    private nextId = 1;


    // Obtener todas las notas contables
    getNotasContables(): Observable<NotaContable[]> {
        // En una aplicación real: return this.http.get<NotaContable[]>(this.apiUrl);
        return of(this.notasContables);
    }

    // Obtener una nota contable por ID
    getNotaContable(id: number): Observable<NotaContable | undefined> {
        // En una aplicación real: return this.http.get<NotaContable>(`${this.apiUrl}/${id}`);
        const nota = this.notasContables.find(n => n.id === id);
        return of(nota);
    }

    // Crear una nueva nota contable
    crearNotaContable(nota: NotaContable): Observable<NotaContable> {
        // En una aplicación real: return this.http.post<NotaContable>(this.apiUrl, nota);
        const nuevaNota: NotaContable = {
            ...nota,
            id: this.nextId++,
            fechaCreacion: new Date()
        };
        this.notasContables.push(nuevaNota);
        return of(nuevaNota);
    }

    // Actualizar una nota contable existente
    actualizarNotaContable(nota: NotaContable): Observable<NotaContable> {
        // En una aplicación real: return this.http.put<NotaContable>(`${this.apiUrl}/${nota.id}`, nota);
        const index = this.notasContables.findIndex(n => n.id === nota.id);
        if (index !== -1) {
            this.notasContables[index] = nota;
        }
        return of(nota);
    }

    // Eliminar una nota contable
    eliminarNotaContable(id: number): Observable<void> {
        // En una aplicación real: return this.http.delete<void>(`${this.apiUrl}/${id}`);
        const index = this.notasContables.findIndex(n => n.id === id);
        if (index !== -1) {
            this.notasContables.splice(index, 1);
        }
        return of(undefined);
    }
}
