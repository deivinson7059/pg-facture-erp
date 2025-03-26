import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UtilsPaginationComponent } from '../utils-pagination/utils-pagination.component';
import { UtilsService, UtilsSpinnerService } from '@core/service';
import { DownloadType, LenguageTable, TableSorter } from '@core/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsCustomCurrencyPipe, UtilsPaginatePipe } from '@core';

@Component({
    selector: 'app-utils-ui-table-sorter',
    imports: [CommonModule, FormsModule, UtilsPaginationComponent, UtilsPaginatePipe, UtilsCustomCurrencyPipe],
    templateUrl: './utils-ui-table-sorter.component.html',
    styleUrl: './utils-ui-table-sorter.component.scss'
})
export class UtilsUiTableSorterComponent implements OnInit, OnChanges {
    constructor(
        private utilitiesservice: UtilsService,
        private spinner: UtilsSpinnerService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        //vaciamos los filtros
        this.tableConfig.columns.forEach((column: any) => {
            column.filter = '';
        });
    }
    @Input() darkMode: boolean = false;
    @Input() dataFilter: any[] = [];
    @Input() tableConfig: TableSorter = {
        data: [],
        dataFilter: [],
        pageOfItems: [],
        textDownload: 'Download',
        formatDownload: 'xlsx',
        classDownload: 'btn btn-primary',
        iconDownload: 'fa fa-download',
        downloadOption: false,
        downloadText: 'Download',
        isPaginate: true,
        isFilter: true,
        sorting: true,
        buttonsDownload: true,
        buttonsInitial: true,
        pageSize: 8,
        cssClass: '',
        buttons: [],
        columns: [
            {
                title: '',
                class: '',
                name: '',
                filter: '',
                checkColumn: false,
                format: {
                    type: 'text',
                    format: '',
                },
            },
        ],
        columnSelector: false,
        lenguage: 'es',
        sticky: true,
    };

    lenguagetable: LenguageTable = {
        buttonName: '',
        buttonSelected: '',
        buttonFilter: '',
        buttonAll: '',
        nextLabel: '',
        previousLabel: '',
        colunSelector: '',
        til_1: '',
        til_2: '',
        til_3: '',
        til_4: '',
        options: '',
        tr_info: '',
    };

    sortProperty: string = this.tableConfig.columns[0].name || '';
    sortOrder = -1;

    page: number = 1;
    p: number = 1;
    totalPage: number = 0;
    _ItemsPage: number = 0;

    checkColumnsAuto: boolean = true;
    checkColumnsOption: boolean = true;
    downloadOption: boolean = false;

    public get ItemsPage(): number {
        this.totalPage = this.tableConfig.data.length;
        let count = this.tableConfig.pageSize || 8 * this.page;
        if (count > this.totalPage) {
            return this.tableConfig.pageSize! - Math.abs(this.totalPage - count);
        } else {
            return this.tableConfig.pageSize!;
        }
    }

    ngOnInit(): void {
        this.sortOrder = -1;
        this.tableConfig.pageOfItems = this.tableConfig.data;
        this._ItemsPage = this.ItemsPage;
        if (this.tableConfig.lenguage === 'en') {
            this.lenguagetable.buttonName = 'Download Data';
            this.lenguagetable.buttonSelected = 'Download Selection';
            this.lenguagetable.buttonFilter = 'Download Filter';
            this.lenguagetable.buttonAll = 'Download all';
            this.lenguagetable.nextLabel = 'Next';
            this.lenguagetable.previousLabel = 'Previous';
            this.lenguagetable.colunSelector = 'Select Column';
            this.lenguagetable.til_1 = 'showing';
            this.lenguagetable.til_2 = 'of';
            this.lenguagetable.til_3 = 'on';
            this.lenguagetable.til_4 = 'page';
            this.lenguagetable.options = 'OPTIONS';
        } else {
            this.lenguagetable.buttonName = 'Descargar Datos';
            this.lenguagetable.buttonSelected = 'Descargar Selección';
            this.lenguagetable.buttonFilter = 'Descargar Filtro';
            this.lenguagetable.buttonAll = 'Descargar Todo';
            this.lenguagetable.nextLabel = 'Siguiente';
            this.lenguagetable.previousLabel = 'Anterior';
            this.lenguagetable.colunSelector = 'Seleccionar Columna';
            this.lenguagetable.til_1 = 'mostrando';
            this.lenguagetable.til_2 = 'de';
            this.lenguagetable.til_3 = 'en';
            this.lenguagetable.til_4 = 'página';
            this.lenguagetable.options = 'OPCIONES';
        }
    }
    download(type: DownloadType = 'all') {
        this.spinner.show();

        let _dataDownload: any[] = [];

        if (type === 'all') {
            _dataDownload = this.tableConfig.dataFilter;
        } else if (type === 'filter') {
            let _dataFilter: any[] = this.tableConfig.data;
            _dataFilter.forEach((item: any) => {
                let _item: any = {};
                this.tableConfig.columns.forEach((column: any) => {
                    if (column.checkColumn) {
                        _item[column.name] = item[column.name];
                    }
                });
                _dataDownload.push(_item);
            });
        } else {
            //recorremos la data en las columnas que esten seleccionadas
            this.tableConfig.pageOfItems!.forEach((item: any) => {
                let _item: any = {};
                this.tableConfig.columns.forEach((column: any) => {
                    if (column.checkColumn) {
                        _item[column.name] = item[column.name];
                    }
                });
                _dataDownload.push(_item);
            });
        }
        this.utilitiesservice.exportAsExcelFile(
            _dataDownload,
            this.tableConfig.textDownload || 'download',
            this.tableConfig.formatDownload || 'xlsx'
        );
        this.spinner.hide();
    }

    sortBy(property: string) {
        this.sortOrder = property === this.sortProperty ? this.sortOrder * -1 : 1;
        this.sortProperty = property;
        this.tableConfig.data = [
            ...this.tableConfig.data.sort((a: any, b: any) => {
                // sort comparison function
                let result = 0;
                if (a[property] < b[property]) {
                    result = -1;
                }
                if (a[property] > b[property]) {
                    result = 1;
                }
                return result * this.sortOrder;
            }),
        ];
    }

    sortIcon(property: string) {
        if (property === this.sortProperty) {
            return this.sortOrder === 1 ? '☝️' : '👇';
        }
        return '';
    }
    // Método para filtrar las columnas
    filterByColumns<T>(e: any) {
        // Restablecer los datos de la tabla a su estado original sin filtrar
        this.tableConfig.data = this.tableConfig.dataFilter;

        // Crear una copia de los datos para trabajar con ellos sin mutar el original
        let _data: T[] = this.tableConfig.dataFilter.slice();

        // Filtrar las columnas que tienen algún valor en el filtro
        let _filterEmpty = this.tableConfig.columns.filter(
            (column: any) => column.filter && column.filter.trim() !== ''
        );

        // Si no hay filtros aplicados, devolver los datos originales
        if (_filterEmpty.length === 0) {
            this.tableConfig.data = this.tableConfig.dataFilter;
        } else {
            // Recorrer cada columna con un filtro aplicado
            this.tableConfig.columns.forEach((column: any) => {
                if (column.filter && column.filter.trim() !== '') {
                    let filterValue = column.filter.trim().toLowerCase();

                    // Aplicar el filtro a los datos
                    _data = _data.filter((item: any) => {
                        let itemValue = item[column.name].toString().toLowerCase();
                        return this.applyFilter(itemValue, filterValue);
                    });
                }
            });

            // Actualizar los datos de la tabla con los datos filtrados
            this.tableConfig.data = _data;
        }

        // Reiniciar la paginación
        this.page = 1;
        this.p = 1;
    }

    // Método para aplicar el filtro a un valor de ítem
    applyFilter(itemValue: string, filterValue: string): boolean {
        // Definición de expresiones regulares para distintos tipos de filtrado
        const regex = {
            regex: /^\/((?:\\\/|[^\/])+)\/([migyu]{0,5})?$/, // regex para detectar expresiones regulares
            child: /tablesorter-childRow/, // clase para las filas hijas de la tabla
            filtered: /filtered/, // clase para las filas filtradas (ocultas)
            type: /undefined|number/, // tipos a verificar
            exact: /(^[\"\'=]+)|([\"\'=]+$)/g, // coincidencia exacta (permitir '==')
            operators: /[<>=]=?/g, // operadores de comparación
            query: '(q|query)', // reemplazar consultas de filtro
            wild01: /\?/g, // comodín de coincidencia 0 o 1
            wild0More: /\*/g, // comodín de coincidencia 0 o más
            quote: /\"/g, // comillas
            isNeg1: /(>=?\s*-\d)/, // verificar negativos 1
            isNeg2: /(<=?\s*\d)/, // verificar negativos 2
        };

        let exactMatch = false;

        // Detectar si el término de búsqueda está entre comillas dobles
        if (regex.exact.test(filterValue)) {
            exactMatch = true;
            filterValue = filterValue.replace(regex.exact, '');
        }

        // Si es una coincidencia exacta
        if (exactMatch) {
            return itemValue === filterValue;
        }

        // Detectar si el filtro contiene un operador de comparación (>, <, >=, <=, ==)
        if (regex.operators.test(filterValue)) {
            let operatorMatch = filterValue.match(regex.operators);
            if (operatorMatch) {
                let operator = operatorMatch[0];
                let value = filterValue.split(operator)[1].trim();

                // Convertir el valor del filtro a número o fecha
                let itemNumber = parseFloat(itemValue);
                let filterNumber = parseFloat(value);
                let itemDate = new Date(itemValue);
                let filterDate = new Date(value);

                // Verificar si los valores son numéricos antes de comparar
                if (!isNaN(itemNumber) && !isNaN(filterNumber)) {
                    switch (operator) {
                        case '>':
                            return itemNumber > filterNumber;
                        case '<':
                            return itemNumber < filterNumber;
                        case '>=':
                            return itemNumber >= filterNumber;
                        case '<=':
                            return itemNumber <= filterNumber;
                        case '==':
                            return itemNumber == filterNumber;
                    }
                }

                // Verificar si los valores son fechas válidas antes de comparar
                if (!isNaN(itemDate.getTime()) && !isNaN(filterDate.getTime())) {
                    switch (operator) {
                        case '>':
                            return itemDate > filterDate;
                        case '<':
                            return itemDate < filterDate;
                        case '>=':
                            return itemDate >= filterDate;
                        case '<=':
                            return itemDate <= filterDate;
                        case '==':
                            return itemDate.getTime() === filterDate.getTime();
                    }
                }
            }
        }

        // Filtro de comodines
        let wildcard = filterValue
            .replace(regex.wild01, '.')
            .replace(regex.wild0More, '.*');
        let wildcardRegex = new RegExp(wildcard, 'i');
        return wildcardRegex.test(itemValue);
    }
    // Método para filtrar las columnas old
    filterByColumns_old<T>() {
        // Inicialmente, restablecemos los datos de la tabla a su estado original sin filtrar.
        this.tableConfig.data = this.tableConfig.dataFilter;

        // Creamos una copia de los datos para trabajar con ellos sin mutar el original.
        let _data: T[] = this.tableConfig.dataFilter.slice();

        // Filtramos las columnas que tienen algún valor en el filtro.
        let _filterEmpty = this.tableConfig.columns.filter(
            (column: any) => column.filter && column.filter.trim() !== ''
        );

        // Si no hay filtros aplicados, devolvemos los datos originales.
        if (_filterEmpty.length === 0) {
            this.tableConfig.data = this.tableConfig.dataFilter;
        } else {
            // Recorremos cada columna con un filtro aplicado.
            this.tableConfig.columns.forEach((column: any) => {
                if (column.filter && column.filter.trim() !== '') {
                    let filterValue = column.filter.trim().toLowerCase();

                    // Detectamos si el filtro contiene un operador de comparación (>, <, >=, <=, =).
                    let filterOperatorMatch = filterValue.match(/(>=|<=|>|<|=)/);
                    if (filterOperatorMatch) {
                        let operator = filterOperatorMatch[0];
                        let value = filterValue.split(operator)[1].trim();

                        // Convertimos el valor filtrado y los valores de la columna a números si es posible
                        if (!isNaN(parseFloat(value))) {
                            let filterNumber = parseFloat(value);
                            _data = _data.filter((item: any) => {
                                let itemValue = parseFloat(item[column.name]);

                                if (isNaN(itemValue)) return false; // Si el valor del ítem no es un número, no lo incluimos
                                switch (operator) {
                                    case '>':
                                        return itemValue > filterNumber;
                                    case '<':
                                        return itemValue < filterNumber;
                                    case '>=':
                                        return itemValue >= filterNumber;
                                    case '<=':
                                        return itemValue <= filterNumber;
                                    case '=':
                                        return itemValue === filterNumber;
                                    default:
                                        return false;
                                }
                            });
                        } else if (!isNaN(Date.parse(value))) {
                            // Si el valor del filtro es una fecha
                            let filterDate = Date.parse(value);
                            _data = _data.filter((item: any) => {
                                let itemDate = Date.parse(item[column.name]);
                                if (isNaN(itemDate)) return false; // Si el valor del ítem no es una fecha, no lo incluimos
                                switch (operator) {
                                    case '>':
                                        return itemDate > filterDate;
                                    case '<':
                                        return itemDate < filterDate;
                                    case '>=':
                                        return itemDate >= filterDate;
                                    case '<=':
                                        return itemDate <= filterDate;
                                    case '=':
                                        return itemDate === filterDate;
                                    default:
                                        return false;
                                }
                            });
                        }
                    } else {
                        // Filtro de cadena.
                        let filterWords = filterValue.split(' ');
                        _data = _data.filter((item: any) => {
                            return filterWords.some((word: any) =>
                                item[column.name].toString().toLowerCase().includes(word)
                            );
                        });
                    }
                }
            });

            // Actualizamos los datos de la tabla con los datos filtrados.
            this.tableConfig.data = _data;
        }

        // Reiniciamos la paginación.
        this.page = 1;
        this.p = 1;
    }

    selectColumnsAuto(value: boolean) {
        if (value === true) {
            this.tableConfig.columns.map((column: any) => {
                return (column.checkColumn = true);
            });
            this.checkColumnsOption = true;
        }
    }

    pageChanged(p: number) {
        this.p = p;
        this.page = p;
    }
    downloadOptionClick() {
        this.downloadOption = !this.downloadOption;
    }

    // Función para manejar cambios en los inputs
    onInputChange(item: any, column: any, value: any) {
        item[column.name] = value;
        //console.log('value::', value);
        //console.log(item);
    }
}
