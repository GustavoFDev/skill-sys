import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreenciaspDialogComponent } from './creenciasp-dialog.component';

describe('CreenciaspDialogComponent', () => {
  let component: CreenciaspDialogComponent;
  let fixture: ComponentFixture<CreenciaspDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreenciaspDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreenciaspDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
