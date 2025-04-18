/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DOCUMENT } from '@angular/common';
import {
    ApplicationRef,
    ComponentFactoryResolver,
    Inject,
    Injectable,
} from '@angular/core';

import { DomPortalHost } from '../portal/dom-portal-host';
import { OverlayContainer } from './overlay-container';
import { OverlayRef } from './overlay-ref';
import { UtilsToastDirective, DEFAULT_STYLES } from '@core';

/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
@Injectable({ providedIn: 'root' })
export class Overlay {
    // Namespace panes by overlay container
    private _paneElements: Map<
        UtilsToastDirective,
        Record<string, HTMLElement>
    > = new Map();

    constructor(
        private _overlayContainer: OverlayContainer,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _appRef: ApplicationRef,
        @Inject(DOCUMENT) private _document: any
    ) { }
    /**
     * Creates an overlay.
     * @returns A reference to the created overlay.
     */
    create(
        positionClass?: string,
        overlayContainer?: UtilsToastDirective
    ): OverlayRef {
        // get existing pane if possible
        return this._createOverlayRef(
            this.getPaneElement(positionClass, overlayContainer)
        );
    }

    getPaneElement(
        positionClass: string = '',
        overlayContainer?: UtilsToastDirective
    ): HTMLElement {
        if (
            !this._paneElements.get(overlayContainer as UtilsToastDirective)
        ) {
            this._paneElements.set(
                overlayContainer as UtilsToastDirective,
                {}
            );
        }

        if (
            !this._paneElements.get(
                overlayContainer as UtilsToastDirective
            )![positionClass]
        ) {
            this._paneElements.get(overlayContainer as UtilsToastDirective)![
                positionClass
            ] = this._createPaneElement(positionClass, overlayContainer);
        }

        return this._paneElements.get(
            overlayContainer as UtilsToastDirective
        )![positionClass];
    }

    /**
     * Creates the DOM element for an overlay and appends it to the overlay container.
     * @returns Newly-created pane element
     */
    private _createPaneElement(
        positionClass: string,
        overlayContainer?: UtilsToastDirective
    ): HTMLElement {
        const pane = this._document.createElement('div');
        //agragamiento de estilos
        const style = document.createElement('style');
        style.innerHTML = DEFAULT_STYLES;

        pane.id = 'toast-container';
        pane.classList.add(positionClass);
        pane.classList.add('toast-container');

        if (!overlayContainer) {
            this._overlayContainer.getContainerElement().appendChild(pane);
            pane.appendChild(style);
        } else {
            overlayContainer.getContainerElement().appendChild(pane);
        }
        return pane;
    }

    /**
     * Create a DomPortalHost into which the overlay content can be loaded.
     * @param pane The DOM element to turn into a portal host.
     * @returns A portal host for the given DOM element.
     */
    private _createPortalHost(pane: HTMLElement): DomPortalHost {
        return new DomPortalHost(
            pane,
            this._componentFactoryResolver,
            this._appRef
        );
    }

    /**
     * Creates an OverlayRef for an overlay in the given DOM element.
     * @param pane DOM element for the overlay
     */
    private _createOverlayRef(pane: HTMLElement): OverlayRef {
        return new OverlayRef(this._createPortalHost(pane));
    }
}
