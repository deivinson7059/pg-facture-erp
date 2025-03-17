import { Directive, HostListener } from '@angular/core';
import { UtilsTypingService } from '@shared/components/utils-typing/utils-typing.service';

@Directive({
    selector: '[typingListener]',
    standalone: true
})
export class UtilsTypingListenerDirective {
    constructor(private typingService: UtilsTypingService) { }

    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = parseFloat(input.value);

        if (!isNaN(value) && value > 0) {
            this.typingService.updateValue(value);
        }
    }
}