import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPriceListComponent } from './g-price-list.component';

describe('GPriceListComponent', () => {
  let component: GPriceListComponent;
  let fixture: ComponentFixture<GPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GPriceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
