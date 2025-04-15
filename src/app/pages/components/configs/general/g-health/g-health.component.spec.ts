import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GHealthComponent } from './g-health.component';

describe('GHealthComponent', () => {
  let component: GHealthComponent;
  let fixture: ComponentFixture<GHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
