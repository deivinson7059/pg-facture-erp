export type ParsedQuery = any;

export interface Options {
    parseNull?: boolean;
    parseUndefined?: boolean;
    parseBoolean?: boolean;
    parseNumber?: boolean;
}
export interface genericCombo {
    id: string;
    name: string;
}
export interface genericComboConfig {
    minYear?: number;
    incrementYear?: number;
    order?: 'ASC' | 'DESC';
}
