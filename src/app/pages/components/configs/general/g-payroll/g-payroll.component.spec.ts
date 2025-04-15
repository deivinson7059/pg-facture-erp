import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPayrollComponent } from './g-payroll.component';

describe('GPayrollComponent', () => {
  let component: GPayrollComponent;
  let fixture: ComponentFixture<GPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GPayrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
