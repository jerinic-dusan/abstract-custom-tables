import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEditorDialogComponent } from './detail-editor-dialog.component';

describe('DetailEditorDialogComponent', () => {
  let component: DetailEditorDialogComponent;
  let fixture: ComponentFixture<DetailEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailEditorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
