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
  responses: Record<string, number | string> = {};
  showSliders: boolean = false;
  disableDragDrop: boolean = false;
  sliderValues: Record<string, number> = {};  // Ajuste: Utilizamos un Record para guardar los valores de los sliders
  previousStepValue: number = 1;
  previousCountdown: number = 1500;

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
        if (this.step < 12) {
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

    } else if (this.step === 12 && !this.showSliders) {
      this.showSliders = true;
      this.disableDragDrop = true;
    } else if (this.step === 12 && this.showSliders) {
      this.openFinishDialog();
    }
  }

  okNext(): void {
    if (this.previousStepValue === undefined || this.previousStepValue === 1) {
      this.step = 2;  // Step 2 por defecto
    } else {
      this.step = this.previousStepValue;  // Si hay valor previo, mandamos a ese step
    }
    if (this.step >= 2) {
      this.startCountdown();
      this.showTimer = true;
    }
  }

  previousStep(): void {
    if (this.showSliders) {
      this.showSliders = false;
      this.disableDragDrop = false;
    }
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
        this.finish(); // Llamar a la función finish para enviar los datos a la base de datos
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
    if (this.step > 2) {  // Ignorar el step 2
      sliderValues.forEach((value, index) => {
        const sliderKey = (this.step - 3) * 4 + index + 1;
        this.sliderValues[`er_${sliderKey * 2}`] = value;
      });
      console.log(this.sliderValues);
    }
  }

  saveSliderValues(): void {
    if (this.step <= 2) {
      return;
    }

    localStorage.setItem('quizStateSliders', JSON.stringify(this.sliderValues));
    console.log('Slider values saved:', this.sliderValues);
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
      this.startCountdown();
      console.log('State loaded:', this.responses, this.countdown, this.step);
    }

    const savedSliders = localStorage.getItem('quizStateSliders');
    if (savedSliders) {
      this.sliderValues = JSON.parse(savedSliders); // Asignar directamente los valores a sliderValues
      console.log('Slider values loaded:', this.sliderValues);
    }
  }

  finish() {
    console.log('Finalizando el proceso...');
  
    // Unificar los registros impares y pares en un solo objeto
    const unifiedData: Record<string, any> = { ...this.responses, ...this.sliderValues };
  
    // Preguntas no respondidas
    for (let i = 1; i <= 40; i++) { // Ajusta el número de preguntas según tus necesidades
      const responseKeyImpar = `er_${i * 2 - 1}`;
      const responseKeyPar = `er_${i * 2}`;
      if (!(responseKeyImpar in unifiedData)) {
        unifiedData[responseKeyImpar] = 50; // valor predeterminado para respuestas no contestadas
      }
      if (!(responseKeyPar in unifiedData)) {
        unifiedData[responseKeyPar] = 50; // valor predeterminado para sliders no contestados
      }
    }
  
    // Tiempo restante y el step
    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    unifiedData['remaining_time'] = remainingTimeInSeconds;
    unifiedData['current_step'] = this.step;
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  
    // Aqui mero sacamos el ID del aplicante desde el localstorage y lo asignamos al unifiedData
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      unifiedData['applicant_id'] = applicantId;
    }
  
    // Verificación de datos antes de enviar
    console.log('Datos a enviar:', JSON.stringify(unifiedData, null, 2));
  
    // Aqui mandamos todo a la BD
    this.escenarios_realist.sendFormData(unifiedData).subscribe(
      {
        next: (response: any) => {
          console.log('Datos enviados correctamente:', response);
          this.router.navigate(['/creencias_personales2']);
        },
        error: (error: any) => {
          console.error('Error al enviar los datos:', error);
        }
      }
    );
  }
  
}
