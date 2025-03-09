
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
    debit: number |null ;
    credit: number|null;
    debitDisabled:boolean;
    creditDisabled:boolean;
    customers: any;
}