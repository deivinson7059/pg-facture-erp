import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GAdjustmentsComponent } from './g-adjustments.component';

describe('GAdjustmentsComponent', () => {
  let component: GAdjustmentsComponent;
  let fixture: ComponentFixture<GAdjustmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GAdjustmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GAdjustmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
