import { Directive, HostListener } from '@angular/core';
import { UtilsTypingService } from '@core';

@Directive({
    selector: '[typingListener]',
    standalone: true
})
export class UtilsTypingListenerDirective {
    constructor(private typingService: UtilsTypingService) { }

    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        // Verificar si el input está vacío
        if (!input.value || input.value.trim() === '') {
            // Enviar un valor especial (0) para indicar que debe ocultarse
            this.typingService.updateValue(0);
            return;
        }

        const value = parseFloat(input.value);

        if (!isNaN(value) && value > 0) {
            // Emitir el valor al servicio
            this.typingService.updateValue(value);
        }
    }
}