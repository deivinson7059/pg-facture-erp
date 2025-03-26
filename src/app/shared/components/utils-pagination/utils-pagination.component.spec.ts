import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilsPaginationComponent } from './utils-pagination.component';

describe('UtilsPaginationComponent', () => {
  let component: UtilsPaginationComponent;
  let fixture: ComponentFixture<UtilsPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilsPaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilsPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
