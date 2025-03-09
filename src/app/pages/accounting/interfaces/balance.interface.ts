export interface Balance {
    accb_cmpy: string;
    accb_year: number;
    accb_per: number;
    accb_type: string;
    accb_date_generated: string;
    accb_generated_by: string;
    accb_is_closing_balance: boolean;
    accb_status: string;
    accb_activo_total: number;
    accb_pasivo_total: number;
    accb_patrimonio_total: number;
    accb_ingresos_total: number;
    accb_gastos_total: number;
    accb_costos_total: number;
    accb_utilidad_perdida: number;
    accb_observaciones: string | null;
  }
  
  export interface BalanceDetail {
    account: string;
    account_name: string;
    level: number;
    parent_account: string | null;
    is_total_row: boolean;
    initial_debit: number;
    initial_credit: number;
    period_debit: number;
    period_credit: number;
    final_debit: number;
    final_credit: number;
    balance: number;
    children?: BalanceDetail[];
  }
  
  export interface BalanceResponse {
    balance: Balance;
    details: BalanceDetail[];
  }
  
  export interface BalanceType {
    code: string;
    name: string;
  }