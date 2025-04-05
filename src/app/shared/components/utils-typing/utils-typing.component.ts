// Actualiza el typing.component.ts para usar el servicio
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsTypingService } from '@core';

@Component({
    selector: 'utils-typing',
    standalone: true,
    imports: [CommonModule, DecimalPipe],
    templateUrl: './utils-typing.component.html'
})
export class UtilsTypingComponent implements OnInit, OnDestroy {
    isTyping: boolean = false;
    currentTypingValue: number = 0;

    @Input() timeout: number = 2000;

    private destroy$ = new Subject<void>();
    private typingTimeout: any = null;

    constructor(private typingService: UtilsTypingService) { }

    ngOnInit(): void {
        // Suscribirse al servicio para recibir actualizaciones
        this.typingService.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => {
                // Si el valor es 0, ocultar inmediatamente
                if (value === 0) {
                    this.isTyping = false;
                    return;
                }
                if (!isNaN(value) && value > 0) {
                    this.currentTypingValue = value;
                    this.isTyping = true;
                    this.resetTimer();
                }
            });
    }

    private resetTimer(): void {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
        }, this.timeout);
    }

    ngOnDestroy(): void {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        this.destroy$.next();
        this.destroy$.complete();
    }
}