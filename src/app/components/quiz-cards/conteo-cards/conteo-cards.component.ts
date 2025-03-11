import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conteo-cards',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './conteo-cards.component.html',
  styleUrls: ['./conteo-cards.component.css']
})
export class ConteoCardsComponent implements OnInit {
  @Output() onAnswerSubmit = new EventEmitter<{ index: number, response: number | null, result: number }>();
  @Output() onQuizFinish = new EventEmitter<void>();

  figures: string[] = [];
  currentIndex: number = 0;
  isStopped: boolean = true;
  userInput: number | null = null;
  responses: { [key: string]: number | null } = {};
  
  // Temporizadores
  questionTimer: number = 10;  // 10 segundos por pregunta
  questionTimerInterval: any;
  
  totalTimer: number = 180;  // 3 minutos (180 segundos)
  totalTimerInterval: any;
  isTotalTimerRunning: boolean = false; // Para controlar si el timer global está en marcha

  isAdvancing: boolean = false;
  correctAnswer: { [key: string]: number } = {}; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('assets/figures.json').subscribe((data: any) => {
      if (data.length > 0) {
        this.figures = data[0].figure;
        this.startQuestionTimer();
        this.startTotalTimer(); // Iniciar el temporizador de 3 min
      }
    });

    this.http.get<{ [key: string]: number }>('assets/correct-answer.json').subscribe((data) => {
      this.correctAnswer = data;
    });
  }

  handleInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      clearInterval(this.questionTimerInterval);

      const key = `mcf_${this.currentIndex + 1}`;
      this.responses[key] = this.userInput !== null ? this.userInput : 0;
      this.emitAnswer();

      this.userInput = null;
      this.advanceCarousel();
    }
  }

  startQuestionTimer() {
    if (this.isStopped) { 
      this.questionTimer = 10;
      clearInterval(this.questionTimerInterval);

      this.questionTimerInterval = setInterval(() => {
        this.questionTimer--;
        if (this.questionTimer === 0) {
          clearInterval(this.questionTimerInterval);

          const key = `mcf_${this.currentIndex + 1}`;
          if (this.userInput === null) {
            this.responses[key] = 0;
          }

          this.emitAnswer();
          this.advanceCarousel();
        }
      }, 1000);
    }
  }

  startTotalTimer() {
    if (!this.isTotalTimerRunning) {
      this.isTotalTimerRunning = true; // Marcar que el temporizador está corriendo
      this.totalTimerInterval = setInterval(() => {
        if (!this.isStopped) return; // Solo se reduce cuando el carrusel está detenido
        if (this.totalTimer > 0) {
          this.totalTimer--;
        } else {
          clearInterval(this.totalTimerInterval);
          this.onQuizFinish.emit(); // Finalizar la prueba cuando llegue a 0
        }
      }, 1000);
    }
  }

  stopTotalTimer() {
    clearInterval(this.totalTimerInterval);
    this.isTotalTimerRunning = false; // Marcar que el temporizador está pausado
  }

  advanceCarousel() {
    if (this.isAdvancing) return;
    this.isAdvancing = true;
    
    this.isStopped = false; // El carrusel comienza a moverse
    this.stopTotalTimer(); // Pausar el temporizador global

    if (this.currentIndex < this.figures.length - 1) {
      this.currentIndex++;

      setTimeout(() => {
        this.isStopped = true; // El carrusel se detiene
        this.isAdvancing = false;
        this.startQuestionTimer(); // Reanudar temporizador de pregunta
        this.startTotalTimer(); // Reanudar temporizador de 3 min desde donde quedó
      }, 2000);
    } else {
      this.stopTotalTimer();
      this.onQuizFinish.emit();
    }
  }

  emitAnswer() {
    const key = `mcf_${this.currentIndex + 1}`;
    const response = this.responses[key];
  
    let result: number;
    if (response === null || response === 0) {
      result = 0;
    } else if (response === this.correctAnswer[key]) {
      result = 1;
    } else {
      result = 2;
    }
  
    this.responses[key] = result;
  
    this.onAnswerSubmit.emit({ index: this.currentIndex, response, result });
  }
  
  getTransform() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }
}