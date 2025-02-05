import { Component, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-number-cards',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './number-cards.component.html',
  styleUrls: ['./number-cards.component.css']
})
export class NumberCardsComponent {
  @Input() currentQuestion: number = 0;
  @Input() selectedOption: number | null = null;
  @Output() optionSelected = new EventEmitter<number>();

  quizData = [
    {
      options: ["33", "27", "23", "18", "13", "8"],
      correct: 1
    },
    {
      options: ["25", "23", "20", "16", "11", "6"],
      correct: 5
    },
    {
      options: ["9", "13", "15", "21", "25", "29"],
      correct: 2
    },
    {
      options: ["13", "15", "18", "24", "27", "33"],
      correct: 3
    },
    {
      options: ["9", "19", "28", "36", "41", "49"],
      correct: 4
    },
    {
      options: ["2", "6", "12", "34", "48", "96"],
      correct: 0
    },
    {
      options: ["11", "26", "39", "52", "65", "78"],
      correct: 0
    },
    {
      options: ["1", "8", "12", "22", "29", "36"],
      correct: 2
    },
    {
      options: ["4", "14", "24", "54", "44", "54"],
      correct: 3
    },
    {
      options: ["6", "14", "25", "33", "40", "46"],
      correct: 1
    }
  ];

  results: number[] = [];

  loadQuestion() {
    this.selectedOption = null;
  }

  selectOption(index: number) {
    this.selectedOption = index;
    this.optionSelected.emit(index);
  }
}
