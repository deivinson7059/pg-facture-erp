import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Period, Account, BalanceResponse, BalanceType } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class BalanceService {
    private baseUrl = 'http://localhost:3000';
    constructor(private http: HttpClient) { }


    // Períodos contables
    getPeriods(cmpy: string, year?: number): Observable<{ data: Period[] }> {
        let url = `${this.baseUrl}/accounting/period?cmpy=${cmpy}`;
        if (year) {
            url += `&year=${year}`;
        }
        return this.http.get<{ data: Period[] }>(url);
    }

    // Plan de cuentas
    getAccountCatalog(cmpy: string): Observable<{ data: Account[] }> {
        return this.http.get<{ data: Account[] }>(`${this.baseUrl}/puc/catalog?cmpy=${cmpy}`);
    }

    // Balances
    generateBalance(cmpy: string, ware: string, year: number, per: number, type: string, userId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/accounting/balance/generate`, {
            cmpy,
            ware,
            year,
            per,
            type,
            userId
        });
    }

    getBalance(cmpy: string, year: number, per: number, type: string): Observable<{ data: BalanceResponse }> {
        return this.http.get<{ data: BalanceResponse }>(
            `${this.baseUrl}/accounting/balance?cmpy=${cmpy}&year=${year}&per=${per}&type=${type}`
        );
    }

    // Tipos de balance
    getBalanceTypes(): Observable<{ data: BalanceType[] }> {
        return this.http.get<{ data: BalanceType[] }>(`${this.baseUrl}/accounting/balance/types`);
    }


}
