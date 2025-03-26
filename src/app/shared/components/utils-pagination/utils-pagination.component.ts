import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { UtilsPaginationControlsDirective } from '@core/directive';

function coerceToBoolean(input: string | boolean): boolean {
    return !!input && input !== 'false';
}

@Component({
    selector: 'utils-pagination',
    imports: [CommonModule, UtilsPaginationControlsDirective],
    templateUrl: './utils-pagination.component.html',
    styleUrl: './utils-pagination.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class UtilsPaginationComponent {
    @Input() id: string = 'pagination';
    @Input() maxSize: number = 7;
    @Input()
    get directionLinks(): boolean {
        return this._directionLinks;
    }
    set directionLinks(value: boolean) {
        this._directionLinks = coerceToBoolean(value);
    }
    @Input()
    get autoHide(): boolean {
        return this._autoHide;
    }
    set autoHide(value: boolean) {
        this._autoHide = coerceToBoolean(value);
    }
    @Input()
    get responsive(): boolean {
        return this._responsive;
    }
    set responsive(value: boolean) {
        this._responsive = coerceToBoolean(value);
    }
    @Input() previousLabel: string = 'Previous';
    @Input() nextLabel: string = 'Next';
    @Input() screenReaderPaginationLabel: string = 'Pagination';
    @Input() screenReaderPageLabel: string = 'page';
    @Input() screenReaderCurrentLabel: string = `You're on page`;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageBoundsCorrection: EventEmitter<number> =
        new EventEmitter<number>();

    private _directionLinks: boolean = true;
    private _autoHide: boolean = false;
    private _responsive: boolean = false;

    trackByIndex(index: number) {
        return index;
    }
}
