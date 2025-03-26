import { AfterViewInit, Directive, ElementRef, Renderer2 } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[tablesorter]'
})
export class TablesorterDirective implements AfterViewInit {

    private headers: HTMLElement[] = [];
    private sortDirections: { [key: number]: 'asc' | 'desc' } = {};
    private currentSortColumn: number | null = null;

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
            this.renderer.addClass(header, 'sortable');

            this.sortDirections[index] = 'asc';

            header.addEventListener('click', () => {
                this.handleHeaderClick(index);
            });
        });
    }

    private addTableClasses() {
        const classes = ['table', 'table-striped', 'table-bordered', 'master-hand', 'centerText', 'tablesorter', 'tablesorter-blue'];
        classes.forEach(cls => this.renderer.addClass(this.el.nativeElement, cls));
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
}
