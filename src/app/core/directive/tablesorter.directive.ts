import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[tablesorter]'
})
export class TablesorterDirective implements AfterViewInit {
    @Input() filter: boolean = true;
    @Input() sticky: boolean = false;

    private headers: HTMLElement[] = [];
    private sortDirections: { [key: number]: 'asc' | 'desc' } = {};
    private currentSortColumn: number | null = null;
    private filterInputs: HTMLInputElement[] = [];

    // Expresiones regulares utilizadas en el filtrado
    private regex = {
        regex: /^\/((?:\\\/|[^\/])+)\/([migyu]{0,5})?$/,
        child: /tablesorter-childRow/,
        filtered: /filtered/,
        type: /undefined|number/,
        exact: /(^[\"\'=]+)|([\"\'=]+$)/g,
        operators: /[<>=]=?/g,
        operTest: /^[<>]=?/,
        gtTest: />/,
        gteTest: />=/,
        ltTest: /</,
        lteTest: /<=/,
        notTest: /^\!/,
        query: '(q|query)',
        wild01: /\?/g,
        wild0More: /\*/g,
        wildOrTest: /[\?\*\|]/,
        wildTest: /\?\*/,
        fuzzyTest: /^~/,
        andTest: /\s+(&|&&)\s+/i,
        andSplit: /(?:\s+(?:&|&&)\s+)/gi,
        orTest: /(\||\s+or\s+)/i,
        orSplit: /(?:\||\s+or\s+)/gi,
        toTest: /\s+(-|to|hasta)\s+/i,
        toSplit: /(?:\s+(?:-|to|hasta)\s+)/gi,
        quote: /\"/g,
        isNeg1: /(>=?\s*-\d)/,
        isNeg2: /(<=?\s*\d)/,
        alreadyFiltered: /(\s+(-|to|hasta)\s+|\s+(or|y)\s+|\|)/i,
    };

    constructor(private el: ElementRef, private renderer: Renderer2) { }
    ngAfterViewInit() {
        setTimeout(() => {
            this.initializeTableSorter();
        });
    }

    private initializeTableSorter() {
        this.addTableClasses();
        const headerRow = this.el.nativeElement.querySelector('thead tr');
        if (!headerRow) return;

        this.headers = Array.from(headerRow.querySelectorAll('th'));

        this.headers.forEach((header, index) => {
            this.renderer.setStyle(header, 'cursor', 'pointer');
            this.renderer.addClass(header, 'tablesorter-header');
            this.renderer.addClass(header, 'sortable');

            this.sortDirections[index] = 'asc';

            header.addEventListener('click', () => {
                this.handleHeaderClick(index);
            });
        });

        if (this.filter) {
            this.addFilterRow();
        }
        // Aplicar la clase sticky-thead si corresponde
        this.applyStickyClass();
    }
    // Método para manejar el cambio de la propiedad sticky
    private applyStickyClass() {
        const thead = this.el.nativeElement.querySelector('thead');
        if (!thead) return;

        if (this.sticky) {
            this.renderer.addClass(thead, 'sticky-thead');
        } else {
            this.renderer.removeClass(thead, 'sticky-thead');
        }
    }

    private addTableClasses() {
        const classes = ['table', 'table-striped', 'table-bordered', 'master-hand', 'centerText', 'tablesorter', 'tablesorter-blue'];
        classes.forEach(cls => this.renderer.addClass(this.el.nativeElement, cls));
    }
    private addFilterRow() {
        const thead = this.el.nativeElement.querySelector('thead');
        if (!thead) return;

        // Crear fila para el filtro
        const filterRow = this.renderer.createElement('tr');
        this.renderer.setAttribute(filterRow, 'role', 'search');
        this.renderer.addClass(filterRow, 'tablesorter-filter-row');
        this.renderer.addClass(filterRow, 'tablesorter-ignoreRow');

        // Crear un campo de búsqueda para cada columna
        this.headers.forEach((header, columnIndex) => {
            const filterCell = this.renderer.createElement('td');
            this.renderer.setAttribute(filterCell, 'data-column', columnIndex.toString());

            const filterInput = this.renderer.createElement('input');
            this.renderer.setAttribute(filterInput, 'type', 'search');
            this.renderer.setAttribute(filterInput, 'placeholder', '');
            this.renderer.addClass(filterInput, 'tablesorter-filter');
            this.renderer.setAttribute(filterInput, 'data-column', columnIndex.toString());

            // Obtener el texto del encabezado para el aria-label
            const headerText = header.textContent?.trim() || '';
            const ariaLabel = `Filter "${headerText}" column by...`;
            this.renderer.setAttribute(filterInput, 'aria-label', ariaLabel);

            // Añadir timestamp para data-lastsearchtime 
            this.renderer.setAttribute(filterInput, 'data-lastsearchtime', Date.now().toString());

            // Añadir evento para filtrar la tabla cuando se escriba
            filterInput.addEventListener('input', () => {
                this.filterColumnTable(columnIndex, filterInput.value);
            });

            // Añadir evento para filtrar cuando se presione Enter
            filterInput.addEventListener('keydown', (event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                    this.filterColumnTable(columnIndex, filterInput.value);
                }
            });

            // Guardar referencia al input para uso posterior
            this.filterInputs.push(filterInput);

            // Ensamblar elementos
            this.renderer.appendChild(filterCell, filterInput);
            this.renderer.appendChild(filterRow, filterCell);
        });

        // Insertar la fila de filtro después de la primera fila de thead
        const firstRow = thead.querySelector('tr');
        this.renderer.insertBefore(thead, filterRow, firstRow.nextSibling);
    }
    private filterColumnTable(columnIndex: number, searchTerm: string) {
        const tbody = this.el.nativeElement.querySelector('tbody');
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));

        // Actualizar el timestamp de búsqueda
        const filterInput = this.el.nativeElement.querySelector(`input[data-column="${columnIndex}"]`);
        if (filterInput) {
            this.renderer.setAttribute(filterInput, 'data-lastsearchtime', Date.now().toString());
        }

        // Si no hay término de búsqueda, mostrar todas las filas
        if (!searchTerm.trim()) {
            rows.forEach((row: HTMLElement | any) => {
                this.renderer.removeStyle(row, 'display');
            });
            return;
        }

        rows.forEach((row: HTMLElement | any) => {
            // Obtener el contenido de la celda en la columna específica
            const cell = row.cells[columnIndex];
            if (!cell) return;

            const cellText = cell.textContent?.trim() || '';
            const isVisible = this.matchesFilter(cellText, searchTerm);

            // Si ya está oculta por otro filtro, mantenerla oculta
            const currentDisplay = row.style.display;
            if (currentDisplay === 'none' && !isVisible) {
                return;
            }

            this.renderer.setStyle(row, 'display', isVisible ? '' : 'none');
        });
    }

    private filterTable() {
        const tbody = this.el.nativeElement.querySelector('tbody');
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        const filterInputs = this.el.nativeElement.querySelectorAll('.tablesorter-filter');

        // Restablecer la visibilidad de todas las filas
        rows.forEach((row: HTMLElement | any) => {
            this.renderer.removeStyle(row, 'display');
        });

        // Aplicar cada filtro en secuencia
        Array.from(filterInputs).forEach((input: HTMLInputElement | any) => {
            const columnIndex = parseInt(input.getAttribute('data-column') || '0', 10);
            const searchTerm = input.value.trim();

            if (searchTerm) {
                this.filterColumnTable(columnIndex, searchTerm);
            }
        });
    }
    private handleHeaderClick(columnIndex: number) {
        if (this.currentSortColumn === columnIndex) {
            this.sortDirections[columnIndex] = this.sortDirections[columnIndex] === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSortColumn = columnIndex;
        }

        this.sortTable(columnIndex);
    }

    private sortTable(columnIndex: number) {
        const tbody = this.el.nativeElement.querySelector('tbody');
        if (!tbody) return;

        this.updateSortIndicators(columnIndex);

        const rows: HTMLElement[] = Array.from(tbody.querySelectorAll('tr'));
        const sortedRows = this.sortRows(rows, columnIndex);
        this.reorderRows(tbody, sortedRows);
    }

    private updateSortIndicators(columnIndex: number) {
        this.headers.forEach(header => {
            this.renderer.removeClass(header, 'sort-asc');
            this.renderer.removeClass(header, 'sort-desc');
        });

        this.renderer.addClass(
            this.headers[columnIndex],
            this.sortDirections[columnIndex] === 'asc' ? 'sort-asc' : 'sort-desc'
        );
    }

    private sortRows(rows: HTMLElement[] | any[], columnIndex: number): HTMLElement[] {
        const direction = this.sortDirections[columnIndex];

        return [...rows].sort((a, b) => {
            const cellA = a.cells[columnIndex];
            const cellB = b.cells[columnIndex];

            if (!cellA || !cellB) return 0;

            const valueA = cellA.textContent?.trim() || '';
            const valueB = cellB.textContent?.trim() || '';

            const numA = this.parseNumber(valueA);
            const numB = this.parseNumber(valueB);

            if (numA !== null && numB !== null) {
                return direction === 'asc' ? numA - numB : numB - numA;
            }

            return direction === 'asc'
                ? valueA.localeCompare(valueB, 'es-CO')
                : valueB.localeCompare(valueA, 'es-CO');
        });
    }

    private reorderRows(tbody: HTMLElement, sortedRows: HTMLElement[]) {
        const fragment = document.createDocumentFragment();
        sortedRows.forEach(row => fragment.appendChild(row));
        tbody.appendChild(fragment);
    }

    private parseNumber(value: string): number | null {
        const cleaned = value.replace(/[$%,\s]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }
    private matchesFilter(cellText: string, searchTerm: string): boolean {
        const cellValue = cellText.toLowerCase();
        const term = searchTerm.trim();

        // Variables para almacenar datos intermedios
        const data = {
            filter: searchTerm,
            iFilter: searchTerm.toLowerCase(),
            exact: cellText,
            iExact: cellValue,
            isMatch: true, // Por defecto usamos coincidencia parcial (no exacta)
            cache: cellText,
            anyMatch: false
        };

        // Caso 1: Consulta vacía siempre coincide
        if (term === '') {
            return true;
        }

        // Caso 2: Expresión regular - /texto/i
        if (this.regex.regex.test(term)) {
            try {
                const matches: any = this.regex.regex.exec(term);
                const pattern = matches[1];
                const flags = matches[2] || '';
                const regex = new RegExp(pattern, flags);
                return regex.test(cellValue);
            } catch (e) {
                // Si hay un error en la expresión regular, realizar búsqueda simple
                return cellValue.includes(term.toLowerCase());
            }
        }

        // Caso 3: Búsqueda negada - !texto
        if (this.regex.notTest.test(term)) {
            const filterText = term.replace('!', '').toLowerCase();
            // si no hay texto después de ! mostrar todo
            if (filterText === '') {
                return true;
            }
            // Si es búsqueda exacta (entre comillas)
            if (this.regex.exact.test(filterText)) {
                const txt = filterText.replace(this.regex.exact, '');
                return txt === '' ? true : txt !== cellValue;
            } else {
                // Búsqueda de subcadena
                const indx = cellValue.indexOf(filterText.trim());
                return indx < 0;
            }
        }
        // Caso 4: Búsqueda exacta (entre comillas o con =) - "texto" o =texto
        if (this.regex.exact.test(term)) {
            const txt = term.replace(this.regex.exact, '');
            return txt === cellValue;
        }

        // Caso 5: Operadores de comparación (>, <, >=, <=)
        if (this.regex.operTest.test(term)) {
            if (cellValue === '') {
                return false; // cadenas vacías no se comparan numéricamente
            }
            const matches = term.match(this.regex.operators);
            if (matches) {
                const operator = matches[0];
                const value = term.replace(this.regex.operators, '').trim();

                // Intentar convertir a números para comparación numérica
                const cellNum = this.parseNumber(cellValue);
                const valueNum = this.parseNumber(value);

                if (cellNum !== null && valueNum !== null) {
                    if (this.regex.gteTest.test(term)) {
                        return cellNum >= valueNum;
                    } else if (this.regex.gtTest.test(term)) {
                        return cellNum > valueNum;
                    } else if (this.regex.lteTest.test(term)) {
                        return cellNum <= valueNum;
                    } else if (this.regex.ltTest.test(term)) {
                        return cellNum < valueNum;
                    }
                }

                // Si el valor es cadena vacía después de quitar el operador, mostrar todo
                if (value === '') {
                    return true;
                }
            }
        }
        // Caso 6: Rango - valor1 - valor2 o valor1 a valor2
        if (this.regex.toTest.test(term)) {
            const range = term.split(this.regex.toSplit);
            if (range.length >= 2) {
                let range1 = this.parseNumber(range[0].replace(/[^\d.-]/g, ''));
                let range2 = this.parseNumber(range[1].replace(/[^\d.-]/g, ''));
                const cellNum = this.parseNumber(cellValue);

                // Intercambiar si range1 > range2
                if (range1 !== null && range2 !== null && range1 > range2) {
                    const temp = range1;
                    range1 = range2;
                    range2 = temp;
                }

                if (cellNum !== null && range1 !== null && range2 !== null) {
                    return (cellNum >= range1 && cellNum <= range2);
                } else if (range1 === null || range2 === null) {
                    return true; // Si uno de los rangos no es un número, mostrar todo
                }
            }
        }
        // Caso 7: Búsqueda difusa - ~texto (encuentra texto incluso con caracteres en medio)
        if (this.regex.fuzzyTest.test(term)) {
            const pattern = term.slice(1);
            let patternIndex = 0;
            // Verificar si cada caracter del patrón aparece en orden en el texto
            for (let i = 0; i < cellValue.length && patternIndex < pattern.length; i++) {
                if (cellValue[i] === pattern[patternIndex]) {
                    patternIndex++;
                }
            }
            return patternIndex === pattern.length;
        }

        // Caso 8: Comodines - * (cualquier cantidad de caracteres) y ? (un carácter)
        if (this.regex.wildOrTest.test(term)) {
            try {
                const pattern = term
                    .replace(this.regex.wild0More, '\\S*')
                    .replace(this.regex.wild01, '\\S{1}')
                    .replace(/[-[\]{}()+.,\\^$|#\s]/g, '\\$&');

                const regex = new RegExp(data.isMatch ? pattern : `^${pattern}$`, 'i');
                return regex.test(cellValue);
            } catch (e) {
                // Si hay un error, realizar búsqueda simple
                return cellValue.includes(term.toLowerCase());
            }
        }
        // Caso 9: Búsqueda AND - palabra1 && palabra2
        if (this.regex.andTest.test(term)) {
            const filters = term.split(this.regex.andSplit);
            let result = true;

            for (let i = 0; i < filters.length; i++) {
                const filterTerm = filters[i].trim();
                // Procesar cada término de forma recursiva
                const subResult = this.matchesFilter(cellText, filterTerm);
                result = result && subResult;
                if (!result) break; // Corto circuito para AND
            }
            return result;
        }

        // Caso 10: Búsqueda OR - palabra1 | palabra2 o palabra1 o palabra2
        if (this.regex.orTest.test(term)) {
            const filters = term.split(this.regex.orSplit);
            let result = false;

            for (let i = 0; i < filters.length; i++) {
                const filterTerm = filters[i].trim();
                if (filterTerm === '') continue;
                // Procesar cada término de forma recursiva
                const subResult = this.matchesFilter(cellText, filterTerm);
                result = result || subResult;
                if (result) break; // Corto circuito para OR
            }
            return result;
        }

        // Caso 11: Búsqueda simple predeterminada (parcial)
        return cellValue.includes(term.toLowerCase());
    }
}