import { EventEmitter } from '@angular/core';
import { UtilsPaginationInstance } from '@core/interfaces';

export class UtilsPaginationService {
    public change: EventEmitter<string> = new EventEmitter<string>();

    private instances: { [id: string]: UtilsPaginationInstance } = {};
    private DEFAULT_ID = 'DEFAULT_PAGINATION_ID';

    public defaultId(): string {
        return this.DEFAULT_ID;
    }

    /**
     * Register a UtilsPaginationInstance with this service. Returns a
     * boolean value signifying whether the instance is new or
     * updated (true = new or updated, false = unchanged).
     */
    public register(instance: UtilsPaginationInstance): boolean {
        if (instance.id == null) {
            instance.id = this.DEFAULT_ID;
        }

        if (!this.instances[instance.id]) {
            this.instances[instance.id] = instance;
            return true;
        } else {
            return this.updateInstance(instance);
        }
    }

    /**
     * Check each property of the instance and update any that have changed. Return
     * true if any changes were made, else return false.
     */
    private updateInstance(instance: UtilsPaginationInstance): boolean {
        let changed = false;
        for (let prop in this.instances[instance.id!]) {
            let instanceProp = instance[prop as keyof UtilsPaginationInstance];
            let defaultProp = this.instances[instance.id!][prop as keyof UtilsPaginationInstance];
            if (instanceProp !== defaultProp) {
                defaultProp = instance[prop as keyof UtilsPaginationInstance];
                changed = true;
            }
        }
        return changed;
    }

    /**
     * Returns the current page number.
     */
    public getCurrentPage(id: string): number {
        if (this.instances[id]) {
            return this.instances[id].currentPage;
        }
        return 1;
    }

    /**
     * Sets the current page number.
     */
    public setCurrentPage(id: string, page: number) {
        if (this.instances[id]) {
            let instance = this.instances[id];
            let maxPage = Math.ceil(instance.totalItems! / instance.itemsPerPage);
            if (page <= maxPage && 1 <= page) {
                this.instances[id].currentPage = page;
                this.change.emit(id);
            }
        }
    }

    /**
     * Sets the value of instance.totalItems
     */
    public setTotalItems(id: string, totalItems: number) {
        if (this.instances[id] && 0 <= totalItems) {
            this.instances[id].totalItems = totalItems;
            this.change.emit(id);
        }
    }

    /**
     * Sets the value of instance.itemsPerPage.
     */
    public setItemsPerPage(id: string, itemsPerPage: number) {
        if (this.instances[id]) {
            this.instances[id].itemsPerPage = itemsPerPage;
            this.change.emit(id);
        }
    }

    /**
     * Returns a clone of the pagination instance object matching the id. If no
     * id specified, returns the instance corresponding to the default id.
     */
    public getInstance(id: string = this.DEFAULT_ID): UtilsPaginationInstance {
        if (this.instances[id]) {
            return this.clone(this.instances[id]);
        }
        return {} as UtilsPaginationInstance;
    }

    /**
     * Perform a shallow clone of an object.
     */
    private clone(obj: any): any {
        var target: any = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                target[i] = obj[i];
            }
        }
        return target;
    }
}
