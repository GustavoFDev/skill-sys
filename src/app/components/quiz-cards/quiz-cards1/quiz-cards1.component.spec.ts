import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCards1Component } from './quiz-cards1.component';

describe('QuizCards1Component', () => {
  let component: QuizCards1Component;
  let fixture: ComponentFixture<QuizCards1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizCards1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizCards1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
