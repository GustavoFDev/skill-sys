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
  sliderValues: { [key: number]: number[] } = {}; // Cambiado para guardar los valores por step
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
        // Función de finish
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

    if (this.step < 13) {
      if (this.showSliders) {
        this.showSliders = false;
        this.disableDragDrop = false;
        if (this.step < 12){
          this.step++;
        }
      } else {
        this.showSliders = true;
        this.disableDragDrop = true;
        return;
      }

      if (this.step === 3) {
        this.startCountdown();
      }
      if (this.step > 3) {
        this.saveState();
      }

      // Guardar los valores de los sliders al pasar de step
      this.saveSliderValues();

      if (this.quizErComponent) {
        this.quizErComponent.resetDragAndDrop();
      }
    }
  }

  previousStep(): void {
    if (this.showSliders) {
      this.showSliders = false;
      this.disableDragDrop = false;
    }
  }

  openHelpDialog(): void {
    this.dialog.open(EscenariosDialogComponent);
  }

  openFinishDialog(): void {
    const dialogRef = this.dialog.open(FinishDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'finish') {
        // Función para enviar los datos a la base de datos
      }
    });
  }

  saveOrder(order: number[]): void {
    if (this.step <= 2) {
      return;
    }
  
    const startIndex = (this.step - 3) * 4;
    const defaultOrder = [1, 2, 3, 4];
  
    for (let i = 0; i < 4; i++) {
      const actualIndex = startIndex + i + 1;
  
      // Guardar el valor del orden en índices impares
      const orderKey = actualIndex * 2 - 1;
      const orderValue = order[i] !== undefined ? order[i] : defaultOrder[i];
      this.responses[`er_${orderKey}`] = orderValue;
    }
  
    console.log(this.responses);
  }
  

  handleSliderValuesChange(sliderValues: number[]): void {
    this.sliderValues[this.step - 3] = sliderValues;
    console.log(this.sliderValues);
  }

  saveSliderValues(): void {
    const quizStateER = JSON.parse(localStorage.getItem('quizStateER') || '{}');
    const flatSliderValues = Object.values(this.sliderValues).flat(); // Obtener todos los valores de sliders en una sola lista
  
    for (let i = 0; i < flatSliderValues.length; i++) {
      const sliderKey = (i + 1) * 2;
      quizStateER[`er_${sliderKey}`] = flatSliderValues[i];
    }
  
    localStorage.setItem('quizStateER', JSON.stringify(quizStateER));
    console.log(quizStateER);
  }
  
  

  saveState(): void {
    for (let i = 1; i <= 80; i++) {
      if (!(this.responses.hasOwnProperty(`er_${i}`))) {
        // Asignar valores no contestados a 50
        const sliderValue = 50;
        this.responses[`er_${i}`] = sliderValue;
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


  isCompleted(): boolean {
    return this.quizErComponent?.dropzones.every(zone => zone.length > 0) ?? false;
  }

  loadState() {
    const savedState = localStorage.getItem('quizStateER');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.responses = state;  // Cargar el estado directamente en this.responses
  
      // Establecer el tiempo restante
      this.countdown = state.remaining_time || 1500;
  
      // Establecer el paso actual
      this.step = state.current_step || 1;
  
      console.log('State loaded:', this.responses, this.countdown, this.step);
    }
  }

  finish() {
    const data = {
      responses: this.responses,
      applicant_id: this.responses['applicant_id'],
      remaining_time: this.responses['remaining_time'],
      current_step: this.responses['current_step']
    };
  
    this.escenarios_realist.sendFormData(data).subscribe(
      response => {
        console.log('Data sent successfully:', response);
        // Redirigir a otra página o mostrar mensaje de éxito
        this.router.navigate(['/success']);  // Cambiar la ruta según sea necesario
      },
      error => {
        console.error('Error sending data:', error);
        // Manejar el error, mostrar mensaje de error
      }
    );
  }
  
  
}
