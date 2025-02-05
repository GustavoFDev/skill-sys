import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CreenciaspDialogComponent } from '../../help-dialog/creenciasp-dialog/creenciasp-dialog.component';
import { CreenciaspService } from '../../core/services/creenciasp/creenciasp.service';
import { ApplicantService } from '../../core/services/applicant.service';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';
import { Router } from '@angular/router';
import { QuizCards3Component } from '../../components/quiz-cards/quiz-cards3/quiz-cards3.component';


@Component({
  selector: 'app-creenciasp3',
  standalone: true,
  imports: [CommonModule, QuizCards3Component, MatButtonModule, MatIconModule], 
  templateUrl: './creenciasp3.component.html',
  styleUrl: './creenciasp3.component.css'
})
export class Creenciasp3Component implements OnInit {
  step: number = 1;
  countdown: number = 300; // Tiempo en segundos
  countdownSubscription: Subscription = new Subscription(); 
  showTimer: boolean = true; // Control de visibilidad del temporizador
  sliderValues: number[] = []; 
  responses: { [key: string]: number | string | { minutes: number; seconds: number } } = {}; 

  constructor(public dialog: MatDialog, private creenciaspService: CreenciaspService, private applicantService: ApplicantService, private router : Router) { }

  // aqui tengo funciones del timer para iniciar, checar los minutos, segundos etc
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
  // Triggers para sig, atras, del stepper
  nextStep(): void {
    if (this.step < 12) {
      this.step++;
      if (this.step === 2) {
        this.startCountdown();
      }
      if (this.step > 2) {
        this.saveState();
      }
    }
  }
  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }
  // aqui mero se abre el dialogo de ayudita y tambien el de finalizacion
  openHelpDialog(): void {
    this.dialog.open(CreenciaspDialogComponent);
  }
  openFinishDialog(): void {
    const dialogRef = this.dialog.open(FinishDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'finish') {
        this.finish();
      }
    });
  }
  //Aqui mero creamos el objeto con los valores de cada pregunta y se lo asignamos al "responses"
  saveResponse(index: number, value: number): void {
    const responseKey = `mcp4_${index + 1}`;
    this.responses[responseKey] = value;
  }
  // Con esta funcion preparamos los datos antes de enviarlos completamente
  // Las preguntas no contestadas se les asigna el valor base que es 50 y se agregan a responses
  // Se tima el tiempo que resta en segundos y se agrega al responses
  // Se toma el step donde va y se agrega al responses
  finish() {
    console.log('Finalizando el proceso...');

    // Preguntas no respondidas
    for (let i = 1; i <= 31; i++) {
      const responseKey = `mcp4_${i + 1}`;
      if (!(responseKey in this.responses)) {
        this.responses[responseKey] = 50;
      }
    }
    // Tiempo restante y el step
    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    this.responses['remaining_time'] = remainingTimeInSeconds;
    this.responses['current_step'] = this.step;
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    // Aqui mero sacamos el ID del aplicante desde el localstorage y lo asignamos al sesponses
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.responses['applicant_id'] = applicantId;
    }
    // Aqui mandamos todo a la BD y nos redirecciona al siguiente quiz
    this.creenciaspService.sendFormData3(this.responses).subscribe(
      {
        next: (response) => {
          console.log('Datos enviados correctamente:', response);
          this.router.navigate(['/razonamiento_numerico']);
        },
        error: (error) => {
          console.error('Error al enviar los datos:', error);
        }
      }
    );

  }

  //Aqui guardo todo en el localstorage para ver como no perder el progreso
  saveState() {

    for (let i = 1; i <= 31; i++) {
      const responseKey = `mcp4_${i + 1}`;
      if (!(responseKey in this.responses)) {
        this.responses[responseKey] = 50;
      }
    }
    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    this.responses['remaining_time'] = remainingTimeInSeconds;
    this.responses['current_step'] = this.step;
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.responses['applicant_id'] = applicantId;
    }
    localStorage.setItem('quizState_4', JSON.stringify(this.responses));
  }
  //Aqui guardo todo en el localstorage para ver como no perder el progreso
  ngOnInit() {
    this.loadState();
  }
  loadState() {
    const savedState = localStorage.getItem('quizState_4');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.step = state.current_step;
      this.countdown = state.remaining_time;
      this.responses = state;
      for (let i = 1; i <= 31; i++) {
        const responseKey = `mcp4_${i + 1}`;
        if (responseKey in this.responses) {
          this.sliderValues[i] = Number(this.responses[responseKey]);
        } else {
          this.sliderValues[i] = 50; // valor por defecto
        }
      }
      if (this.step > 2) {
        this.startCountdown();
      }
    }
  }

}