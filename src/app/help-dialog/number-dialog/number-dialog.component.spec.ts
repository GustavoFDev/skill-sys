import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberDialogComponent } from './number-dialog.component';

describe('NumberDialogComponent', () => {
  let component: NumberDialogComponent;
  let fixture: ComponentFixture<NumberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
