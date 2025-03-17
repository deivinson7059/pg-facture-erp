import {
    Component,
    OnDestroy,
    Input,
    OnInit,
    OnChanges,
    SimpleChange,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    HostListener,
    ViewChild,
    ElementRef,
    Optional,
    Inject,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import {
    UtilsSpinnerConfig,
    UTILS_SPINNER_CONFIG,
} from './interfaces/utils-spinner-config';
import {
    Size,
    DEFAULTS,
    PRIMARY_SPINNER,
    LOADERS,
    UtilSpinner,
    LoaderType,
} from './enums/utils-spinner.enum';
import { CommonModule } from '@angular/common';
import { UtilsSpinnerService } from '@core/service';
import { UtilsSafeHtmlPipe } from '@core/pipes';

@Component({
    selector: 'utils-spinner',
    standalone: true,
    imports: [CommonModule, UtilsSafeHtmlPipe],
    templateUrl: './utils-spinner.component.html',
    styleUrls: [
        './utils-spinner.component.scss',
        './css/animations/ball-8bits.css',
        './css/animations/ball-atom.css',
        './css/animations/ball-beat.css',
        './css/animations/ball-circus.css',
        './css/animations/ball-climbing-dot.css',
        './css/animations/ball-clip-rotate-multiple.css',
        './css/animations/ball-clip-rotate-pulse.css',
        './css/animations/ball-clip-rotate.css',
        './css/animations/ball-elastic-dots.css',
        './css/animations/ball-fall.css',
        './css/animations/ball-fussion.css',
        './css/animations/ball-grid-beat.css',
        './css/animations/ball-grid-pulse.css',
        './css/animations/ball-newton-cradle.css',
        './css/animations/ball-pulse-rise.css',
        './css/animations/ball-pulse-sync.css',
        './css/animations/ball-pulse.css',
        './css/animations/ball-rotate.css',
        './css/animations/ball-running-dots.css',
        './css/animations/ball-scale-multiple.css',
        './css/animations/ball-scale-pulse.css',
        './css/animations/ball-scale-ripple-multiple.css',
        './css/animations/ball-scale-ripple.css',
        './css/animations/ball-scale.css',
        './css/animations/ball-spin-clockwise-fade-rotating.css',
        './css/animations/ball-spin-clockwise-fade.css',
        './css/animations/ball-spin-clockwise.css',
        './css/animations/ball-spin-fade-rotating.css',
        './css/animations/ball-spin-fade.css',
        './css/animations/ball-spin-rotate.css',
        './css/animations/ball-spin.css',
        './css/animations/ball-square-clockwise-spin.css',
        './css/animations/ball-square-spin.css',
        './css/animations/ball-triangle-path.css',
        './css/animations/ball-zig-zag-deflect.css',
        './css/animations/ball-zig-zag.css',
        './css/animations/cog.css',
        './css/animations/cube-transition.css',
        './css/animations/fire.css',
        './css/animations/line-scale-party.css',
        './css/animations/line-scale-pulse-out-rapid.css',
        './css/animations/line-scale-pulse-out.css',
        './css/animations/line-scale.css',
        './css/animations/line-spin-clockwise-fade-rotating.css',
        './css/animations/line-spin-clockwise-fade.css',
        './css/animations/line-spin-fade-rotating.css',
        './css/animations/line-spin-fade.css',
        './css/animations/pacman.css',
        './css/animations/square-jelly-box.css',
        './css/animations/square-loader.css',
        './css/animations/square-spin.css',
        './css/animations/timer.css',
        './css/animations/triangle-skew-spin.css',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('fadeIn', [
            state('in', style({ opacity: 1 })),
            transition(':enter', [style({ opacity: 0 }), animate(300)]),
            transition(':leave', animate(200, style({ opacity: 0 }))),
        ]),
    ],
})

export class UtilsSpinnerComponent implements OnDestroy, OnInit, OnChanges {
    /**
     * To set backdrop color
     * Only supports RGBA color format
     * @memberof NgxSpinnerComponent
     */
    @Input() bdColor: string;
    /**
     * To set spinner size
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() size: Size;
    /**
     * To set spinner color(DEFAULTS.SPINNER_COLOR)
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() color: string;
    /**
     * To set type of spinner
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() type: LoaderType = 'ball-scale-multiple';
    /**
     * To toggle fullscreen mode
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() fullScreen: boolean;
    /**
     * Spinner name
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() name: string = PRIMARY_SPINNER;
    /**
     * z-index value
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() zIndex: number;
    /**
     * Custom template for spinner/loader
     *
     * @memberof NgxSpinnerComponent
     */
    @Input() template?: string;
    /**
     * Show/Hide the spinner
     *
     * @type {boolean}
     * @memberof NgxSpinnerComponent
     */
    @Input() showSpinner: boolean = false;

    /**
     * To enable/disable animation
     *
     * @type {boolean}
     * @memberof NgxSpinnerComponent
     */
    @Input() disableAnimation: boolean = false;
    /**
     * Spinner Object
     *
     * @memberof NgxSpinnerComponent
     */
    spinner: UtilSpinner = new UtilSpinner();
    /**
     * Array for spinner's div
     *
     * @memberof NgxSpinnerComponent
     */
    divArray: Array<number>;
    /**
     * Counter for div
     *
     * @memberof NgxSpinnerComponent
     *
     */
    divCount: number;
    /**
     * Show spinner
     *
     * @memberof NgxSpinnerComponent
     **/
    show: boolean = false;
    /**
     * Unsubscribe from spinner's observable
     *
     * @memberof NgxSpinnerComponent
     **/
    ngUnsubscribe: Subject<void> = new Subject();
    /**
     * Element Reference
     *
     * @memberof NgxSpinnerComponent
     */
    @ViewChild('overlay') spinnerDOM!: { nativeElement: any };

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.spinnerDOM && this.spinnerDOM.nativeElement) {
            if (
                this.fullScreen ||
                (!this.fullScreen && this.isSpinnerZone(event.target))
            ) {
                event.returnValue = false;
                event.preventDefault();
            }
        }
    }

    /**
     * Creates an instance of NgxSpinnerComponent.
     *
     * @memberof NgxSpinnerComponent
     */
    constructor(
        private spinnerService: UtilsSpinnerService,
        private changeDetector: ChangeDetectorRef,
        private elementRef: ElementRef,
        @Optional()
        @Inject(UTILS_SPINNER_CONFIG)
        private globalConfig: UtilsSpinnerConfig
    ) {
        this.bdColor = DEFAULTS.BD_COLOR;
        this.zIndex = DEFAULTS.Z_INDEX;
        this.color = DEFAULTS.SPINNER_COLOR;
        this.size = 'large';
        this.fullScreen = true;
        this.name = PRIMARY_SPINNER;
        this.template = undefined;
        this.showSpinner = false;

        this.divArray = [];
        this.divCount = 0;
        this.show = false;
    }

    initObservable() {
        this.spinnerService
            .getSpinner(this.name)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((spinner: UtilSpinner) => {
                // Solo actualizamos si el spinner tiene el mismo nombre
                if (spinner && spinner.name === this.name) {
                    this.setDefaultOptions();
                    Object.assign(this.spinner, spinner);
                    if (spinner.show) {
                        this.onInputChange();
                    }
                    this.changeDetector.detectChanges();
                }
            });
    }

    /**
     * Initialization method
     *
     * @memberof NgxSpinnerComponent
     */
    ngOnInit() {
        if (!this.name || this.name.trim() === '') {
            this.name = PRIMARY_SPINNER;
        }

        this.setDefaultOptions();
        this.initObservable();

        // Forzar que el spinner comience oculto
        this.spinner.show = false;
        this.show = false;
        this.changeDetector.detectChanges();
    }

    /**
     * To check event triggers inside the Spinner Zone
     *
     * @param {*} element
     * @returns {boolean}
     * @memberof NgxSpinnerComponent
     */
    isSpinnerZone(element: any): boolean {
        if (element === this.elementRef.nativeElement.parentElement) {
            return true;
        }
        return element.parentNode && this.isSpinnerZone(element.parentNode);
    }

    /**
     * To set default ngx-spinner options
     *
     * @memberof NgxSpinnerComponent
     */
    setDefaultOptions = () => {
        const { type } = this.globalConfig ?? {};

        if (!this.name || this.name.trim() === '') {
            this.name = PRIMARY_SPINNER;
        }

        this.spinner = UtilSpinner.create({
            name: this.name,
            bdColor: this.bdColor,
            size: this.size,
            color: this.color,
            type: this.type ?? type,
            fullScreen: this.fullScreen,
            divArray: this.divArray,
            divCount: this.divCount,
            show: false, // Siempre inicializar como oculto
            zIndex: this.zIndex,
            template: this.template,
            showSpinner: this.showSpinner,
        });
    };

    /**
     * On changes event for input variables
     *
     * @memberof NgxSpinnerComponent
     */
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (const propName in changes) {
            if (propName) {
                const changedProp = changes[propName];
                if (changedProp.isFirstChange()) {
                    return;
                } else if (
                    typeof changedProp.currentValue !== 'undefined' &&
                    changedProp.currentValue !== changedProp.previousValue
                ) {
                    if (changedProp.currentValue !== '') {
                        // Utilizar un enfoque seguro para asignar propiedades
                        this.assignSpinnerProperty(propName, changedProp.currentValue);

                        if (propName === 'showSpinner') {
                            if (changedProp.currentValue) {
                                this.spinnerService.show(this.spinner.name, this.spinner);
                            } else {
                                this.spinnerService.hide(this.spinner.name);
                            }
                        }

                        if (propName === 'name') {
                            this.initObservable();
                        }
                    }
                }
            }
        }
    }

    /**
     * To get class for spinner
     *
     * @memberof NgxSpinnerComponent
     */
    getClass(type: string, size: Size): string {
        // Usar la aserción de tipo para indicar que 'type' es una clave válida para LOADERS
        let divCount = LOADERS[type as keyof typeof LOADERS] || 0;
        this.spinner.divCount = divCount;
        this.spinner.divArray = Array(this.spinner.divCount)
            .fill(0)
            .map((_, i) => i);
        let sizeClass = '';
        switch (size.toLowerCase()) {
            case 'small':
                sizeClass = 'la-sm';
                break;
            case 'medium':
                sizeClass = 'la-2x';
                break;
            case 'large':
                sizeClass = 'la-3x';
                break;
            default:
                break;
        }
        return 'la-' + type + ' ' + sizeClass;
    }

    /**
     * Check if input variables have changed
     *
     * @memberof NgxSpinnerComponent
     */
    onInputChange() {
        this.spinner.class = this.getClass(this.spinner.type!, this.spinner.size!);
    }

    /**
     * Component destroy event
     *
     * @memberof NgxSpinnerComponent
     */
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * Método auxiliar para asignar propiedades al spinner de forma segura para TypeScript
     * @param propName Nombre de la propiedad
     * @param value Valor a asignar
     */
    private assignSpinnerProperty(propName: string, value: any): void {
        // Asignar de forma segura las propiedades conocidas
        switch (propName) {
            case 'name':
                this.spinner.name = value;
                break;
            case 'bdColor':
                this.spinner.bdColor = value;
                break;
            case 'size':
                this.spinner.size = value;
                break;
            case 'color':
                this.spinner.color = value;
                break;
            case 'type':
                this.spinner.type = value;
                break;
            case 'fullScreen':
                this.spinner.fullScreen = value;
                break;
            case 'zIndex':
                this.spinner.zIndex = value;
                break;
            case 'template':
                this.spinner.template = value;
                break;
            case 'showSpinner':
                this.spinner.showSpinner = value;
                break;
            case 'show':
                this.spinner.show = value;
                break;
            default:
                console.warn(`Propiedad desconocida: ${propName}`);
                break;
        }
    }
}