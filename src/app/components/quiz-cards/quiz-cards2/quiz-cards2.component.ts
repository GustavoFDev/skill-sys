import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import questions2 from './questions2.json';

interface Question {
  id: number;
  question: string;
}

@Component({
  selector: 'app-quiz-cards2',
  imports: [CommonModule, MatCardModule, MatSliderModule],
  standalone: true,
  templateUrl: './quiz-cards2.component.html',
  styleUrl: './quiz-cards2.component.css'
})
export class QuizCards2Component {
  @Input() questionIndex: number = 0;
  @Input() sliderValue: number = 50;
  @Output() sliderValueChange = new EventEmitter<number>();
  @Output() saveResponse = new EventEmitter<{ index: number; value: number }>();
  question: Question[] = [];

  ngOnInit(): void {
    this.question = questions2.question;
  }

  onSliderChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = Number(inputElement.value);
    this.sliderValueChange.emit(value);
    this.saveResponse.emit({ index: this.questionIndex, value });
  }


}
