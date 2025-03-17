export type Size = 'small' | 'medium' | 'large' | string;
export const LOADERS: { [key: string]: number } = {
    'ball-8bits': 16,
    'ball-atom': 4,
    'ball-beat': 3,
    'ball-circus': 5,
    'ball-climbing-dot': 4,
    'ball-clip-rotate': 1,
    'ball-clip-rotate-multiple': 2,
    'ball-clip-rotate-pulse': 2,
    'ball-elastic-dots': 5,
    'ball-fall': 3,
    'ball-fussion': 4,
    'ball-grid-beat': 9,
    'ball-grid-pulse': 9,
    'ball-newton-cradle': 4,
    'ball-pulse': 3,
    'ball-pulse-rise': 5,
    'ball-pulse-sync': 3,
    'ball-rotate': 1,
    'ball-running-dots': 5,
    'ball-scale': 1,
    'ball-scale-multiple': 3,
    'ball-scale-pulse': 2,
    'ball-scale-ripple': 1,
    'ball-scale-ripple-multiple': 3,
    'ball-spin': 8,
    'ball-spin-clockwise': 8,
    'ball-spin-clockwise-fade': 8,
    'ball-spin-clockwise-fade-rotating': 8,
    'ball-spin-fade': 8,
    'ball-spin-fade-rotating': 8,
    'ball-spin-rotate': 2,
    'ball-square-clockwise-spin': 8,
    'ball-square-spin': 8,
    'ball-triangle-path': 3,
    'ball-zig-zag': 2,
    'ball-zig-zag-deflect': 2,
    cog: 1,
    'cube-transition': 2,
    fire: 3,
    'line-scale': 5,
    'line-scale-party': 5,
    'line-scale-pulse-out': 5,
    'line-scale-pulse-out-rapid': 5,
    'line-spin-clockwise-fade': 8,
    'line-spin-clockwise-fade-rotating': 8,
    'line-spin-fade': 8,
    'line-spin-fade-rotating': 8,
    pacman: 6,
    'square-jelly-box': 2,
    'square-loader': 1,
    'square-spin': 1,
    timer: 1,
    'triangle-skew-spin': 1,
};

export type LoaderType =
    | 'ball-8bits'
    | 'ball-atom'
    | 'ball-beat'
    | 'ball-circus'
    | 'ball-climbing-dot'
    | 'ball-clip-rotate'
    | 'ball-clip-rotate-multiple'
    | 'ball-clip-rotate-pulse'
    | 'ball-elastic-dots'
    | 'ball-fall'
    | 'ball-fussion'
    | 'ball-grid-beat'
    | 'ball-grid-pulse'
    | 'ball-newton-cradle'
    | 'ball-pulse'
    | 'ball-pulse-rise'
    | 'ball-pulse-sync'
    | 'ball-rotate'
    | 'ball-running-dots'
    | 'ball-scale'
    | 'ball-scale-multiple'
    | 'ball-scale-pulse'
    | 'ball-scale-ripple'
    | 'ball-scale-ripple-multiple'
    | 'ball-spin'
    | 'ball-spin-clockwise'
    | 'ball-spin-clockwise-fade'
    | 'ball-spin-clockwise-fade-rotating'
    | 'ball-spin-fade'
    | 'ball-spin-fade-rotating'
    | 'ball-spin-rotate'
    | 'ball-square-clockwise-spin'
    | 'ball-square-spin'
    | 'ball-triangle-path'
    | 'ball-zig-zag'
    | 'ball-zig-zag-deflect'
    | 'cog'
    | 'cube-transition'
    | 'fire'
    | 'line-scale'
    | 'line-scale-party'
    | 'line-scale-pulse-out'
    | 'line-scale-pulse-out-rapid'
    | 'line-spin-clockwise-fade'
    | 'line-spin-clockwise-fade-rotating'
    | 'line-spin-fade'
    | 'line-spin-fade-rotating'
    | 'pacman'
    | 'square-jelly-box'
    | 'square-loader'
    | 'square-spin'
    | 'timer'
    | 'triangle-skew-spin';

export const DEFAULTS = {
    BD_COLOR: 'rgba(51,51,51,0.8)',
    SPINNER_COLOR: '#fff',
    Z_INDEX: 99999,
};

export const PRIMARY_SPINNER = 'primary';

export interface Spinner {
    name?: string;
    bdColor?: string;
    size?: Size;
    color?: string;
    type?: string;
    class?: string;
    divCount?: number;
    divArray?: number[];
    fullScreen?: boolean;
    show?: boolean;
    zIndex?: number;
    template?: string | undefined;
    showSpinner?: boolean;
}

export class UtilSpinner {
    name?: string;
    bdColor?: string;
    size?: Size;
    color?: string;
    type?: string;
    class?: string;
    divCount?: number;
    divArray?: number[];
    fullScreen?: boolean;
    show?: boolean;
    zIndex?: number;
    template?: string | undefined;
    showSpinner?: boolean;

    constructor(init?: Partial<UtilSpinner>) {
        Object.assign(this, init);
    }

    static create(init?: Partial<UtilSpinner>): UtilSpinner {
        return new UtilSpinner(init);
    }
}