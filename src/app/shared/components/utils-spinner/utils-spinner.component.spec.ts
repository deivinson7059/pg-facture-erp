import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsSpinnerComponent } from './utils-spinner.component';

describe('UtilsSpinnerComponent', () => {
  let component: UtilsSpinnerComponent;
  let fixture: ComponentFixture<UtilsSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilsSpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilsSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
