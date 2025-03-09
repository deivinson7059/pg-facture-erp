import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAutocompleteComponent } from './customer-autocomplete.component';

describe('CustomerAutocompleteComponent', () => {
  let component: CustomerAutocompleteComponent;
  let fixture: ComponentFixture<CustomerAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
