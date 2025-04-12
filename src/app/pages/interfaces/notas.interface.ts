
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
    taxable_base: number | null;
    exempt_base: number | null;
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
    taxable_base: number | null;
    exempt_base: number | null;
}
export interface notesHeader {
    cmpy: string;
    ware: string;
    date: string;
    customer: string;
    customer_name: string;
    reference: string;
    cost_center: string;
    creation_by: string;
    comments: string;
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


export interface NoteGetParams {
    cmpy: string;
    date_ini: string;
    date_end: string;
    page?: number;
}
export interface NotesResponse {
    total: number;
    page: number;
    totalPages: number;
    items: Note[];
}


export interface Note {
    id: number;
    cmpy: string;
    ware: string;
    year: number;
    per: number;
    code: string;
    accounting_date: string;
    date: string;
    time: string;
    customer: string;
    customer_name: string;
    status: string; // 'P' (Pendiente), 'C' (Contabilizada), etc.
    total_debit: string;
    total_credit: string;
    reference: string;
    creation_by: string;
    creation_date: string;
    updated_by: string | null;
    updated_date: string;
    approved_by: string | null;
    approved_date: string;
    posting_date: string;
    cost_center: string;
    lines: NoteLine[];
    comments: NoteComment[];
    seats: NoteSeat[];
}

export interface NoteLine {
    id: number;
    acnh_id: string;
    cmpy: string;
    ware: string;
    line_number: number;
    account: string;
    account_name: string;
    debit: number | null;
    credit: number | null;
    taxable_base: string | null;
    exempt_base: string | null;
    customers: string;
    customers_name: string;
    creation_by: string;
    creation_date: string;
}

export interface NoteComment {
    id: string;
    comment: string;
    private: boolean;
    system_generated: boolean;
    date_in: string;
    user_enter: string;
}

export interface NoteSeat {
    id: string;
    cmpy: string;
    ware: string;
    code: string;
    date: string;
    time: string;
    account: string;
    account_name: string;
    debit: number | null;
    credit: number | null;
    balance: number | null;
    taxable_base: string | null;
    exempt_base: string | null;
    elaboration_date: string;
}
export interface approveNoteRequest {
    approved_by: string;
    comments: string;
}