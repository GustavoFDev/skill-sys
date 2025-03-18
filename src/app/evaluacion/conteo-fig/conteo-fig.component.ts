import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConteoCardsComponent } from '../../components/quiz-cards/conteo-cards/conteo-cards.component';
import { ApplicantService } from '../../core/services/applicant.service';
import { ConteofigService } from '../../core/services/conteofig/conteofig.service';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog'; 
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
    MatDialogModule, 
  ],
  templateUrl: './conteo-fig.component.html',
  styleUrls: ['./conteo-fig.component.css']
})
export class ConteoFigComponent {
  step: number = 1;
  currentStep: number = 1;
  responses: { [key: string]: number | string | null } = {};
  showPractice = false;
  showOkButton = false;
  timer: number = 0;
  timerInterval: any;
  isTimerRunning: boolean = false;
  showButtons: boolean = false; 

  figures: string[] = [
    'assets/figuras/cinta.png',
    'assets/figuras/0.png'
  ];
  currentIndex: number = 0;
  carouselInterval: any;
  userInput: number | null = null;
  feedbackMessage: string = '';

  
  savedState: {
    timer: number;
    currentIndex: number;
    responses: { [key: string]: number | string | null };
  } | null = null;

  constructor(
    private conteofigService: ConteofigService,
    private applicantService: ApplicantService,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.startAutoCarousel();
  }

  // Temporizador
  startCountdown() {
    this.isTimerRunning = true;
    this.timer = 10;
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.timerInterval);
        this.isTimerRunning = false;
        this.showButtons = true;
        if (this.showPractice) {
          this.openTimeoutDialog();
        }
      }
    }, 1000);
  }
  
  openTimeoutDialog(): void {
    this.dialog.open(ConteoDialogComponent, {
      data: { isTimeout: true }
    });
  }
  
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
      this.startAutoCarousel();
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

  handleInput(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.userInput === 8) {
        this.openDialog(true);
      } else {
        this.openDialog(false);
      }
      clearInterval(this.timerInterval);
      this.isTimerRunning = false;
      this.showButtons = true;
    }
  }
  
  openDialog(isCorrect: boolean): void {
    this.dialog.open(ConteoDialogComponent, { data: { isCorrect } });
  }

  // Reiniciar la práctica
  restartPractice() {
    this.step = 1;
    this.currentStep = 1;
    this.showPractice = false;
    this.timer = 0;
    this.currentIndex = 0;
    this.userInput = null;
    this.responses = {};
    this.isTimerRunning = false;
    this.showButtons = false;
  }

    openHelp() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval);
      }
      
      this.timer = 0;
      this.currentIndex = 0;
      this.userInput = null;
      this.showPractice = false;
      this.step = 1;
    }
    
  closeHelp() {
    if (this.savedState) {
      // Restaurar el estado
      this.timer = this.savedState.timer;
      this.currentIndex = this.savedState.currentIndex;
      this.responses = { ...this.savedState.responses };
      this.savedState = null;
    }
    // Volver al step 2 para continuar la evaluación
    this.step = 2;
    // Reanudar el temporizador
    if (this.timer > 0 && !this.isTimerRunning) {
      this.startCountdown();
    }
  }
}



