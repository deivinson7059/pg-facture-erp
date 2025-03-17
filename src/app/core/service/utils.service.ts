import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { Observable, fromEvent, map } from 'rxjs';

import { genericCombo, genericComboConfig, Options, ParsedQuery } from '../interfaces/service.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor(private http: HttpClient) { }
    /**
     *
     * @param url
     * @param filename
     * @returns
     * @description
     * Descarga un archivo desde una URL.
     * @example
     * ```typescript
     * downloadFile('https://www.example.com/file.pdf', 'file.pdf');
     * ```
     */
    public downloadFile(url: string, filename: string) {
        return this.http
            .get(url, { responseType: 'blob' })
            .toPromise()
            .then((blob: any) => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                link.click();
                window.URL.revokeObjectURL(link.href);
            })
            .catch((err) => console.error('Error downloading file', err));
    }
    /**
     *
     * @param obj
     * @returns
     * @description
     * Recorre un objeto y elimina los espacios en blanco de las cadenas de texto.
     */

    public trimObjectStrings<T>(obj: T): T {
        const trimmedObj: any = {};

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = (obj as any)[key];
                if (typeof value === 'string') {
                    trimmedObj[key] = value.trim();
                } else {
                    trimmedObj[key] = value;
                }
            }
        }
        return trimmedObj as T;
    }

    /**
     *
     * @param element
     * @param numParse
     * @returns
     * @description
     * Copia el contenido de un elemento HTML al portapapeles.
     * @example
     * ```typescript
     * <div id="copyable" #copyable>
     *  <!-- Aquí va tu contenido HTML que deseas copiar -->
     * <p>Contenido a copiar</p>
     * </div>
     * <button (click)="copyToClipboard(copyable)">Copiar al portapapeles</button>
     * ```
     */

    public copyToClipboard(element: HTMLElement, numParse: boolean = true) {
        if (numParse) {
            // Crear una expresión regular para encontrar los valores que cumplen el patrón
            const regex =
                /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g;
            // Reemplazar solo las partes numéricas que coinciden con el patrón
            element.innerHTML = element.innerHTML.replace(regex, function (match) {
                // Remover comas y puntos en la parte numérica
                return match.replace(/,/g, '').replace(/\./g, ',');
            });
        }
        let html = element.outerHTML;

        navigator.clipboard
            .writeText(html)
            .then(() => {
                this.successAlert('Contenido copiado al portapapeles');
            })
            .catch((err) => {
                this.errorAlert('Error al copiar al portapapeles');
                console.error('Error al copiar al portapapeles: ', err);
            });
    }

    /**
   * @description
   * Convierte un elemento HTML a un archivo Excel y lo descarga.
   * @param element El elemento HTML a convertir.
   * @param isStyles Indica si se deben incluir los estilos del documento en el archivo Excel.
   * @param numParse Indica si se deben parsear los números en el contenido del elemento.
   * @returns void
   * @example
   * ```typescript
   * <div id="exportable" #exportable>
    <!-- Aquí va tu contenido HTML que deseas exportar -->
    <table>
      <thead>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
        </tr>
      </tbody>
    </table>
  </div>
  <button (click)="toHTMLaExcel(exportable)">Exportar a Excel</button>
    * ```
    */
    public toHTMLaExcel(
        element: HTMLElement,
        isStyles = true,
        numParse: boolean = true
    ) {
        if (numParse) {
            // Crear una expresión regular para encontrar los valores que cumplen el patrón
            const regex =
                /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g;
            // Reemplazar solo las partes numéricas que coinciden con el patrón
            element.innerHTML = element.innerHTML.replace(regex, function (match) {
                // Remover comas y puntos en la parte numérica
                return match.replace(/,/g, '').replace(/\./g, ',');
            });
        }

        // Obtén el HTML del elemento
        const html = element.outerHTML;

        // Si se requieren estilos, agrega los estilos del documento al HTML
        let styledHtml = html;
        if (isStyles) {
            const styles = this.getAllCSSRules();
            styledHtml = `<style>${styles}</style>${html}`;
        }
        const contenidoExcel = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]><xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Sheet1</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
          </xml><![endif]-->
        </head>
        <body>
          ${styledHtml}
        </body>
        </html>`;

        // Crea un blob con el contenido HTML
        const blob = new Blob([contenidoExcel], {
            type: 'application/vnd.ms-excel;charset=utf-8;',
        });

        // Descarga el archivo Excel
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `export_${Date.now()}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    private getAllCSSRules(): string {
        let css = '';
        for (const sheet of Array.from(document.styleSheets) as CSSStyleSheet[]) {
            try {
                for (const rule of Array.from(sheet.cssRules)) {
                    css += rule.cssText;
                }
            } catch (e) {
                console.error('Error reading CSS rules from stylesheet:', e);
            }
        }
        return css;
    }

    /**
     *
     * @param objCombo
     * @returns
     * @description
     * Obtiene un arreglo de objetos con los años desde el año mínimo hasta el año actual.
     * @example
     * ```typescript
     * getComboYear({ minYear: 1988, incrementYear: 0, order: 'ASC' });
     * ```
     */

    public getComboYear(objCombo: genericComboConfig): genericCombo[] {
        const currentYear = new Date().getFullYear();
        const minYear = objCombo.minYear ?? 1988;
        const incrementYear = objCombo.incrementYear ?? 0;
        const years = [];

        if (objCombo.order === 'DESC') {
            for (let i = currentYear + incrementYear; i >= minYear; i--) {
                years.push({ id: i.toString(), name: i.toString() });
            }
        } else {
            for (let i = minYear; i <= currentYear + incrementYear; i++) {
                years.push({ id: i.toString(), name: i.toString() });
            }
        }

        return years;
    }

    /**
     *
     * @param date
     * @returns
     * @description
     * Obtiene el nombre del mes de una fecha.
     * @example
     * ```typescript
     * monthLabel(new Date());
     * ```
     *
     */
    public validarFechaMenorActual(date: string) {
        var x = new Date();
        var fecha: any = date.split('-');
        x.setFullYear(fecha[2], fecha[1] - 1, fecha[0]);
        var today = new Date();

        if (x >= today) return false;
        else return true;
    }
    /**
     *
     * @param date
     * @param dateMin
     * @param dateMax
     * @returns
     * @description
     * Valida si una fecha se encuentra dentro de un rango de fechas.
     * @example
     * ```typescript
     * validarFechaRange('2021-08-01', '2021-08-01', '2021-08-31');
     * ```
     */
    public validarFechaRange(date: string, dateMin: string, dateMax: string) {
        var x = new Date(date);
        x.setDate(x.getDate() + 1);
        console.log('X:', x.getTime());
        var min = new Date(dateMin);
        min.setDate(min.getDate() + 1);
        console.log('MIN:', min.getTime());
        var max = new Date(dateMax);
        max.setDate(max.getDate() + 1);
        console.log('MAX:', max.getTime());
        if (x.getTime() >= min.getTime() && x.getTime() <= max.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     * @param file
     * @returns
     * @description
     * Convierte un archivo a base64.
     * @example
     * ```typescript
     * convertFileToBase64(file);
     * ```
     *
     */
    public convertFileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    /**
     *
     * @param file
     * @returns
     * @description
     * Obtiene la extensión de un archivo.
     * @example
     * ```typescript
     * getExtensionFile(file);
     * ```
     */
    public getExtensionFile(file: File): string {
        return file.name.split('.').pop() || '';
    }

    /**
     *
     * @param base64
     * @returns
     * @description
     * Obtiene el tamaño de un archivo en base64.
     * @example
     * ```typescript
     * getFileSizeBase64(base64);
     * ```
     */
    public getFileSizeBase64(base64: string): number {
        return Math.round((base64.length * 3) / 4);
    }

    /**
     *
     * @param base64
     * @returns
     * @description
     * Valida si una cadena de texto es base64.
     * @example
     * ```typescript
     * isBase64(base64);
     * ```
     */
    public isBase64(base64: string): boolean {
        return base64.includes('data:');
    }
    /**
     *
     * @param base64
     * @param fileName
     * @returns
     * @description
     * Convierte una cadena de texto base64 a un archivo.
     * @example
     * ```typescript
     * convertBase64ToFile(base64, 'file.pdf');
     * ```
     */
    public convertBase64ToFile(base64: string, fileName: string): File {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: mime });
    }

    /**
     *
     * @param file
     * @param extensions
     * @returns
     * @description
     * Valida si la extensión de un archivo es válida.
     * @example
     * ```typescript
     * validateExtensionFile(file, ['jpg', 'jpeg', 'png', 'pdf', 'gif']);
     * ```
     */
    public validateExtensionFile(
        file: File,
        extensions: string[] = ['jpg', 'jpeg', 'png', 'pdf', 'gif']
    ): boolean {
        const extension = this.getExtensionFile(file);
        return extensions.includes(extension);
    }
    /**
     *
     * @param message
     * @param title
     * @param type
     * @returns
     * @description
     * Muestra una alerta de error.
     * @example
     * ```typescript
     * errorAlert('Error al guardar el registro');
     * ```
     */
    public errorAlert(
        message: string,
        title: string = 'Error',
        type: any = 'warning'
    ) {
        Swal.fire(title, message, type);
    }
    /**
     *
     * @param message
     * @param title
     * @param type
     * @returns
     * @description
     * Muestra una alerta de éxito.
     * @example
     * ```typescript
     * successAlert('Registro guardado correctamente');
     * ```
     */
    public successAlert(
        message: string,
        title: string = 'success',
        type: any = 'success'
    ) {
        Swal.fire(title, message, type);
    }
    /**
     * @description
     * Convierte un objeto JSON a un archivo Excel y lo descarga.
     * @param json El objeto JSON a convertir.
     * @param excelFileName El nombre del archivo Excel a descargar.
     * @param bookType El tipo de archivo Excel a descargar.
     * @returns void
     * @example
     * ```typescript
     * exportAsExcelFile(json, 'file', 'xlsx');
     * ```
     */
    public exportAsExcelFile(
        json: any[],
        excelFileName: string,
        bookType?: XLSX.BookType | undefined | null
    ): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

        const Sheets = {
            Hoja1: worksheet,
        };

        const SheetNames = ['Hoja1'];

        const workbook: XLSX.WorkBook = {
            Sheets: Sheets,
            SheetNames: SheetNames,
        };

        if (bookType === undefined || bookType === null) {
            bookType = 'xlsx';
        }

        const EXCEL_EXTENSION = '.' + bookType;
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: bookType,
            type: 'array',
        });
        this.saveAsExcelFile(excelBuffer, excelFileName, EXCEL_EXTENSION);
    }

    private saveAsExcelFile(
        buffer: any,
        fileName: string,
        EXCEL_EXTENSION: string
    ): void {
        const data: Blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }
    /**
     *
     * @param id
     * @param btn
     * @returns
     * @description
     * Copia el contenido de un elemento HTML al portapapeles.
     * @example
     * ```typescript
     * <div id="copyable" #copyable>
     * <!-- Aquí va tu contenido HTML que deseas copiar -->
     * <p>Contenido a copiar</p>
     * </div>
     * <button (click)="copyToClipboard_(copyable)">Copiar al portapapeles</button>
     * ```
     */
    public copyToClipboard_(id: string, btn: string) {
        let inputBtn = document.getElementById(btn);
        let aux: any = document.createElement('div');
        aux.setAttribute('contentEditable', true);
        aux.innerHTML = document.getElementById(id)!.innerHTML;
        aux.setAttribute('onfocus', "document.execCommand('selectAll',false,null)");
        document.body.appendChild(aux);
        aux.focus();
        document.execCommand('copy');

        document.body.removeChild(aux);
        inputBtn?.focus();
        this.successAlert('Copiado al portapapeles');
    }

    private fileCnvert(content: string, type: string = 'application/pdf'): Blob {
        const byteArray = new Uint8Array(
            atob(content)
                .split('')
                .map((char) => char.charCodeAt(0))
        );

        return new Blob([byteArray], { type: type });
    }
    /**
     *
     * @param content
     * @param type
     * @param open
     * @returns
     * @description
     * Abre el contenido de un archivo en una nueva pestaña.
     * @example
     * ```typescript
     * openContentBlob('base64', 'application/pdf', true);
     * ```
     */
    public openContentBlob(
        content: string,
        type: string = 'application/pdf',
        open: boolean = true
    ): string | void {
        const file: Blob = this.fileCnvert(content, type);
        const fileURL = window.URL.createObjectURL(file);

        if (open) {
            window.open(fileURL, '_blank');
            // window.location.href = fileURL;
        } else {
            return fileURL;
        }
    }
    /**
     *
     * @param blob
     * @returns
     * @description
     * Convierte un archivo Blob a base64.
     * @example
     * ```typescript
     * toBase64(blob);
     * ```
     */
    public toBase64(blob: Blob): Observable<string> {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return fromEvent(reader, 'load').pipe(
            map(() => (reader.result as string).split(',')[1])
        );
    }

    _options: Options = {
        parseNull: true,
        parseUndefined: true,
        parseBoolean: true,
        parseNumber: true,
    };
    /**
     *
     * @param target
     * @param options
     * @returns
     * @description
     * Parsea un objeto o cadena de texto a un objeto JSON.
     * @example
     * ```typescript
     * parse('{"name": "John", "age": "30"}');
     * ```
     */
    public parse = (
        target: ParsedQuery,
        options: Options = this._options
    ): ParsedQuery => {
        switch (typeof target) {
            case 'string':
                if (target === '') {
                    return '';
                } else if (options.parseNull && target === 'null') {
                    return null;
                } else if (options.parseUndefined && target === 'undefined') {
                    return undefined;
                } else if (
                    options.parseBoolean &&
                    (target === 'true' || target === 'false')
                ) {
                    return target === 'true';
                } else if (options.parseNumber && !isNaN(Number(target))) {
                    return Number(target);
                } else {
                    return target;
                }
            case 'object':
                if (Array.isArray(target)) {
                    return target.map((x) => this.parse(x, options));
                } else {
                    const obj = target;
                    Object.keys(obj).map(
                        (key) => (obj[key] = this.parse(target[key], options))
                    );
                    return obj;
                }
            default:
                return target;
        }
    };
}
