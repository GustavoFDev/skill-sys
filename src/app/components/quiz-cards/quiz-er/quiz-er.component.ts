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
  @Output() sliderValuesChange = new EventEmitter<number[]>();
  @Input() disableDragDrop: boolean = false;
  @Input() sliderValues: number[] = [50, 50, 50, 50];

  maxValue: number = 50;     // Máximo global (definido por Slider 1)
  minValue: number = 50;    // Mínimo global (definido por Slider 4)
  maxValueS3: number = 50;   // Máximo del Slider 3 (definido por Slider 2)
  minValueS2: number = 50;   // Mínimo del Slider 2 (definido por Slider 3)

  dropzones: number[][] = [[], [], [], []];
  question: Question | undefined;
  options: string[] = [];
  numeros = [1, 2, 3, 4];
  ordenInterno: number[] = [];
  opcionesOrdenadas: any = {};
  

  // Variables para manejar el orden de los sliders sin interferencias
  sliderValuesOriginal: number[] = [50, 50, 50, 50];
  sliderValuesOrdenado: number[] = [50, 50, 50, 50];

  restrictionMin: number | undefined;
  restrictionMax: number | undefined;
  restrictionMinS2: number | undefined;
  restrictionMaxS3: number | undefined;

  constructor() {
    // Inicializar valores si es necesario
    this.restrictionMin = undefined;
    this.restrictionMax = undefined;
    this.restrictionMinS2 = undefined;
    this.restrictionMaxS3 = undefined;
  }

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
    this.resetSliders();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionIndex']) {
      this.loadQuestion();
      this.resetDragAndDrop();
      this.resetSliders();
      this.updateDropzoneColors();
    }
    if (changes['showSliders'] && this.showSliders) {
      this.changeOrderOptions(this.ordenInterno);
      this.resetSliders();
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
    this.sliderValues = [50, 50, 50, 50];
    this.sliderValuesOriginal = [...this.sliderValues]; 
    this.sliderValuesOrdenado = [...this.sliderValues];
  
    // Restablecer los límites y restricciones
    this.maxValue = 50;
    this.minValue = 50;
    this.maxValueS3 = 50;
    this.minValueS2 = 50;
  
    this.restrictionMin = undefined;
    this.restrictionMax = undefined;
    this.restrictionMinS2 = undefined;
    this.restrictionMaxS3 = undefined;
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
    let value = Number(inputElement.value);

    console.log(`Slider ${idx + 1} cambiado. Valor: ${value}`);

    // Variables para almacenar valores corregidos
    let correctedValue = value;

    // Aplicar restricciones según el índice del slider
    if (idx === 0) { // Slider 1
        if (this.minValue !== undefined) {
            correctedValue = Math.max(value, this.sliderValuesOriginal[1]); // No menor que Slider 2
        }
        if (this.sliderValuesOriginal[2] !== undefined) {
            correctedValue = Math.max(correctedValue, this.sliderValuesOriginal[2]); // No menor que Slider 3
        }
        this.maxValue = correctedValue;
        console.log(`Nuevo máximo global: ${this.maxValue}`);
    } 
    else if (idx === 3) { // Slider 4
        if (this.maxValue !== undefined) {
            correctedValue = Math.min(value, this.sliderValuesOriginal[2]); // No mayor que Slider 3
        }
        if (this.sliderValuesOriginal[1] !== undefined) {
            correctedValue = Math.min(correctedValue, this.sliderValuesOriginal[1]); // No mayor que Slider 2
        }
        this.minValue = correctedValue;
        console.log(`Nuevo mínimo global: ${this.minValue}`);
    } 

    if (idx === 1) { // Slider 2
        if (this.minValueS2 !== undefined) {
            correctedValue = Math.max(correctedValue, this.minValueS2); // No menor que mínimo de Slider 3
        }
        this.maxValueS3 = correctedValue; // Actualiza el máximo de Slider 3
        console.log(`Máximo permitido para Slider 3: ${this.maxValueS3}`);
    } 
    else if (idx === 2) { // Slider 3
        if (this.maxValueS3 !== undefined) {
            correctedValue = Math.min(correctedValue, this.maxValueS3); // No mayor que el máximo de Slider 2
        }
        this.minValueS2 = correctedValue; // Actualiza el mínimo de Slider 2
        console.log(`Mínimo permitido para Slider 2: ${this.minValueS2}`);
    }

    // Aplicar límites globales después de los límites específicos
    if (idx > 0 && idx < 3) {
        if (this.maxValue !== undefined) {
            correctedValue = Math.min(correctedValue, this.maxValue);
        }
        if (this.minValue !== undefined) {
            correctedValue = Math.max(correctedValue, this.minValue);
        }
    }

    // Si el valor fue corregido, actualizar el input para reflejarlo visualmente
    if (correctedValue !== value) {
        inputElement.value = correctedValue.toString();
    }

    // Guardar el valor corregido en sliderValuesOriginal
    this.sliderValuesOriginal[idx] = correctedValue;

    // Imprimir objeto completo en consola
    console.log('Valores actuales de los sliders:', this.sliderValuesOriginal);

    this.actualizarSliderValuesOrdenado();
}


actualizarSliderValuesOrdenado(): void {
  this.sliderValuesOrdenado = this.ordenInterno.map(idx => this.sliderValuesOriginal[idx - 1]);

  console.log('Valores ordenados:', this.sliderValuesOrdenado);

  // Emitir los valores ordenados al componente externo
  this.sliderValuesChange.emit([...this.sliderValuesOrdenado]);
}



  drop(event: CdkDragDrop<number[]>, isDeposit: boolean = false) {
    if (this.disableDragDrop) {
      return;
    }

    const prevContainer = event.previousContainer;
    const currContainer = event.container;

    if (prevContainer !== currContainer) {
      if (isDeposit) {
        transferArrayItem(prevContainer.data, currContainer.data, event.previousIndex, event.currentIndex);
      } else {
        if (currContainer.data.length === 0) {
          transferArrayItem(prevContainer.data, currContainer.data, event.previousIndex, 0);
        } else {
          const prevValue = prevContainer.data[event.previousIndex];
          const currValue = currContainer.data[0];

          prevContainer.data[event.previousIndex] = currValue;
          currContainer.data[0] = prevValue;
        }
      }
    } else {
      if (isDeposit) {
        moveItemInArray(currContainer.data, event.previousIndex, event.currentIndex);
      }
    }

    this.restoreNumbers();
    this.saveOrder.emit(this.getOrder());
    this.updateDropzoneColors();
    this.checkIfCompleted();
  }

  checkIfCompleted() {
    this.saveOrder.emit(this.getOrder());
  }

  restoreNumbers() {
    const assignedNumbers = this.dropzones.flat();
    this.numeros = [1, 2, 3, 4].filter(num => !assignedNumbers.includes(num));

    const depositNumbers = [...this.numeros];
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
      this.saveOrder.emit(this.getOrder());
    }
  }

  getOrder(): number[] {
    this.ordenInterno = this.dropzones.map(zone => zone.length > 0 ? zone[0] : 0);
    console.log(this.ordenInterno);
    return [...this.ordenInterno];
  }

  changeOrderOptions(ordenInterno: number[]): void {
    this.question = questions.question[this.questionIndex];
  
    if (this.question) {
      this.options = [
        this.question.Option_1,
        this.question.Option_2,
        this.question.Option_3,
        this.question.Option_4
      ];
  
      console.log("Opciones originales:", this.options);
      console.log("Orden interno:", ordenInterno);
  
      this.opcionesOrdenadas = {}; // Reiniciar el objeto de opciones ordenadas
  
      // Crear un nuevo objeto con el orden correcto
      for (let i = 0; i < ordenInterno.length; i++) {
        const nuevaPosicion = ordenInterno[i]; // En qué posición debe ir
        this.opcionesOrdenadas[`Option_${nuevaPosicion}`] = this.options[i]; // Tomar la opción en la posición actual
      }
  
      console.log("Opciones ordenadas:", this.opcionesOrdenadas);
    }
  }
}


