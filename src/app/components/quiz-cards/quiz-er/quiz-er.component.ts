import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import questions from './questions-ER.json';
import { MatIconModule } from '@angular/material/icon';

interface Question {
  id: number;
  paragraph: string;
  situation: string;
  indication: string;
  Option_1: string;
  Option_2: string;
  Option_3: string;
  Option_4: string;
}

@Component({
  selector: 'app-quiz-er',
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragPlaceholder, MatListModule, MatCardModule, MatIconModule],
  templateUrl: './quiz-er.component.html',
  styleUrls: ['./quiz-er.component.css']
})
export class QuizERComponent implements OnInit, OnChanges {
  @Input() questionIndex: number = 0;
  @Input() showSliders: boolean = false;  // Nueva propiedad
  @Output() saveOrder = new EventEmitter<number[]>();
  @Input() disableDragDrop: boolean = false;
  @Input() sliderValues: number[] = new Array(40).fill(50); // Inicializamos con 50 para cada slider
  @Output() sliderValuesChange = new EventEmitter<number[]>();

  question: Question | undefined;
  options: string[] = [];

  ngOnInit(): void {
    this.loadQuestion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionIndex']) {
      this.loadQuestion();
    }
  }

  loadQuestion(): void {
    this.question = questions.question[this.questionIndex];
    if (this.question) {
      this.options = [
        this.question.Option_1,
        this.question.Option_2,
        this.question.Option_3,
        this.question.Option_4
      ];
    }
  }

  toggleSliders(): void {
    this.showSliders = !this.showSliders;
  }

  getFormattedParagraph(): string | undefined {
    if (!this.question) return undefined;
    const sentences = this.question.paragraph.split('.');
    let formattedText = '';
    for (let i = 0; i < sentences.length; i++) {
      formattedText += sentences[i].trim();
      if (i % 2 === 1 && i < sentences.length - 1) {
        formattedText += '.<br><br>';  // Añade un salto de línea después del segundo punto
      } else if (i < sentences.length - 1) {
        formattedText += '. ';
      }
    }
    return formattedText;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.options, event.previousIndex, event.currentIndex);
    this.saveOrder.emit(this.options.map(option => this.getOptionNumber(option)));
  }

  getOptionNumber(option: string): number {
    const options = [
      this.question?.Option_1,
      this.question?.Option_2,
      this.question?.Option_3,
      this.question?.Option_4
    ];
    const index = options.findIndex(opt => opt === option);
    return index + 1;
  }

  // Emitir un cambio cuando un slider se actualiza
  onSliderChange(idx: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = Number(inputElement.value);
    this.sliderValues[idx] = value; // Actualizar el valor del slider en el array
    this.sliderValuesChange.emit(this.sliderValues); // Emitir el nuevo array de valores
  }
}
