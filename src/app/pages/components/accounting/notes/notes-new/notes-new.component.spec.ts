import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesNewComponent } from './notes-new.component';

describe('NotesNewComponent', () => {
  let component: NotesNewComponent;
  let fixture: ComponentFixture<NotesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
