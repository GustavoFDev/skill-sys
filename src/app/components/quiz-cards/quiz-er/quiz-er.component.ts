import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import questions from './questions-ER.json';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag, CdkDragDrop, CdkDropListGroup, CdkDropList, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';

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
  imports: [CommonModule, CdkDropList, CdkDrag, MatListModule, MatCardModule, MatIconModule, CdkDropListGroup],
  templateUrl: './quiz-er.component.html',
  styleUrls: ['./quiz-er.component.css']
})
export class QuizERComponent implements OnInit, OnChanges {
  @Input() questionIndex: number = 0;
  @Input() showSliders: boolean = false;
  @Output() saveOrder = new EventEmitter<number[]>();
  @Input() disableDragDrop: boolean = false;
  @Input() sliderValues: number[] = new Array(40).fill(50);
  @Output() sliderValuesChange = new EventEmitter<number[]>();

  dropzones: number[][] = [[], [], [], []];
  question: Question | undefined;
  options: string[] = [];
  numeros = [1, 2, 3, 4];

  colorMap: { [key: number]: string } = {
    1: 'green-box',
    2: 'yellow-box',
    3: 'blue-box',
    4: 'red-box'
  };

  getColorClass(numero: number): string {
    return this.colorMap[numero] || '';
  }

  ngOnInit(): void {
    this.loadQuestion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionIndex']) {
      this.loadQuestion();
      this.resetDragAndDrop();
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

  resetDragAndDrop(): void {
    this.numeros = [1, 2, 3, 4];
    this.dropzones = [[], [], [], []];
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
        formattedText += '.<br><br>';
      } else if (i < sentences.length - 1) {
        formattedText += '. ';
      }
    }
    return formattedText;
  }

  onSliderChange(idx: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = Number(inputElement.value);
    this.sliderValues[idx] = value;
    this.sliderValuesChange.emit(this.sliderValues);  // Emitir el valor actualizado al componente padre
  }
  

  drop(event: CdkDragDrop<number[]>) {
    if (this.disableDragDrop) {
      return;
    }
  
    // Lógica de arrastrar y soltar
    const prevContainer = event.previousContainer;
    const currContainer = event.container;
  
    if (prevContainer !== currContainer) {
      if (currContainer.data.length === 0) {
        transferArrayItem(prevContainer.data, currContainer.data, event.previousIndex, 0);
      } else {
        const prevValue = prevContainer.data[event.previousIndex];
        const currValue = currContainer.data[0];
  
        prevContainer.data[event.previousIndex] = currValue;
        currContainer.data[0] = prevValue;
      }
    } else {
      moveItemInArray(currContainer.data, event.previousIndex, event.currentIndex);
    }
  
    // Emitir evento de cambio
    this.saveOrder.emit(this.getOrder());
    this.updateDropzoneColors();
  
    // Avisar a EscenariosRealistComponent que los cuadros de destino cambiaron
    this.checkIfCompleted();
  }
  
  checkIfCompleted() {
    this.saveOrder.emit(this.getOrder());
  }
  

  updateDropzoneColors() {
    setTimeout(() => {
      const dropzones = document.querySelectorAll('.dropzone .box');
      dropzones.forEach((dropzone) => {
        const numero = Number(dropzone.textContent?.trim());
        if (!isNaN(numero)) {
          dropzone.classList.remove('green-box', 'yellow-box', 'blue-box', 'red-box');
          dropzone.classList.add(this.getColorClass(numero));
        }
      });
    });
  }

  assignNextNumber(dropzoneIndex: number) {
    const availableIndex = this.numeros.findIndex(num => !this.dropzones.some(zone => zone.includes(num)));
    if (availableIndex !== -1) {
      const selectedNumber = this.numeros.splice(availableIndex, 1)[0];
      this.dropzones[dropzoneIndex].push(selectedNumber);
      this.updateDropzoneColors();
    }
    this.updateDropzoneColors();
  }

  getOrder(): number[] {
    return this.dropzones.map(zone => zone.length > 0 ? zone[0] : 0);
  }
}
