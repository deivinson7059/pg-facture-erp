// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  company: {
    name: string;
  };
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';
  
  // Cache de datos para mejorar rendimiento
  private usersCache: User[] = [];
  
  // BehaviorSubjects para mantener el estado actual
  private usersSubject = new BehaviorSubject<User[]>([]);
  
  // Observables para consumir desde componentes
  public users$ = this.usersSubject.asObservable();
  
  // Indicadores de carga
  private loadingUsersSubject = new BehaviorSubject<boolean>(false);
  public loadingUsers$ = this.loadingUsersSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar datos iniciales
    this.loadInitialData();
  }
  
  private loadInitialData(): void {
    this.loadingUsersSubject.next(true);
    
    // Cargar usuarios
    this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      tap(users => {
        this.usersCache = users;
        this.usersSubject.next(users);
        this.loadingUsersSubject.next(false);
      }),
      catchError(error => {
        console.error('Error cargando usuarios:', error);
        this.loadingUsersSubject.next(false);
        return of([]);
      })
    ).subscribe();    
    
  }
  
  // Búsqueda en tiempo real con cache y debounce incorporado
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // Si el término está vacío, devolver todos los usuarios
      return of(this.usersCache);
    }
    
    this.loadingUsersSubject.next(true);
    
    // Simular un pequeño delay para evitar demasiadas actualizaciones
    return of(this.usersCache).pipe(
      delay(180), // Pequeño retraso para dar sensación de fluidez
      map(users => {
        const searchTerm = term.toLowerCase();
        return users.filter(user => 
          user.name.toLowerCase().includes(searchTerm) || 
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }),
      tap(() => this.loadingUsersSubject.next(false))
    );
  }  
  
  
  // Obtener un usuario por ID (útil para selección)
  getUserById(id: number): Observable<User | undefined> {
    const cachedUser = this.usersCache.find(user => user.id === id);
    if (cachedUser) {
      return of(cachedUser);
    }
    
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }
}