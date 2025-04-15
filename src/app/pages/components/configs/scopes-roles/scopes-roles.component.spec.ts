import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopesRolesComponent } from './scopes-roles.component';

describe('ScopesRolesComponent', () => {
  let component: ScopesRolesComponent;
  let fixture: ComponentFixture<ScopesRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopesRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopesRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
