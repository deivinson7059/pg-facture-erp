import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsTypingComponent } from './utils-typing.component';

describe('TypingComponent', () => {
    let component: UtilsTypingComponent;
    let fixture: ComponentFixture<UtilsTypingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UtilsTypingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UtilsTypingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
