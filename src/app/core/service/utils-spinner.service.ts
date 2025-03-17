import { Injectable } from '@angular/core';
import { PRIMARY_SPINNER, UtilSpinner } from '@core/enums/utils-spinner.enum';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class UtilsSpinnerService {
    /**
     * Spinner observable
     *
     * @memberof UtilsSpinnerService
     */
    public spinnerObservable = new BehaviorSubject<UtilSpinner | null>(null);

    /**
     * Creates an instance of UtilsSpinnerService.
     * @memberof UtilsSpinnerService
     */
    constructor() { }

    /**
     * Get subscription of desired spinner
     * @memberof UtilsSpinnerService
     **/
    getSpinner(name: string): Observable<UtilSpinner> {
        return this.spinnerObservable
            .asObservable()
            .pipe(filter((x: UtilSpinner | null): x is UtilSpinner => x !== null && x.name === name));
    }

    /**
     * To show spinner
     *
     * @memberof UtilsSpinnerService
     */
    show(name: string = PRIMARY_SPINNER, spinner?: Partial<UtilSpinner>) {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                if (spinner && Object.keys(spinner).length) {
                    // Crear una copia del spinner y asignar la propiedad name
                    const spinnerWithName = { ...spinner, name, show: true };
                    this.spinnerObservable.next(
                        new UtilSpinner(spinnerWithName)
                    );
                    resolve(true);
                } else {
                    this.spinnerObservable.next(new UtilSpinner({ name, show: true }));
                    resolve(true);
                }
            }, 10);
        });
    }

    /**
     * To hide spinner
     *
     * @memberof UtilsSpinnerService
     */
    hide(name: string = PRIMARY_SPINNER, debounce: number = 10) {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                this.spinnerObservable.next(new UtilSpinner({ name, show: false }));
                resolve(true);
            }, debounce);
        });
    }
}