import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCardComponent } from './verification-card.component';

describe('VerificationCardComponent', () => {
  let component: VerificationCardComponent;
  let fixture: ComponentFixture<VerificationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
