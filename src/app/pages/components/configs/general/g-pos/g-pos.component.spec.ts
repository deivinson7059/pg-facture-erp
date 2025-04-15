import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPosComponent } from './g-pos.component';

describe('GPosComponent', () => {
  let component: GPosComponent;
  let fixture: ComponentFixture<GPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GPosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
