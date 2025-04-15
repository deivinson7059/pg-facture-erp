import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GInvoiceComponent } from './g-invoice.component';

describe('GInvoiceComponent', () => {
  let component: GInvoiceComponent;
  let fixture: ComponentFixture<GInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
