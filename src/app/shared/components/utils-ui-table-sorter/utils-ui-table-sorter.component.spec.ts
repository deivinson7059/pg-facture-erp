import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsUiTableSorterComponent } from './utils-ui-table-sorter.component';

describe('UtilsUiTableSorterComponent', () => {
  let component: UtilsUiTableSorterComponent;
  let fixture: ComponentFixture<UtilsUiTableSorterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilsUiTableSorterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilsUiTableSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
