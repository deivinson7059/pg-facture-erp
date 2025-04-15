import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiResponse } from '@pages/interfaces';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Scope } from '@pages/interfaces/scope.inerface';

const { backend } = environment;

@Injectable({
    providedIn: 'root',
})
export class ConfigsService {
    constructor(private http: HttpClient) { }

    findAllScopes(): Observable<apiResponse<Scope[]>> {
        return this.http.get<apiResponse<Scope[]>>(
            `${backend.domain}/auth/scopes`,
            {
                headers: {},
            }
        );
    }

    addScope(scope: Scope): Observable<apiResponse<Scope>> {
        return this.http.post<apiResponse<Scope>>(
            `${backend.domain}/auth/scopes`,
            scope,
            {
                headers: {},
            }
        );
    }
    removeScope(id: string): Observable<apiResponse<Scope>> {
        return this.http.delete<apiResponse<Scope>>(
            `${backend.domain}/auth/scopes/${id}`,
            {
                headers: {},
            }
        );
    }

    quitarScope(id: string, role: string): Observable<apiResponse<Scope>> {
        return this.http.delete<apiResponse<Scope>>(
            `${backend.domain}/auth/roles/${role}/scopes/${id}`,
            {
                headers: {},
            }
        );
    }

}
