export interface ButtonsTable {
    icon: string;
    title: string;
    text?: string;
    type: ButtonsTipe;
    onclick: Function | void;
}

export interface ColumnsLink {
    isLink: boolean;
    title: string;
    onclick: Function | void;
}

export interface ColumnsTable {
    title: string;
    class: string;
    classItems?: string;
    name: string;
    filter: string;
    checkColumn: boolean;
    link?: ColumnsLink;
    format?: FormatOptions;
    conditionalClass?: (value: any, formatType?: string) => string;
    conditionalClassTD?: (value: any, formatType?: string) => string;
    conditionalStyle?: (
        value: any,
        formatType?: string
    ) => { [key: string]: string };
    inputType?: {
        enabled: boolean;
        class?: string;
        type:
        | 'text'
        | 'number'
        | 'date'
        | 'email'
        | 'password'
        | 'tel'
        | 'checkbox';
    };
}
export interface FormatOptions {
    type: 'date' | 'number' | 'currency' | 'percent' | 'text';
    format: string;
}

export interface LenguageTable {
    buttonName: string;
    buttonSelected: string;
    buttonAll: string;
    buttonFilter: string;
    nextLabel: string;
    previousLabel: string;
    colunSelector: string;
    til_1: string;
    til_2: string;
    til_3: string;
    til_4: string;
    options: string;
    tr_info?: string;
}
export type DownloadType = 'all' | 'selection' | 'filter';
export interface TableSorter<T = any> {
    data: Array<T>;
    dataFilter: Array<T>;
    pageOfItems?: Array<T>;
    buttonsDownload?: boolean;
    buttonsInitial: boolean;
    sorting?: boolean;
    textDownload?: string;
    formatDownload?: FormatType;
    classDownload?: string;
    iconDownload?: string;
    downloadOption?: boolean;
    downloadText?: string;
    pageSize?: number;
    caption?: string;
    fillForm?: Function | void;
    buttons: ButtonsTable[];
    columns: ColumnsTable[];
    columnSelector: boolean;
    cssClass?: string;
    isFilter: boolean;
    isPaginate: boolean;
    lenguage?: 'es' | 'en';
    sticky: boolean;
}

export type data = any[];

export type ButtonsTipe =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'link';
export type FormatType =
    | 'xlsx'
    | 'xlsm'
    | 'xlsb'
    | 'xls'
    | 'xla'
    | 'biff8'
    | 'biff5'
    | 'biff2'
    | 'xlml'
    | 'ods'
    | 'fods'
    | 'csv'
    | 'txt'
    | 'sylk'
    | 'slk'
    | 'html'
    | 'dif'
    | 'rtf'
    | 'prn'
    | 'eth'
    | 'dbf';
