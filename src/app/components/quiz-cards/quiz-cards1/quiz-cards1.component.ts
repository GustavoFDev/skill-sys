import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import questions1 from './questions1.json';

interface Question {
  id: number;
  question: string;
}

@Component({
  selector: 'app-quiz-cards1',
  imports: [CommonModule, MatCardModule, MatSliderModule],
  standalone: true,
  templateUrl: './quiz-cards1.component.html',
  styleUrl: './quiz-cards1.component.css'
})
export class QuizCards1Component {
  @Input() questionIndex: number = 0;
  @Input() sliderValue: number = 50;
  @Output() sliderValueChange = new EventEmitter<number>();
  @Output() saveResponse = new EventEmitter<{ index: number; value: number }>();
  question: Question[] = [];

  ngOnInit(): void {
    this.question = questions1.question;
  }

  onSliderChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = Number(inputElement.value);
    this.sliderValueChange.emit(value);
    this.saveResponse.emit({ index: this.questionIndex, value });
  }

  getFormattedQuestion(): string {
    const questionText = this.question[this.questionIndex].question;
    const spaceIndex = questionText.indexOf(' ');
    const boldPart = questionText.substring(0, spaceIndex);
    const restOfText = questionText.substring(spaceIndex);
    return `<h3><strong>${boldPart}&nbsp;&nbsp;</strong></h3>${restOfText}`;
  }
  

}
