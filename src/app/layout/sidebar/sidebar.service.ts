import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouteInfo } from './sidebar.metadata';
import { AuthService } from '@core';

@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    constructor(private authService: AuthService) { }

    /**
     * Get sidebar menu items from JSON file
     * @returns Observable<RouteInfo[]>
     */
    getRouteInfo(): Observable<RouteInfo[]> {
        const currentUser = this.authService.currentUserValue;
        // Si el usuario tiene menú, usarlo directamente
        if (currentUser && currentUser.menu && currentUser.menu.length > 0) {
            return of(currentUser.menu);
        }
        return of([]);
    }
}
