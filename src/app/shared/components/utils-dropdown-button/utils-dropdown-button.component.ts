import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { UtilsTooltipDirective } from '@core/directive';

@Component({
    selector: 'utils-dropdown-button',
    imports: [CommonModule, UtilsTooltipDirective],
    templateUrl: './utils-dropdown-button.component.html',
    styleUrl: './utils-dropdown-button.component.scss'
})
export class UtilsDropdownButtonComponent {
    @Input() tooltipText: string = 'Opciones';

    isOpen = false;

    constructor(private elementRef: ElementRef) { }

    toggleDropdown(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.isOpen = !this.isOpen;

        // Si el dropdown se abre, posicionarlo correctamente
        if (this.isOpen) {
            setTimeout(() => {
                this.positionDropdownMenu();
            }, 0);
        }
    }

    onMenuClick(event: Event): void {
        // Detener propagación para evitar que el clic llegue al documento
        event.stopPropagation();

        // Verificar si el clic fue en un elemento del dropdown
        const target = event.target as HTMLElement;
        if (target && (target.classList.contains('dropdown-item') || target.closest('.dropdown-item'))) {
            // Cerramos el dropdown después de un pequeño retraso para asegurar
            // que el evento click original se procese primero
            setTimeout(() => {
                this.isOpen = false;
            }, 10);
        }
    }

    closeDropdown(): void {
        this.isOpen = false;
    }

    /**
     * Posiciona el menú dropdown de acuerdo a la posición del botón
     */
    positionDropdownMenu(): void {
        const dropdown = this.elementRef.nativeElement.querySelector('.dropdown.dropdown-button-pt');
        const menu = dropdown?.querySelector('.dropdown-menu.dropdown-pt');
        const toggleButton = dropdown?.querySelector('.dropdown-toggle');

        if (!dropdown || !menu || !toggleButton) return;

        // Obtener dimensiones y posiciones
        const buttonRect = toggleButton.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        // Calcular espacio disponible
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Posicionar el menú con transform: translate3d para imitar el comportamiento Bootstrap
        let x = 0;
        let y = buttonRect.height + 5; // Un pequeño espacio debajo del botón

        // Si no hay suficiente espacio a la derecha, posicionar a la izquierda
        if (buttonRect.right + menuRect.width > windowWidth - 20) {
            x = -menuRect.width + buttonRect.width;
        }

        // Si no hay suficiente espacio abajo, posicionar arriba
        if (buttonRect.bottom + menuRect.height > windowHeight - 20) {
            y = -menuRect.height - 5;
        }

        // Aplicar estilos de posicionamiento al menú
        menu.style.position = 'absolute';
        menu.style.willChange = 'transform';
        menu.style.top = '0px';
        menu.style.left = '0px';
        menu.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    }

    // Escuchar cambios de tamaño de ventana para ajustar posición si es necesario
    @HostListener('window:resize')
    onResize(): void {
        if (this.isOpen) {
            this.positionDropdownMenu();
        }
    }

    // Cerrar el dropdown cuando se hace clic fuera
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        // Si el dropdown está abierto y el clic fue fuera del componente
        if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }
}