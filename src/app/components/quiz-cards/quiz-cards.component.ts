import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
  imports: [CommonModule, MatCardModule, MatSliderModule]
})
export class QuizCardsComponent implements OnInit {
  @Input() questionIndex: number = 0;
  @Input() sliderValue: number = 50; // Valor inicial del control deslizante
  @Output() sliderValueChange = new EventEmitter<number>(); // Emite cambios en el valor del control deslizante
  @Output() saveResponse = new EventEmitter<{index: number, value: number}>(); // Emite la respuesta guardada
  question: Question[] = [];

  ngOnInit(): void {
    this.question = questions.question; 
  }

  onSliderChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = Number(inputElement.value);
    this.sliderValueChange.emit(value); // Emite el nuevo valor del control deslizante
    this.saveResponse.emit({index: this.questionIndex, value}); // Emite la respuesta guardada
  }
}
