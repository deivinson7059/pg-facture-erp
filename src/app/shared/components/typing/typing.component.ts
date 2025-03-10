// Actualiza el typing.component.ts para usar el servicio
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TypingService } from './typing.service';

@Component({
    selector: 'app-typing',
    standalone: true,
    imports: [CommonModule, DecimalPipe],
    templateUrl: './typing.component.html'
})
export class TypingComponent implements OnInit, OnDestroy {
    isTyping: boolean = false;
    currentTypingValue: number = 0;

    @Input() timeout: number = 2000;

    private destroy$ = new Subject<void>();
    private typingTimeout: any = null;

    constructor(private typingService: TypingService) { }

    ngOnInit(): void {
        // Suscribirse al servicio para recibir actualizaciones
        this.typingService.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => {
                // console.log('value', value);
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