import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCards2Component } from './quiz-cards2.component';

describe('QuizCards2Component', () => {
  let component: QuizCards2Component;
  let fixture: ComponentFixture<QuizCards2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizCards2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizCards2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
