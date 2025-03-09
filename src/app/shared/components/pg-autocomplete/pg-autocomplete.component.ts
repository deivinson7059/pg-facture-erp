import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-pg-autocomplete',
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './pg-autocomplete.component.html',
  styleUrl: './pg-autocomplete.component.scss'
})
export class PgAutocompleteComponent<T extends object> implements OnInit, OnDestroy {
  // Valor seleccionado actualmente
  private _selectedValue: T | null = null;
  
  @Input() data: T[] = []; // Datos de la lista genérica
  @Input() valueField: keyof T = 'code' as keyof T; // Campo a usar como valor (código)
  @Input() displayField: keyof T = 'name' as keyof T; // Campo a mostrar (nombre)
  @Input() displayFormat: string = '{value} - {display}'; // Formato para mostrar el texto
  @Input() placeholder: string = 'Seleccionar opción'; // Placeholder
  @Input() debounceTime: number = 200; // Tiempo en ms para evitar búsquedas muy frecuentes
  @Input() minChars: number = 1; // Mínimo de caracteres para buscar
  @Input() itemTemplate?: TemplateRef<any>; // Template personalizado para items
  @Input() notFoundTemplate?: TemplateRef<any>; // Template personalizado para "no encontrado"
  @Input() loadingTemplate?: TemplateRef<any>; // Template personalizado para "cargando"
  @Input() showDropdownOnFocus: boolean = true; // Mostrar dropdown al enfocar
  
  @Output() selected = new EventEmitter<T | null>();
  @Output() inputChanged = new EventEmitter<string>();
  @Output() inputFocused = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>(); // Para búsqueda en tiempo real
  @Output() inputBlurred = new EventEmitter<void>(); // Evento para cuando pierde el foco
  
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('suggestionsList') suggestionsList!: ElementRef;
  
  searchTerm: string = '';
  filteredSuggestions: T[] = [];
  selectedIndex: number = -1;
  showDropdown: boolean = false;
  
  // Para la búsqueda optimizada
  private searchSubject = new Subject<string>();
  private subscription: Subscription = new Subscription();
  
  // Estado del componente
  isLoading: boolean = false;
  noResults: boolean = false;
  
  // Actualizar el valor desde fuera del componente
  @Input() set selectedValue(value: T | null) {
    if (value !== this._selectedValue) {
      this._selectedValue = value;
      this.searchTerm = value ? this.formatDisplayText(value) : '';
    }
  }
  
  get selectedValue(): T | null {
    return this._selectedValue;
  }
  
  ngOnInit() {
    this.filteredSuggestions = [...this.data];
    
    // Configurar la búsqueda optimizada con debounce
    this.subscription.add(
      this.searchSubject.pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        filter(term => term.length >= this.minChars || term.length === 0)
      ).subscribe(term => {
        this.search.emit(term);
        this.inputChanged.emit(term);
      })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  // Método para actualizar el estado de carga
  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
  
  onSearchChange(event: any) {
    const term = event.target.value.toLowerCase();
    
    // Actualizar _selectedValue a null cuando el usuario empieza a escribir
    // Esto evita mantener una selección incorrecta
    if (this._selectedValue && this.searchTerm !== this.formatDisplayText(this._selectedValue)) {
      this._selectedValue = null;
    }
    
    if (term.length >= this.minChars || term.length === 0) {
      this.searchSubject.next(term);
      
      // Actualizar los datos localmente si no se usa la búsqueda externa
      if (!this.search.observed) {
        this.filteredSuggestions = this.data.filter(item => {
          const valueFieldValue = String(item[this.valueField] || '').toLowerCase();
          const displayFieldValue = String(item[this.displayField] || '').toLowerCase();
          
          return valueFieldValue.includes(term) || displayFieldValue.includes(term);
        });
        
        this.noResults = this.filteredSuggestions.length === 0;
      }
    }
    
    this.showDropdown = true;
    this.selectedIndex = -1;
  }
  
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
  
  // Método para manejar cuando el input pierde el foco
  onBlur() {
    // Usar un timeout más largo para asegurar que eventos de clic se procesen primero
    setTimeout(() => {
      // Si el dropdown está visible y el usuario hizo clic en una opción, no hacer nada
      // Esta comprobación se hace en hideDropdown, que se llama por el clic antes que onBlur
      if (!this.showDropdown) {
        return;
      }
      
      // Verificar si lo que está escrito corresponde a un elemento seleccionado
      const inputValue = this.searchTerm.trim();
      
      // Si está vacío, emitir null
      if (!inputValue) {
        this.clearSelection();
        return;
      }
      
      // Si ya tiene un valor seleccionado, mantenerlo
      if (this._selectedValue) {
        // Asegurarse de que el texto en el input coincida con el formato del item seleccionado
        const formattedValue = this.formatDisplayText(this._selectedValue);
        if (this.searchTerm !== formattedValue) {
          this.searchTerm = formattedValue;
        }
        return;
      }
      
      // Buscar si el texto ingresado coincide exactamente con algún item (ignorando mayúsculas/minúsculas)
      const matchingItem = this.data.find(item => {
        const displayText = this.formatDisplayText(item).toLowerCase();
        return displayText === inputValue.toLowerCase();
      });
      
      // Si no hay coincidencia exacta, limpiar el campo
      if (!matchingItem) {
        this.searchTerm = '';
        this.clearSelection();
      } else {
        // Si hay coincidencia exacta, seleccionar ese item
        this.selectItem(matchingItem);
      }
      
      // Ocultar el dropdown
      this.showDropdown = false;
      this.inputBlurred.emit();
    }, 300); // Aumentar el timeout para asegurar que se complete la selección por clic

   // this.showDropdown = false;
  }
  
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
      this.clearSelection();
      event.preventDefault();
    } else if (event.key === 'Tab') {
      this.showDropdown = false;
    }
  }
  
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
  
  selectItem(item: T | null): T | null {
    if (item) {
      this.searchTerm = this.formatDisplayText(item);
      this._selectedValue = item;
    } else {
      this.searchTerm = '';
      this._selectedValue = null;
    }
    
    this.showDropdown = false;
    this.selected.emit(this._selectedValue as any);
    return this._selectedValue;
  }
  
  formatDisplayText(item: T | null): string {
    if (!item) return '';
    
    const valueStr = String(item[this.valueField] || '');
    const displayStr = String(item[this.displayField] || '');
    
    return this.displayFormat
      .replace('{value}', valueStr)
      .replace('{display}', displayStr);
  }
  
  getItemValue(item: T): string {
    return String(item[this.valueField] || '');
  }
  
  getItemDisplay(item: T): string {
    return String(item[this.displayField] || '');
  }
  
  hideDropdown(event: any) {
    // Verificar si el clic fue fuera del componente
    const isOutsideInput = !this.searchInput?.nativeElement.contains(event.target);
    const isOutsideList = !this.suggestionsList?.nativeElement || 
                          !this.suggestionsList.nativeElement.contains(event.target);
    
    if (isOutsideInput && isOutsideList) {
      this.showDropdown = false;
      
      // Si el clic fue en otro elemento de la página (no en una sugerencia)
      // verificar si el valor actual es válido
      const inputValue = this.searchTerm.trim();
      
      // Si no hay selección actual pero hay texto, realizar la misma validación que en onBlur
      if (!this._selectedValue && inputValue) {
        const matchingItem = this.data.find(item => {
          const displayText = this.formatDisplayText(item).toLowerCase();
          return displayText === inputValue.toLowerCase();
        });
        
        if (!matchingItem) {
          this.searchTerm = '';
          this.clearSelection();
        } else {
          this.selectItem(matchingItem);
        }
      }
    }
  }
  
  // Botón de limpieza para el X
  clearSearch() {
    this.searchTerm = '';
    this.searchSubject.next('');
    this.filteredSuggestions = [...this.data];
    this.showDropdown = true;
    this.noResults = false;
    this.clearSelection();
    setTimeout(() => this.searchInput.nativeElement.focus(), 0);
  }
  
  // Método para limpiar la selección y emitir null
  clearSelection() {
    if (this._selectedValue !== null) {
      this._selectedValue = null;
      this.selected.emit(null);
    }
    return null;
  }
  
  // Actualizar los datos filtrados (para usar con búsqueda externa)
  updateFilteredData(data: T[]) {
    this.filteredSuggestions = data;
    this.noResults = this.filteredSuggestions.length === 0;
  }
}