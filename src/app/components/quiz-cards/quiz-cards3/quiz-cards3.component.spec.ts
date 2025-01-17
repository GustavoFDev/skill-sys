import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCards3Component } from './quiz-cards3.component';

describe('QuizCards3Component', () => {
  let component: QuizCards3Component;
  let fixture: ComponentFixture<QuizCards3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizCards3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizCards3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
