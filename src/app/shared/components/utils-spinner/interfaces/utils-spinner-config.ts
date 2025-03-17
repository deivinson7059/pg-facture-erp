import { InjectionToken } from '@angular/core';

export interface UtilsSpinnerConfig {
    type?: string;
}

export const UTILS_SPINNER_CONFIG = new InjectionToken<UtilsSpinnerConfig>(
    'UTILS_SPINNER_CONFIG'
);
