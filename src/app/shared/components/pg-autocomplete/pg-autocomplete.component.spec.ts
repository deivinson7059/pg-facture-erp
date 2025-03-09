import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgAutocompleteComponent } from './pg-autocomplete.component';

describe('PgAutocompleteComponent', () => {
  let component: PgAutocompleteComponent;
  let fixture: ComponentFixture<PgAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
