// tooltip.directive.ts
import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { Tooltip } from 'bootstrap';

@Directive({
    selector: '[appTooltip]',
    standalone: true
})
export class UtilsTooltipDirective implements AfterViewInit, OnDestroy {
    @Input() appTooltip: string = ''; // Texto del tooltip
    @Input() placement: string = 'top'; // Posición: 'top', 'bottom', 'left', 'right'

    private tooltip: Tooltip | null = null;

    constructor(private el: ElementRef<HTMLElement>) { }

    ngAfterViewInit(): void {
        this.createTooltip();
    }

    ngOnDestroy(): void {
        if (this.tooltip) {
            this.tooltip.dispose();
        }
    }

    private createTooltip(): void {
        this.tooltip = new Tooltip(this.el.nativeElement, {
            title: this.appTooltip,
            placement: this.placement as any,
            trigger: 'hover',
            container: 'body' // Para asegurar que el tooltip se muestra correctamente
        });
    }
}