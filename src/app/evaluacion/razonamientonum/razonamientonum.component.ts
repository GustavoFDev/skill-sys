import { Component, ViewChild } from '@angular/core';
import { NumberCardsComponent } from '../../components/number-cards/number-cards.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { RazonamientonumService } from '../../core/services/razonamientonum.service';
import { ApplicantService } from '../../core/services/applicant.service';
import { NumberDialogComponent } from '../../help-dialog/number-dialog/number-dialog.component';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';

@Component({
  selector: 'app-razonamientonum',
  standalone: true,
  imports: [NumberCardsComponent, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './razonamientonum.component.html',
  styleUrls: ['./razonamientonum.component.css']
})
export class RazonamientonumComponent {
  @ViewChild(NumberCardsComponent) numberCardsComponent!: NumberCardsComponent;
  // Inicializaciones
  currentQuestion = 0;
  step = 1; 
  selectedOptions: (number | null)[] = Array(10).fill(null);
  results: number[] = Array(10).fill(0);
  showMessage = false;
  countdown: number = 300; // Tiempo en segundos
  countdownSubscription: Subscription = new Subscription(); 
  showTimer: boolean = true; // Temporizador
  responses: { [key: string]: string | number } = {}; 

  constructor(public dialog: MatDialog, private razonamientonumService: RazonamientonumService, private applicantService: ApplicantService, private router: Router) {}

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    this.countdownSubscription = interval(1000).pipe(
      take(this.countdown)
    ).subscribe(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.finish();
      }
    });
  }

  get minutes(): number {
    return Math.floor(this.countdown / 60);
  }

  get seconds(): number {
    return this.countdown % 60;
  }

  toggleTimer(): void {
    this.showTimer = !this.showTimer;
  }

  openHelpDialog(): void {
    this.dialog.open(NumberDialogComponent);
  }

  nextStep() {
    this.showMessage = false; 

    if (this.step === 1 || this.step === 2) { // Se guardan las respuestas seleccionadas en el step actual antes de cambiar
      this.step++; 
    } else if (this.step >= 3 && this.step <= 12) {
      if (this.currentQuestion < 9) {
        if (this.numberCardsComponent) {
          this.selectedOptions[this.currentQuestion] = this.numberCardsComponent.selectedOption;
        }
        this.saveResult();
        this.currentQuestion++;
        this.step++;
        this.updateSelection();
      }
    } 
  }

  previousStep() { // Muestra el step anterior al actual con la información que se guardó con anterioridad
    if (this.step > 1) { 
      if (this.step >= 3 && this.step <= 12) {
        this.currentQuestion--;
        this.updateSelection();
      }
      this.step--;
    }
  }

  updateSelection() { // Actualización de la información
    if (this.numberCardsComponent) {
      this.numberCardsComponent.selectedOption = this.selectedOptions[this.currentQuestion];
    }
  }

  saveResult() { // Guarda la información elegida
    const selectedOption = this.selectedOptions[this.currentQuestion];
    if (selectedOption === null) {
      this.results[this.currentQuestion] = 0; // Nulo
    } else if (selectedOption === this.numberCardsComponent.quizData[this.currentQuestion].correct) {
      this.results[this.currentQuestion] = 1; // Correcto
    } else {
      this.results[this.currentQuestion] = 2; // Incorrecto
    }
  }

  finishDialog(){
    this.openFinishDialog();
  }

  openFinishDialog(): void {
    const dialogRef = this.dialog.open(FinishDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'finish') {
        this.finish();
      }
    });
  }

  finish() { 
    this.selectedOptions[this.currentQuestion] = this.numberCardsComponent.selectedOption;
    this.saveResult();

    // Crear los datos que se enviarán
    for (let i = 0; i < 10; i++) {
      this.responses[`mrn_${i + 1}`] = this.results[i] || 0;
    }

    // Tiempo restante
    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    this.responses['remaining_time'] = remainingTimeInSeconds;

    console.log('Datos a guardar:', this.responses); // Solo para consulta de datos

    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    
    this.sendResponsesToServer();
    this.router.navigate(['/creencias_personales4']);
  }

  sendResponsesToServer(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.responses['applicant_id'] = applicantId; 
    }

    this.razonamientonumService.sendFormData(this.responses).subscribe(
      {
        next : (response) => {
          console.log('Datos enviados correctamente:', response);
        },
        error : (error) => {
          console.error('Error al enviar los datos:', error);
        }
      }
    );
  }

  selectOption(option: number): void { 
    this.selectedOptions[this.currentQuestion] = option;
    if ((this.step === 1 && option === 5) || (this.step === 2 && option === 10)) {
      this.showMessage = true;
    } else {
      this.showMessage = false;
    }
  }
}
