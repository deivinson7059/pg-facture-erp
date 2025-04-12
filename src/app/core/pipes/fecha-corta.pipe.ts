import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fechaCorta',
    standalone: true
})
export class FechaCortaPipe implements PipeTransform {

    transform(value: string | Date | null): string {
        if (!value) {
            return '';
        }

        // Convertir a objeto Date si es string
        const fecha = typeof value === 'string' ? new Date(value) : value;

        // Array con los nombres de los meses abreviados en español
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

        // Formatear componentes de la fecha
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = meses[fecha.getMonth()];
        const anio = fecha.getFullYear().toString().slice(-2); // Últimos 2 dígitos del año

        // Devolver fecha formateada
        return `${dia} ${mes}. ${anio}`;
    }
}