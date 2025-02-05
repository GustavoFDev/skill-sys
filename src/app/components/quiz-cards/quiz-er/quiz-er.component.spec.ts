import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizERComponent } from './quiz-er.component';

describe('QuizERComponent', () => {
  let component: QuizERComponent;
  let fixture: ComponentFixture<QuizERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizERComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
