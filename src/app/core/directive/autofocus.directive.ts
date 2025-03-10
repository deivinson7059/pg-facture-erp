import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appAutofocus]',
    standalone: true
})
export class AutofocusDirective implements AfterContentInit {
    @Input() appAutofocus: boolean = true;
    @Input() focusDelay: number = 100;

    constructor(private el: ElementRef) { }

    ngAfterContentInit() {
        if (this.appAutofocus) {
            this.setFocus();
        }
    }

    private setFocus() {
        // Estrategia 1: Si el elemento es un input, establecer foco directamente
        if (this.el.nativeElement.tagName === 'INPUT') {
            this.focusElement(this.el.nativeElement);
            return;
        }

        // Estrategia 2: Si es un componente, intentar encontrar un input interno
        setTimeout(() => {
            // Buscar un input dentro del componente
            const input = this.el.nativeElement.querySelector('input');
            if (input) {
                this.focusElement(input);
                return;
            }

            // Estrategia 3: Buscar un elemento con clase "form-control" o similar
            const formControl = this.el.nativeElement.querySelector('.form-control');
            if (formControl) {
                this.focusElement(formControl);
                return;
            }

            // Estrategia 4: Último recurso - intentar enfocar el elemento directamente
            this.focusElement(this.el.nativeElement);
        }, this.focusDelay);
    }

    private focusElement(el: HTMLElement) {
        try {
            el.focus();

            // Para dispositivos móviles, asegurar que el teclado se abra
            if ('ontouchstart' in window) {
                // Técnica para forzar el foco en dispositivos móviles
                el.dispatchEvent(new Event('touchstart', { bubbles: true }));
                el.dispatchEvent(new Event('touchend', { bubbles: true }));
            }

            // Scroll hacia el elemento si es necesario
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            console.error('Error al establecer el foco:', error);
        }
    }
}