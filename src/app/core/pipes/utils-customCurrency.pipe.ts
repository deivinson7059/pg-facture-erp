import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
})
export class UtilsCustomCurrencyPipe implements PipeTransform {
  transform(
    value: any,
    currencyCode: string = 'USD',
    symbolDisplay: 'code' | 'symbol' | 'narrowSymbol' = 'symbol',
    digitsInfo: string = '1.1-2',
    locale: string = 'en-US'
  ): string | null {
    const formattedValue = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value);

    // Insert a space between the symbol and the value
    return formattedValue.replace(/(\D+)(\d)/, '$1 $2');
  }
}
