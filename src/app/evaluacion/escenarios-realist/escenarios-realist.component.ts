import { Component } from '@angular/core';
import { QuizERComponent } from '../../components/quiz-cards/quiz-er/quiz-er.component';
import { MatIconModule } from '@angular/material/icon';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';
import { EscenariosDialogComponent } from '../../help-dialog/escenarios-dialog/escenarios-dialog.component';
import { ApplicantService } from '../../core/services/applicant.service';
import { Router } from '@angular/router';
import { Subscription, interval, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { EscenariosRealistService } from '../../core/services/escenarios-realist/escenarios-realist.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-escenarios-realist',
  imports: [QuizERComponent, MatIconModule, CommonModule, MatButtonModule, FormsModule, MatCardModule],
  templateUrl: './escenarios-realist.component.html',
  styleUrls: ['./escenarios-realist.component.css']
})
export class EscenariosRealistComponent {
  step: number = 1;
  countdown: number = 300; // Tiempo en segundos
  countdownSubscription: Subscription = new Subscription();
  showTimer: boolean = true; 
  sliderValues: number[] = [];
  responses: { [key: string]: number | string } = {};
  showSliders: boolean = false;  
  disableDragDrop: boolean = false;

  constructor(public dialog: MatDialog, private escenarios_realist: EscenariosRealistService, private applicantService: ApplicantService, private router: Router) {}

  ngOnInit() {
    this.loadState();
  }

  startCountdown() {
    this.countdownSubscription = interval(1000).pipe(
      take(this.countdown)
    ).subscribe(() => {
      this.countdown--;
      if (this.countdown === 0) {
        // aqui mero voy a poner la funcion de finish para enviar los datos a la base de datos
        //
        //
        //
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

  nextStep(): void {

    if (this.step === 1) {
      this.step++;
      return;
    }

    if (this.step < 12) {
      if (this.showSliders) { // aqui checo si los sliders ya se mostraron, ahora sí avanzamos de step y ocultamos sliders
        this.step++;
        this.showSliders = false;
      } else {  // en caso que no se han mostrado los sliders, los mostramos sin cambiar de step
        this.showSliders = true; 
        return; // forzamos la salid para que no avance de step aún
      }
      if (this.step === 3) {
        this.startCountdown();
      }
      if (this.step > 3) {
        this.saveState();
      }
    }
  }

  previousStep(): void {
    if (this.showSliders) { //En lugar de mandar al step anterior te va a ocultar lo sliders para que puedan modificar el orden de nuevo
      this.showSliders = false;
    } 
  }

  openHelpDialog(): void {
    this.dialog.open(EscenariosDialogComponent);
  }

  openFinishDialog(): void {
    const dialogRef = this.dialog.open(FinishDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'finish') {
        // aqui mero voy a poner la funcion de finish para enviar los datos a la base de datos
        //
        //
        //
      }
    });
  }
  saveOrder(order: number[]): void {
    const startIndex = (this.step - 2) * 4; // Calcular el índice de inicio según el paso
    const defaultOrder = [1, 2, 3, 4]; // Orden predeterminado
  
    for (let i = 0; i < 4; i++) { // Solo 4 elementos por paso
      const actualIndex = startIndex + i + 1; // Índice real en el paso
  
      if (actualIndex > 4) { // Ignorar los primeros 4 registros (ejemplo)
        const newKeyIndex = (actualIndex - 4) * 2 - 1; // Generar clave para el orden
  
        // Verificamos si el usuario ha cambiado el orden, si no, se usa el orden base
        const orderValue = order[i] !== undefined ? order[i] : defaultOrder[i]; 
        this.responses[`er_${newKeyIndex}`] = orderValue; // Guardar el valor del orden
  
        // Guardar el valor del slider asociado, si no tiene valor, se guarda 50 por defecto
        this.responses[`er_${newKeyIndex + 1}`] = this.sliderValues[i] || 50;
      }
    }
  }
  
  
  
  
  saveState() {
    for (let i = 1; i <= 80; i++) { // Deberían ser 80 registros (40 DnD + 40 sliders)
      if (!(this.responses.hasOwnProperty(`er_${i}`))) {
        this.responses[`er_${i}`] = i % 2 !== 0 ? 1 : 50; // Alternamos: Drag & Drop=1, Slider=50
      }
    }
  
    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    this.responses['remaining_time'] = remainingTimeInSeconds;
    this.responses['current_step'] = this.step;
    
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      this.responses['applicant_id'] = applicantId;
    }
  
    localStorage.setItem('quizStateER', JSON.stringify(this.responses));
  }
  

  loadState() {
   
    // con esta funcion debo cargar las respuestas ya hechas como en el de crencias pero en lugard e cargar todo solo los del step en el que se quedo
  }

}
