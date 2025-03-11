import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConteoCardsComponent } from '../../components/quiz-cards/conteo-cards/conteo-cards.component';
import { ApplicantService } from '../../core/services/applicant.service';
import { ConteofigService } from '../../core/services/conteofig/conteofig.service';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog'; // Asegúrate de importar MatDialogModule
import { ConteoDialogComponent } from '../../help-dialog/conteo-dialog/conteo-dialog.component';

@Component({
  selector: 'app-conteo-fig',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    ConteoCardsComponent, 
    MatIconModule, 
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule, // Añadir MatDialogModule aquí
  ],
  templateUrl: './conteo-fig.component.html',
  styleUrls: ['./conteo-fig.component.css']
})
export class ConteoFigComponent {
  // Variables para navegación y temporizador
  step: number = 1;
  currentStep: number = 1;
  responses: { [key: string]: number | string | null } = {};
  showPractice = false;
  showOkButton = false;
  timer: number = 0;
  timerInterval: any;
  isTimerRunning: boolean = false; // Indicador para verificar si el temporizador está en marcha
  showButtons: boolean = false; 

  // Variables para el carrusel
  figures: string[] = [
    'assets/figuras/cinta.png',
    'assets/figuras/0.png'
  ];
  currentIndex: number = 0;
  carouselInterval: any;

  // Variables para el input y feedback
  userInput: number | null = null;
  feedbackMessage: string = '';

  constructor(
    private conteofigService: ConteofigService,
    private applicantService: ApplicantService,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.startAutoCarousel();
  }

  // Inicia el temporizador de 10 segundos
  startCountdown() {
    this.isTimerRunning = true;
    this.timer = 10;
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.timerInterval);
        this.isTimerRunning = false; // Detiene el temporizador
        this.showButtons = true; // Muestra los botones al finalizar el temporizador
        
        if (this.showPractice) {
          this.openTimeoutDialog(); // Abre el diálogo solo si showPractice es verdadero
        }
      }
    }, 1000);
  }
  
  openTimeoutDialog(): void {
    this.dialog.open(ConteoDialogComponent, {
      data: { isTimeout: true }
    });
  }
  
  
  // Inicia el carrusel y, al finalizar, inicia el temporizador
  startAutoCarousel() {
    if (this.showPractice) {
      this.carouselInterval = setInterval(() => {
        if (this.currentIndex < this.figures.length - 1) {
          this.currentIndex++;
        } else {
          clearInterval(this.carouselInterval);
          this.startCountdown();
        }
      }, 3000);
    }
  }

  // Calcula la transformación para deslizar el carrusel
  getTransform() {
    return `translateX(-${this.currentIndex * 125}%)`;
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startPractice() {
    this.showPractice = true;
    this.showButtons = false;
    setTimeout(() => {
      this.showOkButton = true;
      this.startAutoCarousel(); // Iniciar el carrusel al iniciar la práctica
    }, 500);
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
      this.currentStep = this.step;
    }
  }

  nextStep(): void {
    if (this.step < 3) {
      this.step++;
      this.currentStep = this.step;
    }
  }

  okNext(): void {
    if (this.step < 3) {
      this.step++;
      this.currentStep = this.step;
    }
  }

  processAnswer(data: { index: number; response: number | null; result: number }) {
    const key = `mcf_${data.index + 1}`;
    this.responses[key] = data.result;
    console.log(`${key}: ${data.result}`);
  }

  finish() {
    console.log('Finalizando el proceso...');
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.responses['applicant_id'] = applicantId;
    }
    for (let i = 1; i <= 27; i++) {
      const key = `mcf_${i}`;
      if (this.responses[key] === undefined || this.responses[key] === null) {
        this.responses[key] = 0;
      }
    }
    console.log(this.responses);
    this.conteofigService.sendFormData(this.responses).subscribe({
      next: (response) => {
        console.log('Datos enviados correctamente:', response);
        this.step = 3;
        this.currentStep = 3;
      },
      error: (error) => {
        console.error('Error al enviar los datos:', error);
      }
    });
  }

  // Maneja la entrada en el input; al presionar ENTER, compara con la respuesta correcta (8)
  handleInput(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.userInput === 8) {
        this.openDialog(true); // Abre el diálogo para respuesta correcta
      } else {
        this.openDialog(false); // Abre el diálogo para respuesta incorrecta
      }
      clearInterval(this.timerInterval); // Pausa el temporizador
      this.isTimerRunning = false; // Cambia el estado del temporizador
      this.showButtons = true; // Muestra los botones después de abrir el diálogo
    }
  }
  

  // Abre el diálogo basado en la respuesta
  openDialog(isCorrect: boolean): void {
    this.dialog.open(ConteoDialogComponent, { data: { isCorrect } });
  }

  // Reinicia la prueba y regresa al paso 1
  restartPractice() {
    this.step = 1;
    this.currentStep = 1;
    this.showPractice = false;
    this.timer = 0;
    this.currentIndex = 0;
    this.userInput = null;
    this.responses = {}; // Resetea las respuestas
    this.isTimerRunning = false; // Pausa el temporizador
    this.showButtons = false; // Oculta los botones
    // No iniciar el carrusel aquí
  }
}


