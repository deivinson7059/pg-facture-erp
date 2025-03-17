import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsDropdownButtonComponent } from './utils-dropdown-button.component';

describe('DropdownButtonComponent', () => {
    let component: UtilsDropdownButtonComponent;
    let fixture: ComponentFixture<UtilsDropdownButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UtilsDropdownButtonComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UtilsDropdownButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
