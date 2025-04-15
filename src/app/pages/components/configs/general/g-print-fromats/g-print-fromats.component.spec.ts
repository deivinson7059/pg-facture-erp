import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPrintFromatsComponent } from './g-print-fromats.component';

describe('GPrintFromatsComponent', () => {
  let component: GPrintFromatsComponent;
  let fixture: ComponentFixture<GPrintFromatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GPrintFromatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GPrintFromatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
