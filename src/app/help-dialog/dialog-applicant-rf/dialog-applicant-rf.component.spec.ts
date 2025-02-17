import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogApplicantRFComponent } from './dialog-applicant-rf.component';

describe('DialogApplicantRFComponent', () => {
  let component: DialogApplicantRFComponent;
  let fixture: ComponentFixture<DialogApplicantRFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogApplicantRFComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogApplicantRFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
