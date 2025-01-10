import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import questions from './questions.json'; 

interface Question {
  id: number;
  question: string;
}

@Component({
  selector: 'app-quiz-cards',
  templateUrl: './quiz-cards.component.html',
  styleUrls: ['./quiz-cards.component.css'],
  standalone: true, 
  imports: [CommonModule, MatCardModule, MatSliderModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizCardsComponent implements OnInit {
  @Input() questionIndex: number = 0; 
  question: Question[] = [];

  ngOnInit(): void {
    this.question = questions.question; 
  }

  formatLabel(value: number): string {
    return value + '%';
  }
}

/*modificado*/