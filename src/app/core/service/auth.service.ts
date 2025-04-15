import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiResponse, Company, FirstStepResponse, SecondStepResponse, UserData } from '@core/models/auth.model';
import { Router } from '@angular/router';
import { User } from '@core/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private apiUrl = `${environment.backend.domain}/auth`;
    private jwtHelper = new JwtHelperService();

    // Para almacenar datos entre pasos de login
    private tempLoginData: {
        userData?: UserData;
        companies?: Company[];
        identification_number?: string;
        password?: string;
    } = {};

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem('currentUser') || '{}')
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    // Método para  vaciar el BehaviorSubject y el localStorage
    clearUserData() {
        this.currentUserSubject.next({} as User);
        localStorage.removeItem('currentUser');
        this.tempLoginData = {};
    }
    // Función auxiliar para extraer y formatear mensajes de error
    private formatErrorMessage(errorResponse: any): string {
        // Si es un error lanzado por nosotros directamente
        if (errorResponse instanceof Error) {
            return errorResponse.message;
        }

        try {
            // Revisamos primero messages.error que puede ser string o array
            if (errorResponse?.error?.messages?.error) {
                const errorMessages = errorResponse.error.messages.error;

                // Si es un array, convertirlo a string con saltos de línea
                if (Array.isArray(errorMessages)) {
                    return errorMessages.join('\n');
                }

                // Si es string, devolverlo directamente
                return errorMessages;
            }

            // Si no hay messages.error, buscar en error global
            if (errorResponse?.error?.error) {
                return errorResponse.error.error;
            }

            // Si es un objeto de error HTTP sin estructura específica
            if (errorResponse?.statusText) {
                return errorResponse.statusText;
            }

            // Si todo lo demás falla, devolver un mensaje genérico
            return 'Error de autenticación';
        } catch (e) {
            // Si algo va mal en el procesamiento de error, devolver genérico
            return 'Error en la comunicación con el servidor';
        }
    }


    // Paso 1: Login inicial
    loginStep1(identification_number: string, password: string): Observable<any> {
        const credentials = { identification_number, password };

        return this.http.post<FirstStepResponse>(`${this.apiUrl}/login`, credentials)
            .pipe(
                map(response => {
                    if (response.success && response.data) {
                        // Guardar datos para el segundo paso
                        this.tempLoginData = {
                            userData: response.data.user,
                            companies: response.data.cmpy,
                            identification_number,
                            password
                        };
                        return response;
                    } else {
                        // Extraer y formatear mensajes de error de la respuesta
                        const errorMsg = this.getErrorMessageFromResponse(response);
                        throw new Error(errorMsg);
                    }
                }),
                catchError(error => {
                    const errorMessage = this.formatErrorMessage(error);
                    return throwError(() => errorMessage);
                })
            );
    }

    // Obtener mensaje de error de una respuesta de API
    private getErrorMessageFromResponse(response: ApiResponse): string {
        if (response.messages?.error) {
            // Si el error es un array, unirlo
            if (Array.isArray(response.messages.error)) {
                return response.messages.error.join('\n');
            }
            return response.messages.error;
        }

        if (response.error) {
            return response.error;
        }

        return 'Error de autenticación';
    }

    // PASO 2: Selección de compañía y bodega
    loginStep2(cmpy: string, ware: string): Observable<User> {
        if (!this.tempLoginData.identification_number || !this.tempLoginData.password) {
            return throwError(() => 'Debe completar el primer paso de autenticación');
        }

        const authData = {
            identification_number: this.tempLoginData.identification_number,
            password: this.tempLoginData.password,
            cmpy,
            ware
        };

        return this.http.post<SecondStepResponse>(`${this.apiUrl}/autenticate`, authData)
            .pipe(
                map(res => {
                    if (res.success && res.data) {
                        // Crear objeto de usuario basado en la respuesta
                        const user: User = {
                            id: res.data.user.id,
                            name: res.data.user.name,
                            identification_number: res.data.user.identification_number,
                            email: res.data.user.email,
                            cmpy: res.data.cmpy.id,
                            ware: res.data.cmpy.ware,
                            role_id: res.data.cmpy.role_id,
                            role: res.data.cmpy.role,
                            path: res.data.cmpy.path,
                            platform_id: res.data.cmpy.platform_id,
                            list: res.data.cmpy.list,
                            scopes: res.data.cmpy.scopes,
                            token: res.data.token,
                            access_token: res.data.access_token,
                            menu: res.data.menu || [],
                        };

                        // Guardar en localStorage
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);

                        // Limpiar datos temporales
                        this.tempLoginData = {};

                        return user;
                    } else {
                        // Extraer y formatear mensajes de error de la respuesta
                        const errorMsg = this.getErrorMessageFromResponse(res);
                        throw new Error(errorMsg);
                    }
                }),
                catchError(error => {
                    const errorMessage = this.formatErrorMessage(error);
                    return throwError(() => errorMessage);
                })
            );
    }

    // Obtener los datos almacenados del primer paso
    getTempLoginData() {
        return this.tempLoginData;
    }

    // auth.service.ts

    refreshToken(): Observable<any> {
        const currentUser = this.currentUserValue;

        if (!currentUser || !currentUser.access_token) {
            return throwError(() => 'No hay token para refrescar');
        }

        return this.http.post<any>(`${this.apiUrl}/refresh-token`, {
            token: currentUser.access_token
        }).pipe(
            map(response => {
                if (response.success && response.data && response.data.access_token) {
                    // Crear un nuevo objeto de usuario con el mismo contenido pero con el nuevo access_token
                    const updatedUser = {
                        ...currentUser,
                        access_token: response.data.access_token
                    };

                    // Guardar en localStorage
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                    // Actualizar el BehaviorSubject
                    this.currentUserSubject.next(updatedUser);

                    return updatedUser;
                } else {
                    throw new Error('No se recibió un nuevo token válido');
                }
            }),
            catchError(error => {
                console.error('Error al refrescar el token:', error);
                return throwError(() => error);
            })
        );
    }

    // Método original de login (para compatibilidad)
    login(username: string, password: string) {
        // Esta implementación se mantiene para compatibilidad
        // En este caso, delegamos al nuevo proceso de dos pasos
        const identification_number = username;

        return this.loginStep1(identification_number, password).pipe(
            map(response => {
                // Si solo hay una compañía y una bodega, hacer login automático
                const companies = this.tempLoginData.companies || [];
                if (companies.length === 1 && companies[0].wares.length === 1) {
                    const cmpy = companies[0].cmpy;
                    const ware = companies[0].wares[0].ware;

                    // Hacer login automático con el segundo paso
                    this.loginStep2(cmpy, ware).subscribe(user => {
                        // Redireccionar según el rol del usuario
                        if (user && user.path === 'admin') {
                            this.router.navigate(['/admin/dashboard/main']);
                        } else {
                            this.router.navigate(['/user/dashboard/user']);
                        }
                    });

                    // Devolver respuesta formateada para compatibilidad
                    return new HttpResponse({
                        status: 200,
                        body: { success: true }
                    });
                }

                // Si hay múltiples opciones, devolver error para gestionar en componente
                return throwError('multiple_options');
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    isLoggedIn(): boolean {
        return this.currentUserValue && this.currentUserValue.access_token
            ? !this.jwtHelper.isTokenExpired(this.currentUserValue.access_token)
            : false;
    }

    // Modifica el método logout existente:
    logout(): Observable<any> {
        const currentUser = this.currentUserValue;

        // Si no hay usuario o token, simplemente hacer logout local
        if (!currentUser || !currentUser.access_token) {
            this.doLocalLogout();
            return of({ success: true });
        }

        // Enviar solicitud de logout al servidor
        return this.http
            .post<any>(`${this.apiUrl}/logout`,
                null,
            ).pipe(
                tap((res) => {
                    console.log('Logout exitoso en el servidor:', res);
                    // Independientemente de la respuesta del servidor, realizar el logout local
                    // this.doLocalLogout();
                }),
                catchError(error => {
                    // Si hay un error en la comunicación con el servidor, aún así hacer logout local
                    console.error('Error al cerrar sesión en el servidor:', error);
                    //this.doLocalLogout();
                    return of({ success: true }); // Retornamos éxito aunque haya habido error en el servidor
                })
            );
    }

    doLocalLogout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next({} as User);
        this.tempLoginData = {};
        return of({ success: false });
    }


}
