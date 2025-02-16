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
  @Output() sliderValuesChange = new EventEmitter<number[]>();  // Agregar Output para sliders
  @Input() disableDragDrop: boolean = false;
  @Input() sliderValues: number[] = [50, 50, 50, 50];  // Solo los valores de los sliders actuales

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
      this.resetSliders();  // Reinicializar sliders al cambiar de step
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

  resetSliders(): void {
    this.sliderValues = [50, 50, 50, 50];  // Reinicializar sliders a 50
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

  drop(event: CdkDragDrop<number[]>, isDeposit: boolean = false) {
    if (this.disableDragDrop) {
      return;
    }

    const prevContainer = event.previousContainer;
    const currContainer = event.container;

    if (prevContainer !== currContainer) {
      if (isDeposit) {
        // Si el destino es el depósito, devolver el número correctamente
        transferArrayItem(prevContainer.data, currContainer.data, event.previousIndex, event.currentIndex);
      } else {
        // Si el destino es un cuadro de ordenamiento, solo mover si está vacío
        if (currContainer.data.length === 0) {
          transferArrayItem(prevContainer.data, currContainer.data, event.previousIndex, 0);
        } else {
          // Si ya hay un número en el cuadro de destino, hacer intercambio
          const prevValue = prevContainer.data[event.previousIndex];
          const currValue = currContainer.data[0];

          prevContainer.data[event.previousIndex] = currValue;
          currContainer.data[0] = prevValue;
        }
      }
    } else {
      // Permitir reordenar solo dentro del depósito
      if (isDeposit) {
        moveItemInArray(currContainer.data, event.previousIndex, event.currentIndex);
      }
    }

    // Restaurar números en el área original si se eliminan de los cuadros de ordenamiento
    this.restoreNumbers();

    this.saveOrder.emit(this.getOrder());
    this.updateDropzoneColors();
    this.checkIfCompleted();
  }

  checkIfCompleted() {
    this.saveOrder.emit(this.getOrder());
  }

  restoreNumbers() {
    // Obtener todos los números en las dropzones
    const assignedNumbers = this.dropzones.flat();

    // Filtrar solo los números que no están en las dropzones y reintegrarlos a numeros[]
    this.numeros = [1, 2, 3, 4].filter(num => !assignedNumbers.includes(num));

    // Verificar si algún número está en el depósito pero no en numeros[], y agregarlo
    const depositNumbers = [...this.numeros]; // Copia actual del depósito
    this.numeros = [...new Set([...this.numeros, ...depositNumbers])]; 
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
