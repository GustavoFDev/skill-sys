import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConteoDialogComponent } from './conteo-dialog.component';

describe('ConteoDialogComponent', () => {
  let component: ConteoDialogComponent;
  let fixture: ComponentFixture<ConteoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConteoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConteoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
