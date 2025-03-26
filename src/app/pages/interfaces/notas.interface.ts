
export interface LineaNotaContable {
    id?: number;
    cuenta: string;
    nombre: string;
    debito: number | null;
    credito: number | null;
    tercero: string;
}

export interface NotaContable {
    id?: number;
    fechaContable: Date;
    oficina: string;
    centroCosto: string;
    lineas: LineaNotaContable[];
    totalDebitos: number;
    totalCreditos: number;
    comentarios?: string;
    generadoPor?: string;
    fechaCreacion?: Date;
}

export interface accountPUC {
    account: string;
    account_name: string;
    debit: number | null;
    credit: number | null;
    debitDisabled: boolean;
    creditDisabled: boolean;
}

export interface Customer {
    name: string;
    nit: string;
    city?: string;
    address?: string;
    phone?: string;
}
export interface notesLine {
    account: string;
    account_name: string;
    debit: number;
    credit: number;
    tercero: string | null;
}
export interface notesHeader {
    cmpy: string;
    ware: string;
    year: number;
    per: number;
    description: string;
    reference: string;
    creation_by: string;
    lines: notesLine[];
}
export interface AccountingEntry {
    id: number;
    code: number;
    cmpy: string;
    ware: string;
    line_number: number;
    account: string;
    account_name: string;
    account_id: number;
    description: string | null;
    reference: string | null;
    creation_date: string;
    customer: string;
    customer_name: string;
    status: string;
    total_debit: string;
    total_credit: string;
    total_debit_formatted?: string;
    total_credit_formatted?: string;
    auto_post: boolean;
    auto_apply: boolean;
    lines: AccountingEntryLine[];
}
export interface AccountingEntryLine {
    id: number;
    acnh_id: number;
    cmpy: string;
    ware: string;
    line_number: number;
    account: string;
    account_name: string;
    customer?: string;
    customer_name?: string;
    description?: string | null;
    reference?: string | null;
    creation_date: string;
    creation_user?: string;
    total?: number;
}
