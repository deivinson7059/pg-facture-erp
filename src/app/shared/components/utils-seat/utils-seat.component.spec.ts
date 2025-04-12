import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsSeatComponent } from './utils-seat.component';

describe('UtilsSeatComponent', () => {
  let component: UtilsSeatComponent;
  let fixture: ComponentFixture<UtilsSeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilsSeatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilsSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
