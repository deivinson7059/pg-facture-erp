import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsToastr } from './utils-toastr.component';

describe('UtilsToastrComponent', () => {
    let component: UtilsToastr;
    let fixture: ComponentFixture<UtilsToastr>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UtilsToastr]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UtilsToastr);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
