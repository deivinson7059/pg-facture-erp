import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatsPayrollComponent } from './seats-payroll.component';

describe('SeatsPayrollComponent', () => {
  let component: SeatsPayrollComponent;
  let fixture: ComponentFixture<SeatsPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatsPayrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatsPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
