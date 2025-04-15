import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GBarComponent } from './g-bar.component';

describe('GBarComponent', () => {
  let component: GBarComponent;
  let fixture: ComponentFixture<GBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
