// form-validation.directive.ts
import { Directive, ElementRef, } from '@angular/core';

@Directive({
    selector: '[toastContainer]',
    exportAs: 'toastContainer',
    standalone: true
})
export class UtilsToastDirective {
    constructor(private el: ElementRef) { }
    getContainerElement(): HTMLElement {
        return this.el.nativeElement;
    }
}