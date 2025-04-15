import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core';

@Component({
    selector: 'app-access-denied',
    imports: [RouterModule],
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.scss'] // Corregido 'styleUrl' a 'styleUrls'
})
export class AccessDeniedComponent {
    constructor(private router: Router, private authService: AuthService, private location: Location) { }

    goToDashboard() {
        // Redireccionar si ya está logueado
        if (this.authService.isLoggedIn()) {
            const currentUser = this.authService.currentUserValue;

            if (currentUser.path === 'admin') {
                this.router.navigate(['/admin/dashboard']);
            } else {
                this.router.navigate(['/user/dashboard']);
            }
        }
    }

    goBack() {
        /*  // Intentar regresar a la ruta anterior
         this.location.back();
 
         // Si no hay ruta anterior, redirigir al dashboard
         setTimeout(() => {
             if (this.location.path() === '/access-denied') {
                 this.goToDashboard();
             }
         }, 100); */
        this.goToDashboard();
    }
}
