import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef, OnDestroy, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { ClickOutsideService } from './click-outside.service';

@Component({
    selector: 'utils-autocomplete',
    imports: [CommonModule, FormsModule, NgTemplateOutlet],
    templateUrl: './utils-autocomplete.component.html',
    styleUrl: './utils-autocomplete.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UtilsAutocompleteComponent),
            multi: true
        }
    ]
})
export class UtilsAutocompleteComponent<T extends object> implements OnInit, OnDestroy, ControlValueAccessor {
    /** Valor seleccionado actualmente (objeto completo) */
    _selectedValue: T | null = null;

    /**
     * Si debe mostrar un botón al lado del input
     * @example true (muestra el botón)
     * @example false (no muestra el botón)
     */
    @Input() showButton: boolean = false;

    /**
     * Texto a mostrar en el botón
     * @example 'Crear'
     */
    @Input() buttonText: string = 'Crear';

    /**
     * Clase CSS para el botón
     * @example 'bt bt-white ms-2'
     */
    @Input() buttonClass: string = 'bt bt-white ms-2';

    /**
     * Clase CSS para el icono del botón
     * @example 'fa fa-plus'
     */
    @Input() buttonIconClass: string = 'fa fa-plus';

    /**
     * Evento emitido cuando se hace clic en el botón
     * @example (buttonClick)="onCreateNewItem()"
     */
    @Output() buttonClick = new EventEmitter<void>();

    /**
     * Lista de datos para mostrar en las sugerencias
     * @example [{id: 1, name: 'Item 1'}, {id: 2, name: 'Item 2'}]
     */
    @Input() data: T[] = [];

    /**
     * Campo que se utilizará como valor/identificador del objeto
     * @example 'id', 'code', 'uuid'
     */
    @Input() valueField: keyof T = 'code' as keyof T;

    /**
     * Campo que se mostrará como texto principal del objeto
     * @example 'name', 'description', 'title'
     */
    @Input() displayField: keyof T = 'name' as keyof T;

    /**
     * Formato para mostrar el texto de los items cuando no se usa customDisplayTemplate
     * Usa {value} y {display} como placeholders
     * @example '{value} - {display}'
     */
    @Input() displayFormat: string = '{value} - {display}';

    /**
     * Texto a mostrar cuando no hay selección
     * @example 'Buscar cliente...'
     */
    @Input() placeholder: string = 'Seleccionar opción';

    /**
     * Milisegundos de espera antes de buscar (evita múltiples consultas)
     * @example 300
     */
    @Input() debounceTime: number = 200;

    /**
     * Cantidad mínima de caracteres para iniciar la búsqueda
     * @example 3 (búsqueda sólo a partir de 3 caracteres)
     */
    @Input() minChars: number = 1;

    /**
     * Template personalizado para mostrar cada ítem
     * @example <ng-template #itemTemplate let-item><b>{{item.code}}</b> {{item.name}}</ng-template>
     */
    @Input() itemTemplate?: TemplateRef<any>;

    /**
     * Template personalizado para el mensaje de "no se encontraron resultados"
     */
    @Input() notFoundTemplate?: TemplateRef<any>;

    /**
     * Template personalizado para el indicador de carga
     */
    @Input() loadingTemplate?: TemplateRef<any>;

    /**
     * Si debe mostrar el dropdown al enfocar el campo (sin necesidad de escribir)
     */
    @Input() showDropdownOnFocus: boolean = true;

    /**
     * Indica si el campo es requerido (para validación visual)
     */
    @Input() required: boolean = true;

    /**
     * Mensaje personalizado a mostrar cuando el campo es requerido pero está vacío
     * @example 'Por favor seleccione una opción'
     */
    @Input() errorMessage: string = 'Este campo es requerido';

    /**
     * Si es true, devuelve el objeto completo. Si es false, sólo el valor del valueField.
     * @example true (devuelve {id: 1, name: 'Item 1'})
     * @example false (devuelve 1)
     */
    @Input() returnFullObject: boolean = true;

    /**
     * Template personalizado para formatear texto usando propiedades del objeto
     * Usa la sintaxis ${nombrePropiedad} para acceder a las propiedades
     * @example "${firstName} ${lastName} (${code})"
     */
    @Input() customDisplayTemplate: string = '';

    /**
     * Si debe mostrar el valor seleccionado en el input
     * Si es false, el input queda vacío después de seleccionar
     */
    @Input() showSelectedValue: boolean = true;

    /**
     * Evento emitido cuando se selecciona un item
     * @example (selected)="onItemSelected($event)"
     */
    @Output() selected = new EventEmitter<T | null>();

    /**
     * Evento emitido cuando cambia el texto en el input
     * @example (inputChanged)="onInputChange($event)"
     */
    @Output() inputChanged = new EventEmitter<string>();

    /**
     * Evento emitido cuando se enfoca el input
     * @example (inputFocused)="onInputFocus()"
     */
    @Output() inputFocused = new EventEmitter<void>();

    /**
     * Evento emitido para buscar datos (usar para carga de datos externa)
     * @example (search)="onSearchItems($event)"
     */
    @Output() search = new EventEmitter<string>();

    /**
     * Evento emitido cuando el input pierde el foco
     * @example (inputBlurred)="onInputBlur()"
     */
    @Output() inputBlurred = new EventEmitter<void>();

    /** Referencia al elemento input */
    @ViewChild('searchInput') searchInput!: ElementRef;

    /** Referencia a la lista de sugerencias */
    @ViewChild('suggestionsList') suggestionsList!: ElementRef;

    /** Referencia al contenedor del componente */
    @ViewChild('autocompleteContainer') autocompleteContainer!: ElementRef;

    /** Texto actual en el campo de búsqueda */
    searchTerm: string = '';

    /** Lista filtrada de sugerencias que se muestra */
    filteredSuggestions: T[] = [];

    /** Índice del elemento seleccionado en el dropdown */
    selectedIndex: number = -1;

    /** Controla si el dropdown está visible */
    showDropdown: boolean = false;

    /** Subject para la búsqueda con debounce */
    private searchSubject = new Subject<string>();

    /** Suscripciones que deben liberarse en ngOnDestroy */
    private subscription: Subscription = new Subscription();

    /** Indica si se está cargando datos */
    isLoading: boolean = false;

    /** Indica si la búsqueda no encontró resultados */
    noResults: boolean = false;

    /** Indica si el componente está deshabilitado */
    disabled: boolean = false;

    /** Indica si el campo ha sido tocado (para validación) */
    touched: boolean = false;

    /** Función que se llama cuando cambia el valor (para ControlValueAccessor) */
    onChange: (value: any) => void = () => { };

    /** Función que se llama cuando se toca el campo (para ControlValueAccessor) */
    onTouched: () => void = () => { };

    constructor(
        private elementRef: ElementRef,
        private clickOutsideService: ClickOutsideService
    ) { }

    /**
     * Setter para actualizar el valor seleccionado desde fuera del componente
     * @param value El objeto a seleccionar
     */
    @Input() set selectedValue(value: T | null) {
        if (value !== this._selectedValue) {
            this._selectedValue = value;
            if (this.showSelectedValue) {
                this.searchTerm = value ? this.formatDisplayText(value) : '';
            }
        }
    }

    /**
     * Getter para obtener el valor seleccionado actual
     */
    get selectedValue(): T | null {
        return this._selectedValue;
    }

    ngOnInit() {
        // Configuración inicial
        this.filteredSuggestions = [...this.data];

        // Configurar la búsqueda con debounce
        this.subscription.add(
            this.searchSubject.pipe(
                debounceTime(this.debounceTime),
                distinctUntilChanged(),
                filter(term => term.length >= this.minChars || term.length === 0)
            ).subscribe(term => {
                this.search.emit(term);
                this.inputChanged.emit(term);

                // Actualizar los datos localmente si no se usa búsqueda externa
                if (!this.search.observed) {
                    this.filterLocalData(term);
                }
            })
        );

        // Suscribirse a los clics en el documento
        this.subscription.add(
            this.clickOutsideService.documentClick$.subscribe((event: Event) => {
                this.handleOutsideClick(event);
            })
        );
    }

    /**
     * Maneja clics fuera del componente para cerrar el dropdown
     * @param event Evento del clic
     */
    handleOutsideClick(event: Event) {
        // Si el dropdown no está visible, no hacer nada
        if (!this.showDropdown) {
            return;
        }

        // Verificar si el clic fue fuera del componente
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showDropdown = false;
            this.markAsTouched();

            // Verificar si el valor actual es válido
            const inputValue = this.searchTerm.trim();

            // Si está vacío, limpiar selección
            if (!inputValue) {
                this.clearSelection();
                return;
            }

            // Si ya hay un valor seleccionado, asegurar que coincida
            if (this._selectedValue) {
                if (this.showSelectedValue) {
                    const formattedValue = this.formatDisplayText(this._selectedValue);
                    if (this.searchTerm !== formattedValue) {
                        this.searchTerm = formattedValue;
                    }
                }
                return;
            }

            // Buscar si el texto coincide con algún item
            const matchingItem = this.findMatchingItem(inputValue);

            if (!matchingItem) {
                this.searchTerm = '';
                this.clearSelection();
            } else {
                this.selectItem(matchingItem);
            }
        }
    }

    /**
     * Filtra los datos localmente según el término de búsqueda
     * @param term Término de búsqueda
     */
    filterLocalData(term: string) {
        const lowerTerm = term.toLowerCase();
        this.filteredSuggestions = this.data.filter(item => {
            const valueFieldValue = String(item[this.valueField] || '').toLowerCase();
            const displayFieldValue = String(item[this.displayField] || '').toLowerCase();
            const formattedText = this.formatDisplayText(item).toLowerCase();

            return valueFieldValue.includes(lowerTerm) ||
                displayFieldValue.includes(lowerTerm) ||
                formattedText.includes(lowerTerm);
        });

        this.noResults = this.filteredSuggestions.length === 0;
    }

    /**
     * Busca un item que coincida exactamente con el texto
     * @param text Texto a buscar
     * @returns El item que coincide o null si no hay coincidencia
     */
    findMatchingItem(text: string): T | null {
        const lowerText = text.toLowerCase();
        const match = this.data.find(item => {
            const displayText = this.formatDisplayText(item).toLowerCase();
            return displayText === lowerText;
        });

        return match || null;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Maneja el clic en el botón personalizado
     * @param event Evento del clic
     */
    onButtonClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.buttonClick.emit();
    }

    /**
     * Implementación de ControlValueAccessor: establece el valor desde el formulario
     * @param value Valor a establecer
     */
    writeValue(value: any): void {
        if (value !== this._selectedValue) {
            this._selectedValue = value;
            if (this.showSelectedValue && value) {
                this.searchTerm = this.formatDisplayText(value);
            }
        }
    }

    /**
     * Implementación de ControlValueAccessor: registra la función para notificar cambios
     * @param fn Función a llamar cuando el valor cambia
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Implementación de ControlValueAccessor: registra la función para marcar como tocado
     * @param fn Función a llamar cuando el campo es tocado
     */
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Implementación de ControlValueAccessor: habilita/deshabilita el componente
     * @param isDisabled Si el componente debe estar deshabilitado
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Marca el campo como tocado para validación
     */
    markAsTouched() {
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }

    /**
     * Establece el estado de carga
     * @param isLoading Si está cargando datos
     */
    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    /**
     * Maneja el cambio en el input
     * @param event Evento de cambio
     */
    onSearchChange(event: any) {
        const term = event.target.value.toLowerCase();

        // Actualizar _selectedValue a null cuando el usuario empieza a escribir
        if (this._selectedValue && this.searchTerm !== this.formatDisplayText(this._selectedValue)) {
            this._selectedValue = null;
            this.onChange(this.returnValue(null));
        }

        this.searchSubject.next(term);
        this.showDropdown = true;
        this.selectedIndex = -1;
        this.markAsTouched();
    }

    /**
     * Maneja el evento de foco en el input
     */
    onFocus() {
        this.inputFocused.emit();
        if (this.showDropdownOnFocus) {
            this.showDropdown = true;

            // Mostrar todos los resultados si el campo está vacío
            if (!this.searchTerm.trim() && !this.search.observed) {
                this.filteredSuggestions = [...this.data];
            }
        }
    }

    /**
     * Maneja el evento de pérdida de foco
     */
    onBlur() {
        this.markAsTouched();

        // No cerrar el dropdown aquí - lo manejaremos con el clic fuera
        // Esto evita que se cierre cuando hacemos clic en una opción
    }

    /**
     * Maneja eventos de teclado (flechas, enter, escape)
     * @param event Evento de teclado
     */
    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowDown' && this.selectedIndex < this.filteredSuggestions.length - 1) {
            this.selectedIndex++;
            this.scrollToSelected();
            event.preventDefault();
        } else if (event.key === 'ArrowUp' && this.selectedIndex > 0) {
            this.selectedIndex--;
            this.scrollToSelected();
            event.preventDefault();
        } else if (event.key === 'Enter' && this.selectedIndex >= 0) {
            this.selectItem(this.filteredSuggestions[this.selectedIndex]);
            event.preventDefault();
        } else if (event.key === 'Escape') {
            this.showDropdown = false;
            event.preventDefault();
        } else if (event.key === 'Tab') {
            this.showDropdown = false;
        }
    }

    /**
     * Hace scroll hasta el elemento seleccionado en el dropdown
     */
    scrollToSelected() {
        setTimeout(() => {
            if (this.suggestionsList && this.selectedIndex >= 0) {
                const items = this.suggestionsList.nativeElement.querySelectorAll('.dropdown-item');
                if (items && items[this.selectedIndex]) {
                    items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
                }
            }
        });
    }

    /**
     * Selecciona un item y actualiza el valor
     * @param item Item a seleccionar
     * @returns El item seleccionado
     */
    selectItem(item: T | null): T | null {
        if (item) {
            if (this.showSelectedValue) {
                this.searchTerm = this.formatDisplayText(item);
            } else {
                this.searchTerm = '';
            }

            this._selectedValue = item;
            this.onChange(this.returnValue(item));
        } else {
            this.searchTerm = '';
            this._selectedValue = null;
            this.onChange(this.returnValue(null));
        }

        this.showDropdown = false;
        this.selected.emit(this._selectedValue);
        return this._selectedValue;
    }

    /**
     * Devuelve el valor según la configuración de returnFullObject
     * @param item Item seleccionado
     * @returns El objeto completo o solo el valor del campo valueField
     */
    returnValue(item: T | null): any {
        if (!item) return null;
        return this.returnFullObject ? item : item[this.valueField];
    }

    /**
     * Formatea el texto a mostrar para un item
     * @param item Item a formatear
     * @returns Texto formateado
     */
    formatDisplayText(item: T | null): string {
        if (!item) return '';

        // Si hay un template personalizado, usarlo
        if (this.customDisplayTemplate) {
            let result = this.customDisplayTemplate;
            const matches = this.customDisplayTemplate.match(/\$\{([^}]+)\}/g) || [];

            matches.forEach(match => {
                const propName = match.substring(2, match.length - 1) as keyof T;
                const propValue = String(item[propName] || '');
                result = result.replace(match, propValue);
            });

            return result;
        }

        // Si no hay template personalizado, usar el formato estándar
        const valueStr = String(item[this.valueField] || '');
        const displayStr = String(item[this.displayField] || '');

        return this.displayFormat
            .replace('{value}', valueStr)
            .replace('{display}', displayStr);
    }

    /**
     * Obtiene el valor (identificador) de un item
     * @param item Item del que obtener el valor
     * @returns Valor como string
     */
    getItemValue(item: T): string {
        return String(item[this.valueField] || '');
    }

    /**
     * Obtiene el texto a mostrar de un item
     * @param item Item del que obtener el texto
     * @returns Texto a mostrar
     */
    getItemDisplay(item: T): string {
        return String(item[this.displayField] || '');
    }

    /**
     * Limpia el campo de búsqueda y la selección
     */
    clearSearch() {
        this.searchTerm = '';
        this.searchSubject.next('');
        this.filteredSuggestions = [...this.data];
        this.showDropdown = true;
        this.noResults = false;
        this.clearSelection();
        setTimeout(() => this.searchInput.nativeElement.focus(), 0);
    }

    /**
     * Limpia la selección actual
     * @returns null
     */
    clearSelection() {
        if (this._selectedValue !== null) {
            this._selectedValue = null;
            this.onChange(null);
            this.selected.emit(null);
        }
        return null;
    }

    /**
     * Actualiza los datos filtrados (útil cuando se cargan datos de forma asíncrona)
     * @param data Nuevos datos filtrados
     */
    updateFilteredData(data: T[]) {
        this.filteredSuggestions = data;
        this.noResults = this.filteredSuggestions.length === 0;
    }
}