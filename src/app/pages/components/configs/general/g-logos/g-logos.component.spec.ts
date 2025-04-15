import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GLogosComponent } from './g-logos.component';

describe('GLogosComponent', () => {
  let component: GLogosComponent;
  let fixture: ComponentFixture<GLogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GLogosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GLogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
