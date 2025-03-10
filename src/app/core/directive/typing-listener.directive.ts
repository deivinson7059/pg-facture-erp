import { Directive, HostListener } from '@angular/core';
import { TypingService } from '@shared/components/typing/typing.service';

@Directive({
    selector: '[typingListener]',
    standalone: true
})
export class TypingListenerDirective {
    constructor(private typingService: TypingService) { }

    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = parseFloat(input.value);

        if (!isNaN(value) && value > 0) {
            this.typingService.updateValue(value);
        }
    }
}