import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CreenciaspService } from '../../core/services/creenciasp/creenciasp.service';
import { ApplicantService } from '../../core/services/applicant.service';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';
import { Router } from '@angular/router';
import { QuizCards3Component } from '../../components/quiz-cards/quiz-cards3/quiz-cards3.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-creenciasp3',
  standalone: true,
  imports: [CommonModule, QuizCards3Component, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule], 
  templateUrl: './creenciasp3.component.html',
  styleUrl: './creenciasp3.component.css'
})
export class Creenciasp3Component implements OnInit {
  step: number = 1;
  countdown: number = 600; // Tiempo en segundos
  countdownSubscription: Subscription = new Subscription(); 
  showTimer: boolean = true; // Control de visibilidad del temporizador
  sliderValues: number[] = []; 
  responses: { [key: string]: number | string | { minutes: number; seconds: number } } = {}; 
  previousStepValue: number = 1;
  previousCountdown: number = 600;

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
      this.saveCurrentStepResponses();// Enviar respuestas antes de avanzar
      if (this.step === 2) {
        this.startCountdown();
      }
      if (this.step > 2) {
        this.saveState();
      }
    }
  }

  okNext(): void {
    if (this.previousStepValue === undefined || this.previousStepValue === 1) {
      this.step = 2;
    } else {
      this.step = this.previousStepValue;
    }
  
    if (this.step >= 2) {
      this.startCountdown();
      this.showTimer = true;
    }
  
    // Si es el primer step, crear el registro en la base de datos
    if (this.step === 2) {
      this.createInitialRecord();
    }
  }



previousStep(): void {
  if (this.step > 1) {
    this.step--;

  }
}

  createInitialRecord(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (!applicantId) return;
  
    // Valores iniciales por defecto
    const initialResponses: { [key: string]: number } = {};
    for (let i = 1; i <= 31; i++) {
      initialResponses[`mcp4_${i}`] = 50; // Valor por defecto
    }
  
    const initialData = {
      ...initialResponses,
      remaining_time: this.countdown,
      current_step: this.step,
      applicant_id: applicantId
    };
  
    this.creenciaspService.sendFormData3(initialData).subscribe({
      next: (response) => {
        console.log('Registro inicial creado en la BD:', response);
      },
      error: (error) => {
        console.error('Error al crear el registro inicial:', error);
      }
    });
  }

  saveCurrentStepResponses(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (!applicantId) return;
  
    const startIndex = (this.step - 1) * 3; // Índice de inicio basado en el step actual
    const stepResponses: { [key: string]: number } = {};
  
    for (let i = 1; i <= 3; i++) {
      const questionNumber = startIndex + i;
      
      // Asegurar que no se pasen las 48 preguntas
      if (questionNumber > 31) break;
  
      const responseKey = `mcp4_${questionNumber}`;
      stepResponses[responseKey] = this.responses[responseKey] !== undefined ? Number(this.responses[responseKey]) : 50;
    }
  
    // 🔹 Fusionar con respuestas previas
    this.responses = { ...this.responses, ...stepResponses };
  
    const updateData = {
      ...this.responses,
      remaining_time: this.countdown,
      current_step: this.step
    };
  
    this.creenciaspService.updateFormData3(applicantId, updateData).subscribe({
      next: (response) => {
        console.log('Respuestas del step enviadas:', response);
      },
      error: (error) => {
        console.error('Error al actualizar respuestas:', error);
      }
    });
  }

  // aqui mero se abre el dialogo de ayudita 
  openHelpDialog(): void {
    // Estado actual 
    this.previousStepValue = this.step;
    this.previousCountdown = this.countdown;

     // Regresamos al step 1 y pausamos el contador
     this.step = 1;
     this.showTimer = false;
     if (this.countdownSubscription) {
       this.countdownSubscription.unsubscribe(); 
     }
  }

  closeHelp(): void {
    // Restauramos el step y el tiempo
    this.step = this.previousStepValue;
    this.countdown = this.previousCountdown;

    if (this.step >= 2) {
      this.startCountdown();
      this.showTimer = true; 
    }
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
    const responseKey = `mcp4_${index}`;
    this.responses[responseKey] = value;
  }

  // Con esta funcion preparamos los datos antes de enviarlos completamente
  // Las preguntas no contestadas se les asigna el valor base que es 50 y se agregan a responses
  // Se tima el tiempo que resta en segundos y se agrega al responses
  // Se toma el step donde va y se agrega al responses
  finish(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (!applicantId) return;
  
    // Asegurarnos de que se tomen los últimos 3 valores sin pasarnos de 48
    const stepResponses: { [key: string]: number } = {};
    for (let i = 31; i <= 31; i++) {
      const responseKey = `mcp4_${i}`;
      stepResponses[responseKey] = this.responses[responseKey] !== undefined ? Number(this.responses[responseKey]) : 50;
    }
  
    // 🔹 Fusionar con respuestas previas
    this.responses = { ...this.responses, ...stepResponses };
  
    const updateData = {
      ...this.responses,
      remaining_time: this.countdown,
      current_step: this.step
    };
  
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  
    // Enviar las respuestas finales
    this.creenciaspService.updateFormData3(applicantId, updateData).subscribe({
      next: (response) => {
        console.log('Datos finales enviados correctamente:', response);
        this.router.navigate(['/conteneo_figuras']); // Redirigir después de guardar
      },
      error: (error) => {
        console.error('Error al enviar los datos finales:', error);
      }
    });
  }

  //Aqui guardo todo en el localstorage para ver como no perder el progreso
  saveState() {

    for (let i = 1; i <= 31; i++) {
      const responseKey = `mcp4_${i}`;
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
    this.applicantService.checkApplicantStatusAndRedirect();
    this.loadOrFetchState();
  }

  loadState() {
    const savedState = localStorage.getItem('quizState_4');

    if (savedState) {
      const state = JSON.parse(savedState);
      this.step = state.current_step;
      this.countdown = state.remaining_time;
      this.responses = state;
      for (let i = 1; i <= 31; i++) {
        const responseKey = `mcp4_${i}`;
        if (responseKey in this.responses) {
          this.sliderValues[i] = Number(this.responses[responseKey]);
        } else {
          this.sliderValues[i] = 50; // valor por defecto
        }
      }
      if (this.step >= 2) {
        this.startCountdown();
      }
    }
  }

  
  loadOrFetchState() {
    const savedState = localStorage.getItem('quizState_4');
  
    if (savedState) {
      this.loadState(); // Si existe en localStorage, lo carga directamente
    } else {
      const applicantId = this.applicantService.getApplicantId();
      if (!applicantId) return;
  
      this.creenciaspService.getCreenciasByApplicantId3(applicantId).subscribe({
        next: (data) => {
          if (Array.isArray(data) && data.length > 0) {
            const formattedData = { ...data[0] }; // Tomar el primer elemento del array
  
            // Eliminar propiedades innecesarias (si no quieres guardarlas en el localStorage)
            delete formattedData.applicant_id;
            delete formattedData.id;
            delete formattedData.created_at;
  
            localStorage.setItem('quizState_4', JSON.stringify(formattedData));
            this.loadState(); // Cargar los datos del localStorage después de guardarlos
          }
        },
        error: (error) => {
          console.error('Error al obtener datos del servidor:', error);
        }
      });
    }
  }
  

}