import { OverlayRef } from '@shared/components/utils-toastr/overlay/overlay-ref';
import { Observable, Subject } from 'rxjs';

/**
 * Reference to a toast opened via the Toastr service.
 */
export class ToastRef<T> {
    /** The instance of component opened into the toast. */
    componentInstance!: T;

    /** Count of duplicates of this toast */
    private duplicatesCount = 0;

    /** Subject for notifying the user that the toast has finished closing. */
    private _afterClosed = new Subject<void>();
    /** triggered when toast is activated */
    private _activate = new Subject<void>();
    /** notifies the toast that it should close before the timeout */
    private _manualClose = new Subject<void>();
    /** notifies the toast that it should reset the timeouts */
    private _resetTimeout = new Subject<void>();
    /** notifies the toast that it should count a duplicate toast */
    private _countDuplicate = new Subject<number>();

    constructor(private _overlayRef: OverlayRef) { }

    manualClose() {
        this._manualClose.next();
        this._manualClose.complete();
    }

    manualClosed(): Observable<any> {
        return this._manualClose.asObservable();
    }

    timeoutReset(): Observable<any> {
        return this._resetTimeout.asObservable();
    }

    countDuplicate(): Observable<number> {
        return this._countDuplicate.asObservable();
    }

    /**
     * Close the toast.
     */
    close(): void {
        this._overlayRef.detach();
        this._afterClosed.next();
        this._manualClose.next();
        this._afterClosed.complete();
        this._manualClose.complete();
        this._activate.complete();
        this._resetTimeout.complete();
        this._countDuplicate.complete();
    }

    /** Gets an observable that is notified when the toast is finished closing. */
    afterClosed(): Observable<any> {
        return this._afterClosed.asObservable();
    }

    isInactive() {
        return this._activate.isStopped;
    }

    activate() {
        this._activate.next();
        this._activate.complete();
    }

    /** Gets an observable that is notified when the toast has started opening. */
    afterActivate(): Observable<any> {
        return this._activate.asObservable();
    }

    /** Reset the toast timouts and count duplicates */
    onDuplicate(resetTimeout: boolean, countDuplicate: boolean) {
        if (resetTimeout) {
            this._resetTimeout.next();
        }
        if (countDuplicate) {
            this._countDuplicate.next(++this.duplicatesCount);
        }
    }
}
export const DEFAULT_STYLES = `
.toast-center-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.toast-top-center {
  top: 0;
  right: 0;
  width: 100%;
}
.toast-bottom-center {
  bottom: 0;
  right: 0;
  width: 100%;
}
.toast-top-full-width {
  top: 0;
  right: 0;
  width: 100%;
}
.toast-bottom-full-width {
  bottom: 0;
  right: 0;
  width: 100%;
}
.toast-top-left {
  top: 12px;
  left: 12px;
}
.toast-top-right {
  top: 12px;
  right: 12px;
}
.toast-bottom-right {
  right: 12px;
  bottom: 12px;
}
.toast-bottom-left {
  bottom: 12px;
  left: 12px;
}

/* toast styles */
.toast-title {
  font-weight: bold;
}
.toast-message {
  word-wrap: break-word;
}
.toast-message a,
.toast-message label {
  color: #ffffff;
}
.toast-message a:hover {
  color: #cccccc;
  text-decoration: none;
}
.toast-close-button {
  position: relative;
  right: -0.3em;
  top: -0.3em;
  float: right;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 1px 0 #ffffff;
  /* opacity: 0.8; */
}
.toast-close-button:hover,
.toast-close-button:focus {
  color: #000000;
  text-decoration: none;
  cursor: pointer;
  opacity: 0.4;
}
button.toast-close-button {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
}
.toast-container {
  pointer-events: none;
  position: fixed;
  z-index: 999999;
}
.toast-container * {
  box-sizing: border-box;
}
.toast-container .ngx-toastr {
  position: relative;
  overflow: hidden;
  margin: 0 0 6px;
  padding: 15px 15px 15px 50px;
  width: 300px;
  border-radius: 3px 3px 3px 3px;
  background-position: 15px center;
  background-repeat: no-repeat;
  background-size: 24px;
  box-shadow: 0 0 12px #999999;
  color: #ffffff;
}
.toast-container .ngx-toastr:hover {
  box-shadow: 0 0 12px #000000;
  opacity: 1;
  cursor: pointer;
}
.toast-info {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA1MTIgNTEyJyB3aWR0aD0nNTEyJyBoZWlnaHQ9JzUxMic+PHBhdGggZmlsbD0ncmdiKDI1NSwyNTUsMjU1KScgZD0nTTI1NiA4QzExOS4wNDMgOCA4IDExOS4wODMgOCAyNTZjMCAxMzYuOTk3IDExMS4wNDMgMjQ4IDI0OCAyNDhzMjQ4LTExMS4wMDMgMjQ4LTI0OEM1MDQgMTE5LjA4MyAzOTIuOTU3IDggMjU2IDh6bTAgMTEwYzIzLjE5NiAwIDQyIDE4LjgwNCA0MiA0MnMtMTguODA0IDQyLTQyIDQyLTQyLTE4LjgwNC00Mi00MiAxOC44MDQtNDIgNDItNDJ6bTU2IDI1NGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyaC04OGMtNi42MjcgMC0xMi01LjM3My0xMi0xMnYtMjRjMC02LjYyNyA1LjM3My0xMiAxMi0xMmgxMnYtNjRoLTEyYy02LjYyNyAwLTEyLTUuMzczLTEyLTEydi0yNGMwLTYuNjI3IDUuMzczLTEyIDEyLTEyaDY0YzYuNjI3IDAgMTIgNS4zNzMgMTIgMTJ2MTAwaDEyYzYuNjI3IDAgMTIgNS4zNzMgMTIgMTJ2MjR6Jy8+PC9zdmc+");
}
.toast-error {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA1MTIgNTEyJyB3aWR0aD0nNTEyJyBoZWlnaHQ9JzUxMic+PHBhdGggZmlsbD0ncmdiKDI1NSwyNTUsMjU1KScgZD0nTTI1NiA4QzExOSA4IDggMTE5IDggMjU2czExMSAyNDggMjQ4IDI0OCAyNDgtMTExIDI0OC0yNDhTMzkzIDggMjU2IDh6bTEyMS42IDMxMy4xYzQuNyA0LjcgNC43IDEyLjMgMCAxN0wzMzggMzc3LjZjLTQuNyA0LjctMTIuMyA0LjctMTcgMEwyNTYgMzEybC02NS4xIDY1LjZjLTQuNyA0LjctMTIuMyA0LjctMTcgMEwxMzQuNCAzMzhjLTQuNy00LjctNC43LTEyLjMgMC0xN2w2NS42LTY1LTY1LjYtNjUuMWMtNC43LTQuNy00LjctMTIuMyAwLTE3bDM5LjYtMzkuNmM0LjctNC43IDEyLjMtNC43IDE3IDBsNjUgNjUuNyA2NS4xLTY1LjZjNC43LTQuNyAxMi4zLTQuNyAxNyAwbDM5LjYgMzkuNmM0LjcgNC43IDQuNyAxMi4zIDAgMTdMMzEyIDI1Nmw2NS42IDY1LjF6Jy8+PC9zdmc+");
}
.toast-success {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA1MTIgNTEyJyB3aWR0aD0nNTEyJyBoZWlnaHQ9JzUxMic+PHBhdGggZmlsbD0ncmdiKDI1NSwyNTUsMjU1KScgZD0nTTE3My44OTggNDM5LjQwNGwtMTY2LjQtMTY2LjRjLTkuOTk3LTkuOTk3LTkuOTk3LTI2LjIwNiAwLTM2LjIwNGwzNi4yMDMtMzYuMjA0YzkuOTk3LTkuOTk4IDI2LjIwNy05Ljk5OCAzNi4yMDQgMEwxOTIgMzEyLjY5IDQzMi4wOTUgNzIuNTk2YzkuOTk3LTkuOTk3IDI2LjIwNy05Ljk5NyAzNi4yMDQgMGwzNi4yMDMgMzYuMjA0YzkuOTk3IDkuOTk3IDkuOTk3IDI2LjIwNiAwIDM2LjIwNGwtMjk0LjQgMjk0LjQwMWMtOS45OTggOS45OTctMjYuMjA3IDkuOTk3LTM2LjIwNC0uMDAxeicvPjwvc3ZnPg==");
}
.toast-warning {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA1NzYgNTEyJyB3aWR0aD0nNTc2JyBoZWlnaHQ9JzUxMic+PHBhdGggZmlsbD0ncmdiKDI1NSwyNTUsMjU1KScgZD0nTTU2OS41MTcgNDQwLjAxM0M1ODcuOTc1IDQ3Mi4wMDcgNTY0LjgwNiA1MTIgNTI3Ljk0IDUxMkg0OC4wNTRjLTM2LjkzNyAwLTU5Ljk5OS00MC4wNTUtNDEuNTc3LTcxLjk4N0wyNDYuNDIzIDIzLjk4NWMxOC40NjctMzIuMDA5IDY0LjcyLTMxLjk1MSA4My4xNTQgMGwyMzkuOTQgNDE2LjAyOHpNMjg4IDM1NGMtMjUuNDA1IDAtNDYgMjAuNTk1LTQ2IDQ2czIwLjU5NSA0NiA0NiA0NiA0Ni0yMC41OTUgNDYtNDYtMjAuNTk1LTQ2LTQ2LTQ2em0tNDMuNjczLTE2NS4zNDZsNy40MTggMTM2Yy4zNDcgNi4zNjQgNS42MDkgMTEuMzQ2IDExLjk4MiAxMS4zNDZoNDguNTQ2YzYuMzczIDAgMTEuNjM1LTQuOTgyIDExLjk4Mi0xMS4zNDZsNy40MTgtMTM2Yy4zNzUtNi44NzQtNS4wOTgtMTIuNjU0LTExLjk4Mi0xMi42NTRoLTYzLjM4M2MtNi44ODQgMC0xMi4zNTYgNS43OC0xMS45ODEgMTIuNjU0eicvPjwvc3ZnPg==");
}
.toast-container.toast-top-center .ngx-toastr,
.toast-container.toast-bottom-center .ngx-toastr {
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}
.toast-container.toast-top-full-width .ngx-toastr,
.toast-container.toast-bottom-full-width .ngx-toastr {
  width: 96%;
  margin-left: auto;
  margin-right: auto;
}
.ngx-toastr {
  background-color: #030303;
  pointer-events: auto;
}
.toast-success {
  background-color: #51a351;
}
.toast-error {
  background-color: #bd362f;
}
.toast-info {
  background-color: #2f96b4;
}
.toast-warning {
  background-color: #f89406;
}
.toast-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 4px;
  background-color: #000000;
  opacity: 0.4;
}

@media all and (max-width: 240px) {
  .toast-container .ngx-toastr.div {
    padding: 8px 8px 8px 50px;
    width: 11em;
  }
  .toast-container .toast-close-button {
    right: -0.2em;
    top: -0.2em;
  }
}
@media all and (min-width: 241px) and (max-width: 480px) {
  .toast-container .ngx-toastr.div {
    padding: 8px 8px 8px 50px;
    width: 18em;
  }
  .toast-container .toast-close-button {
    right: -0.2em;
    top: -0.2em;
  }
}
@media all and (min-width: 481px) and (max-width: 768px) {
  .toast-container .ngx-toastr.div {
    padding: 15px 15px 15px 50px;
    width: 25em;
  }
}
  `;
