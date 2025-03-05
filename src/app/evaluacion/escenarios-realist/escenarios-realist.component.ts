import { Component } from '@angular/core';
import { QuizERComponent } from '../../components/quiz-cards/quiz-er/quiz-er.component';
import { MatIconModule } from '@angular/material/icon';
import { FinishDialogComponent } from '../../help-dialog/finish-dialog/finish-dialog/finish-dialog.component';
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
    this.applicantService.checkApplicantStatusAndRedirect();
    this.loadOrFetchState();
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

  nextStep(): void {
    if (this.step === 1) {
      this.step++;
      return;
    }

    if (this.step < 13) {
      if (this.showSliders) {
        this.showSliders = false;
        this.disableDragDrop = false;
        if (this.step === 2) {
          this.okNext();
          return;
        }
        if (this.step < 12) {
          this.step++;
        }
      } else {
        this.showSliders = true;
        this.disableDragDrop = true;
        return;
      }
      if (this.step > 3) {
        this.saveState();
        this.saveCurrentStepResponses();
      }
      // Guardar los valores de los sliders al pasar de step
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
      this.step = 3;  // Step 3 por defecto
    } else {
      this.step = this.previousStepValue;
    }
    if (this.step >= 2) {
      this.createInitialRecord();
      this.startCountdown();
      this.initializeDefaultOrder();
    }
  }

  createInitialRecord(): void {
    console.log('Creando registro inicial...');

    const initialData: Record<string, any> = {};
    const defaultOrder = [1, 2, 3, 4];

    // Inicializar respuestas con 1, 2, 3, 4 y sliders con 50
    for (let step = 3; step <= 12; step++) {
      const startIndex = (step - 3) * 4;

      for (let i = 0; i < 4; i++) {
        const actualIndex = startIndex + i + 1;
        const orderKey = actualIndex * 2 - 1; // Índice impar para orden
        const sliderKey = actualIndex * 2; // Índice par para slider

        initialData[`er_${orderKey}`] = defaultOrder[i]; // Orden (1-4)
        initialData[`er_${sliderKey}`] = 50; // Valor del slider (50)
      }
    }

    // Agregar el tiempo restante y el paso actual
    initialData['remaining_time'] = this.countdown;
    initialData['current_step'] = this.step;

    // Obtener el ID del aplicante y agregarlo al objeto
    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      initialData['applicant_id'] = applicantId;
    }

    // Verificación antes de enviar
    console.log('Datos iniciales a enviar:', JSON.stringify(initialData, null, 2));

    // Enviar datos a la base de datos
    this.escenarios_realist.sendFormData(initialData).subscribe({
      next: (response: any) => {
        console.log('Registro inicial creado correctamente:', response);
      },
      error: (error: any) => {
        console.error('Error al crear el registro inicial:', error);
      }
    });
  }

  saveCurrentStepResponses(): void {
    const applicantId = this.applicantService.getApplicantId();
    if (!applicantId) return;

    const stepStartIndex = (this.step - 4) * 8 + 1; // Calcula el índice inicial según el step
    const stepEndIndex = stepStartIndex + 7; // Calcula el índice final del step actual

    // Filtrar solo los valores correspondientes al step actual
    const filteredResponses: Record<string, any> = {};

    for (let i = stepStartIndex; i <= stepEndIndex; i++) {
      if (this.responses[`er_${i}`] !== undefined) {
        filteredResponses[`er_${i}`] = this.responses[`er_${i}`];
      }
      if (this.sliderValues[`er_${i}`] !== undefined) {
        filteredResponses[`er_${i}`] = this.sliderValues[`er_${i}`];
      }
    }

    filteredResponses['current_step'] = this.step;
    filteredResponses['remaining_time'] = this.countdown;

    this.escenarios_realist.updateFormData(applicantId, filteredResponses).subscribe({
      next: (response: any) => {
        console.log('Respuestas enviadas correctamente:', response);
      },
      error: (error: any) => {
        console.error('Error al actualizar las respuestas:', error);
      }
    });
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

    this.showSliders = false;
    this.disableDragDrop = false;
    this.step = 2;
    this.showTimer = false;
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
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

  initializeDefaultOrder(): void {
    const defaultOrder = [1, 2, 3, 4];

    for (let step = 3; step <= 12; step++) {
      const startIndex = (step - 3) * 4;

      for (let i = 0; i < 4; i++) {
        const actualIndex = startIndex + i + 1;
        const orderKey = actualIndex * 2 - 1;

        if (!(this.responses[`er_${orderKey}`])) {
          this.responses[`er_${orderKey}`] = defaultOrder[i];
        }
      }
    }
  }


  handleSliderValuesChange(sliderValues: number[]): void {
    console.log(this.sliderValues);
    if (this.step > 2) {  // Ignorar el step 2
      sliderValues.forEach((value, index) => {
        const sliderKey = (this.step - 3) * 4 + index + 1;
        this.sliderValues[`er_${sliderKey * 2}`] = value;
        console.log(this.sliderValues);
      });

    }
  }

  saveState(): void {
    if (this.step <= 2) {
      return;
    }

    // Fusionar responses con sliderValues
    const mergedData = { ...this.responses, ...this.sliderValues };

    const remainingTimeInSeconds = this.minutes * 60 + this.seconds;
    mergedData['remaining_time'] = remainingTimeInSeconds;
    mergedData['current_step'] = this.step;

    const applicantId = this.applicantService.getApplicantId();
    if (applicantId) {
      mergedData['applicant_id'] = applicantId;
    }

    localStorage.setItem('quizStateER', JSON.stringify(mergedData));
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
    const applicantId = this.applicantService.getApplicantId();
    if (!applicantId) return;

    const stepStartIndex = (this.step - 3) * 8 + 1; // Calcula el índice inicial según el step
    const stepEndIndex = stepStartIndex + 7; // Calcula el índice final del step actual

    // Filtrar solo los valores correspondientes al step actual
    const filteredResponses: Record<string, any> = {};

    for (let i = stepStartIndex; i <= stepEndIndex; i++) {
      if (this.responses[`er_${i}`] !== undefined) {
        filteredResponses[`er_${i}`] = this.responses[`er_${i}`];
      }
      if (this.sliderValues[`er_${i}`] !== undefined) {
        filteredResponses[`er_${i}`] = this.sliderValues[`er_${i}`];
      }
    }

    filteredResponses['current_step'] = this.step;
    filteredResponses['remaining_time'] = this.countdown;

    this.escenarios_realist.updateFormData(applicantId, filteredResponses).subscribe({
      next: (response: any) => {
        console.log('Respuestas enviadas correctamente:', response);
        this.router.navigate(['/creencias_personales2']);
      },
      error: (error: any) => {
        console.error('Error al actualizar las respuestas:', error);
      }
    });
  }

  loadOrFetchState() {
    const savedState = localStorage.getItem('quizStateER');

    if (savedState) {
      this.loadState(); // Si existe en localStorage, lo carga directamente
    } else {
      const applicantId = this.applicantService.getApplicantId();
      if (!applicantId) return;

      this.escenarios_realist.getRazonamientoByApplicantId(applicantId).subscribe({
        next: (data) => {
          if (Array.isArray(data) && data.length > 0) {
            const formattedData = { ...data[0] }; // Tomar el primer elemento del array

            // Eliminar propiedades innecesarias
            delete formattedData.applicant_id;
            delete formattedData.id;
            delete formattedData.created_at;

            // Guardar en localStorage
            localStorage.setItem('quizStateER', JSON.stringify(formattedData));
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
