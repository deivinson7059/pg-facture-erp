import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/service/auth.service';
import { Observable } from 'rxjs';
import { UtilsToastrService } from '@core/service/utils-toastr.service';

@Injectable({
    providedIn: 'root',
})
export class RequiredScopesGuard {
    constructor(
        private authService: AuthService,
        private router: Router,
        private toastrService: UtilsToastrService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        // Verificar si el usuario está autenticado
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/authentication/signin']);
            return false;
        }

        // Obtener el scope requerido para la ruta
        const requiredScope = route.data['requiredScope'] as string;


        // Si no hay scope requerido, permitir acceso
        if (!requiredScope) {
            return true;
        }

        // Obtener scopes del usuario
        const currentUser = this.authService.currentUserValue;
        const userScopes = currentUser?.scopes || [];


        // Verificar si el usuario tiene el scope requerido
        const hasRequiredScope = userScopes.includes(requiredScope);


        if (!hasRequiredScope) {
            // Si el usuario no tiene el scope requerido, mostrar mensaje y redirigir a página de acceso denegado
            this.toastrService.error('No tienes permisos para acceder a esta sección', 'Acceso denegado');

            // Guardamos la URL actual en el historial antes de redirigir
            const currentUrl = state.url;

            // Redirigir a la página de acceso denegado
            this.router.navigate(['/access-denied']);
            return false;
        }

        return true;
    }
}