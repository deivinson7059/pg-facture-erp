import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatsAccountingComponent } from './seats-accounting.component';

describe('SeatsAccountingComponent', () => {
  let component: SeatsAccountingComponent;
  let fixture: ComponentFixture<SeatsAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatsAccountingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatsAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
