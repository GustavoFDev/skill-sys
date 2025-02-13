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
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-escenarios-realist',
  imports: [QuizERComponent, MatIconModule, CommonModule, MatButtonModule, FormsModule, MatCardModule],
  templateUrl: './escenarios-realist.component.html',
  styleUrls: ['./escenarios-realist.component.css']
})
export class EscenariosRealistComponent {
  step: number = 1;
  countdown: number = 1500; // Tiempo en segundos
  countdownSubscription: Subscription = new Subscription();
  showTimer: boolean = true;
  sliderValues: number[] = [];
  responses: Record<string, number | string> = {};
  showSliders: boolean = false;
  disableDragDrop: boolean = false;
  @ViewChild(QuizERComponent) quizErComponent?: QuizERComponent;


  constructor(public dialog: MatDialog, private escenarios_realist: EscenariosRealistService, private applicantService: ApplicantService, private router: Router) { }

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
      if (this.showSliders) {
        this.step++;
        this.showSliders = false;
        // Activamos el drag-and-drop cuando los sliders se ocultan
        this.disableDragDrop = false;
      } else {
        this.showSliders = true;
        // Desactivamos el drag-and-drop cuando los sliders se muestran
        this.disableDragDrop = true;
        return;
      }

      if (this.step === 3) {
        this.startCountdown();
      }
      if (this.step > 3) {
        this.saveState();
      }

      // Llamamos al reset después de que la vista se haya inicializado
      if (this.quizErComponent) {
        this.quizErComponent.resetDragAndDrop();
      }
    }
  }


  previousStep(): void {
    if (this.showSliders) {
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
      }
    });
  }

  // Dentro de EscenariosRealistComponent

  saveOrder(order: number[]): void {
    const startIndex = (this.step - 2) * 4;
    const defaultOrder = [1, 2, 3, 4];
  
    for (let i = 0; i < 4; i++) {
      const actualIndex = startIndex + i + 1;
  
      if (actualIndex > 4) {
        const newKeyIndex = (actualIndex - 4) * 2 - 1;
        const orderValue = order[i] !== undefined ? order[i] : defaultOrder[i];
        this.responses[`er_${newKeyIndex}`] = orderValue;
  
        // Aquí guardamos el valor del slider, si no hay valor asignado, se usa 50 como valor por defecto
        const sliderValue = this.sliderValues[i] !== undefined ? this.sliderValues[i] : 50;
        this.responses[`er_${newKeyIndex + 1}`] = sliderValue;  // Guardamos el valor del slider
      }
    }
  }
  
  
  saveState(): void {
    for (let i = 1; i <= 80; i++) {
      if (!(this.responses.hasOwnProperty(`er_${i}`))) {
        this.responses[`er_${i}`] = i % 2 !== 0 ? 1 : 50;
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
    // con esta funcion debo cargar las respuestas ya hechas como en el de creencias pero en lugar de cargar todo solo los del step en el que se quedó
  }

  isCompleted(): boolean {
    return this.quizErComponent?.dropzones.every(zone => zone.length > 0) ?? false;
  }
}
