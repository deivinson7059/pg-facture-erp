import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GLegalComponent } from './g-legal.component';

describe('GLegalComponent', () => {
  let component: GLegalComponent;
  let fixture: ComponentFixture<GLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GLegalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
