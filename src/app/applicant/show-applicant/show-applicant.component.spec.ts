import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowApplicantComponent } from './show-applicant.component';

describe('ShowApplicantComponent', () => {
  let component: ShowApplicantComponent;
  let fixture: ComponentFixture<ShowApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowApplicantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
